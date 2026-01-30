'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSchema, type CheckoutInput, productSchema, type ProductInput, deployRequestSchema, type DeployRequestInput } from './validations'
import { calculateTotal, generateOrderToken, generateLicenseKey, generateOrderCode, type StoreProduct, type StoreOrder, type OrderWithDetails, type PaymentConfirmation } from './types'
import { sendStoreEmail, sendNewProductEmail } from '@/lib/email/store-emails'

export async function getPublishedProducts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StoreProduct[]
}

export async function getProductBySlug(slug: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data as StoreProduct
}

export async function createOrder(input: CheckoutInput) {
  const validated = checkoutSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const adminClient = createAdminClient()
  
  const { data: product, error: productError } = await adminClient
    .from('store_products')
    .select('*')
    .eq('id', validated.data.product_id)
    .eq('is_published', true)
    .single()

  if (productError || !product) {
    return { success: false, error: 'Product not found' }
  }

  const totalCents = calculateTotal(
    product as StoreProduct,
    validated.data.license_type,
    validated.data.delivery_type
  )

  const orderToken = generateOrderToken()
  const orderCode = generateOrderCode()

  // Create the order
  const { data: order, error: orderError } = await adminClient
    .from('store_orders')
    .insert({
      product_id: validated.data.product_id,
      order_code: orderCode,
      buyer_name: validated.data.buyer_name || null,
      buyer_phone: validated.data.buyer_phone,
      buyer_email: validated.data.buyer_email || null,
      license_type: validated.data.license_type,
      delivery_type: validated.data.delivery_type,
      amount_cents: totalCents,
      currency: product.currency,
      status: 'pending',
      payment_provider: 'manual',
      order_access_token: orderToken,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { success: false, error: 'Failed to create order' }
  }

  // Send order created notifications
  const orderWithDetails = {
    ...order,
    order_code: orderCode,
    product: product as StoreProduct,
    license_key: null,
    deploy_request: null,
  } as OrderWithDetails

  // Send to admin (fire and forget)
  sendStoreEmail('admin_order_created', orderWithDetails).catch(console.error)

  return {
    success: true,
    order: order as StoreOrder,
    orderToken,
    orderCode,
  }
}

export async function getOrderByToken(token: string): Promise<OrderWithDetails | null> {
  const adminClient = createAdminClient()
  
  const { data: order, error } = await adminClient
    .from('store_orders')
    .select(`
      *,
      product:store_products(*),
      license_key:store_license_keys(*),
      deploy_request:store_deploy_requests(*),
      payment_confirmation:store_payment_confirmations(*)
    `)
    .eq('order_access_token', token)
    .single()

  if (error || !order) return null

  return {
    ...order,
    product: order.product,
    license_key: Array.isArray(order.license_key) ? order.license_key[0] || null : order.license_key,
    deploy_request: Array.isArray(order.deploy_request) ? order.deploy_request[0] || null : order.deploy_request,
    payment_confirmation: Array.isArray(order.payment_confirmation) ? order.payment_confirmation[0] || null : order.payment_confirmation,
  } as OrderWithDetails
}

// Payment confirmation types
interface PaymentConfirmationInput {
  order_token: string
  payment_method: 'momo' | 'equity'
  payer_phone?: string
  transaction_reference: string
  amount: number // In dollars
  currency: string
  note?: string
  receipt_path?: string
}

// Auto-approval configuration
const AUTO_APPROVE_THRESHOLD_USD = parseInt(process.env.AUTO_APPROVE_THRESHOLD_USD || '200')
const LOW_VALUE_NO_RECEIPT_THRESHOLD = 100 // $100 - orders below this can be auto-approved without receipt

export async function submitPaymentConfirmation(input: PaymentConfirmationInput) {
  const adminClient = createAdminClient()

  // Get order by token
  const { data: order, error: orderError } = await adminClient
    .from('store_orders')
    .select('*, product:store_products(*)')
    .eq('order_access_token', input.order_token)
    .single()

  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }

  // Check if order already has a confirmation
  const { data: existingConfirmation } = await adminClient
    .from('store_payment_confirmations')
    .select('id')
    .eq('order_id', order.id)
    .single()

  if (existingConfirmation) {
    return { success: false, error: 'Payment confirmation already submitted for this order' }
  }

  // Validate MoMo requires phone
  if (input.payment_method === 'momo' && !input.payer_phone) {
    return { success: false, error: 'Phone number required for MoMo payments' }
  }

  const amountCents = Math.round(input.amount * 100)
  const orderAmountUSD = order.currency === 'USD' ? order.amount_cents / 100 : order.amount_cents / 100 / 1000 // Rough SSP to USD

  // Run auto-approval checks
  const autoApprovalResult = checkAutoApproval({
    confirmationAmountCents: amountCents,
    orderAmountCents: order.amount_cents,
    orderCreatedAt: order.created_at,
    transactionReference: input.transaction_reference,
    payerPhone: input.payer_phone,
    paymentMethod: input.payment_method,
    orderAmountUSD,
    hasReceipt: !!input.receipt_path,
  })

  // Create payment confirmation record
  const { data: confirmation, error: confirmError } = await adminClient
    .from('store_payment_confirmations')
    .insert({
      order_id: order.id,
      payment_method: input.payment_method,
      payer_phone: input.payer_phone || null,
      transaction_reference: input.transaction_reference,
      amount_cents: amountCents,
      currency: input.currency,
      receipt_path: input.receipt_path || null,
      note: input.note || null,
      auto_approved: autoApprovalResult.approved,
      review_status: autoApprovalResult.approved ? 'approved' : 'pending',
    })
    .select()
    .single()

  if (confirmError) {
    console.error('Payment confirmation error:', confirmError)
    return { success: false, error: 'Failed to submit payment confirmation' }
  }

  if (autoApprovalResult.approved) {
    // Auto-approve: Update order, generate license, create deploy request
    await processApprovedPayment(order.id, adminClient)
    
    // Send success emails
    const completeOrder = await getOrderByToken(input.order_token)
    if (completeOrder) {
      if (completeOrder.buyer_email) {
        sendStoreEmail('buyer_receipt', completeOrder).catch(console.error)
      }
      sendStoreEmail('admin_new_purchase', completeOrder).catch(console.error)
    }

    return { 
      success: true, 
      autoApproved: true,
      message: 'Payment verified! Your order is being processed.',
    }
  } else {
    // Update order to pending_verification
    await adminClient
      .from('store_orders')
      .update({ status: 'pending_verification' })
      .eq('id', order.id)

    // Notify admin of pending verification
    const orderWithDetails = {
      ...order,
      product: order.product,
      license_key: null,
      deploy_request: null,
      payment_confirmation: confirmation,
    } as OrderWithDetails

    sendStoreEmail('admin_payment_pending', orderWithDetails).catch(console.error)

    return {
      success: true,
      autoApproved: false,
      message: 'Payment confirmation received. We\'re verifying your payment and will update you shortly.',
      reason: autoApprovalResult.reason,
    }
  }
}

interface AutoApprovalInput {
  confirmationAmountCents: number
  orderAmountCents: number
  orderCreatedAt: string
  transactionReference: string
  payerPhone?: string
  paymentMethod: 'momo' | 'equity'
  orderAmountUSD: number
  hasReceipt: boolean
}

function checkAutoApproval(input: AutoApprovalInput): { approved: boolean; reason?: string } {
  // Rule 1: Amount must match exactly
  if (input.confirmationAmountCents !== input.orderAmountCents) {
    return { approved: false, reason: 'Amount mismatch' }
  }

  // Rule 2: Must be submitted within 30 minutes of order creation
  const orderTime = new Date(input.orderCreatedAt).getTime()
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  if (now - orderTime > thirtyMinutes) {
    return { approved: false, reason: 'Submitted after 30 minute window' }
  }

  // Rule 3: Transaction reference validation (min 5 chars, alphanumeric)
  if (input.transactionReference.length < 5) {
    return { approved: false, reason: 'Invalid transaction reference' }
  }
  if (!/^[a-zA-Z0-9\-_]+$/.test(input.transactionReference)) {
    return { approved: false, reason: 'Invalid transaction reference format' }
  }

  // Rule 4: MoMo requires phone
  if (input.paymentMethod === 'momo' && !input.payerPhone) {
    return { approved: false, reason: 'MoMo payment requires phone number' }
  }

  // Rule 5: Order amount must be <= threshold
  if (input.orderAmountUSD > AUTO_APPROVE_THRESHOLD_USD) {
    return { approved: false, reason: `Order exceeds $${AUTO_APPROVE_THRESHOLD_USD} auto-approval threshold` }
  }

  // Rule 6: Receipt required for orders > $100 (unless very low value)
  if (input.orderAmountUSD > LOW_VALUE_NO_RECEIPT_THRESHOLD && !input.hasReceipt) {
    return { approved: false, reason: 'Receipt required for orders over $100' }
  }

  return { approved: true }
}

async function processApprovedPayment(orderId: string, adminClient: ReturnType<typeof createAdminClient>) {
  const now = new Date().toISOString()

  // Update order status to paid
  await adminClient
    .from('store_orders')
    .update({
      status: 'paid',
      paid_at: now,
    })
    .eq('id', orderId)

  // Generate license key
  const licenseKey = generateLicenseKey()
  await adminClient
    .from('store_license_keys')
    .insert({
      order_id: orderId,
      license_key: licenseKey,
    })

  // Check if deploy request needed
  const { data: order } = await adminClient
    .from('store_orders')
    .select('delivery_type')
    .eq('id', orderId)
    .single()

  if (order && (order.delivery_type === 'deploy' || order.delivery_type === 'both')) {
    await adminClient
      .from('store_deploy_requests')
      .insert({
        order_id: orderId,
        status: 'new',
      })
  }
}

// Upload receipt to storage
export async function uploadPaymentReceipt(formData: FormData) {
  const file = formData.get('file') as File
  const orderCode = formData.get('orderCode') as string

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  if (!orderCode) {
    return { success: false, error: 'Order code required' }
  }

  const adminClient = createAdminClient()
  
  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'pdf']
  
  if (!ext || !allowedExts.includes(ext)) {
    return { success: false, error: 'Invalid file type. Allowed: PNG, JPG, WEBP, PDF' }
  }

  const filename = `proofs/${orderCode}/${Date.now()}.${ext}`

  const { error } = await adminClient.storage
    .from('store-proofs')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Receipt upload error:', error)
    return { success: false, error: 'Failed to upload receipt' }
  }

  return { success: true, path: filename }
}

// Get signed URL for receipt (admin only)
export async function getReceiptSignedUrl(path: string): Promise<string | null> {
  const adminClient = createAdminClient()
  
  const { data } = await adminClient.storage
    .from('store-proofs')
    .createSignedUrl(path, 3600) // 1 hour expiry

  return data?.signedUrl || null
}

export async function getDeliverableSignedUrl(orderId: string, productId: string): Promise<string | null> {
  const adminClient = createAdminClient()

  const { data: order } = await adminClient
    .from('store_orders')
    .select('status, delivery_type')
    .eq('id', orderId)
    .single()

  if (!order || (order.status !== 'paid' && order.status !== 'confirmed')) return null
  if (order.delivery_type !== 'download' && order.delivery_type !== 'both') return null

  const { data: product } = await adminClient
    .from('store_products')
    .select('deliverable_path')
    .eq('id', productId)
    .single()

  if (!product?.deliverable_path) return null

  const { data: signedUrl } = await adminClient.storage
    .from('store-assets')
    .createSignedUrl(product.deliverable_path, 3600)

  return signedUrl?.signedUrl || null
}

// Admin actions

export async function getAllProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StoreProduct[]
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as StoreProduct
}

export async function createProduct(input: ProductInput) {
  const validated = productSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_products')
    .insert(validated.data)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A product with this slug already exists' }
    }
    return { success: false, error: error.message }
  }

  // Revalidate store pages
  revalidatePath('/store')

  // Send new product notification to admin
  await sendNewProductEmail({
    name: data.name,
    slug: data.slug,
    base_price_cents: data.base_price_cents,
    currency: data.currency,
  })

  return { success: true, product: data as StoreProduct }
}

export async function updateProduct(id: string, input: ProductInput) {
  const validated = productSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_products')
    .update(validated.data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A product with this slug already exists' }
    }
    return { success: false, error: error.message }
  }

  // Revalidate store pages to show updated content
  revalidatePath('/store')
  revalidatePath(`/store/${data.slug}`)

  return { success: true, product: data as StoreProduct }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('store_products')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateProductImages(id: string, field: 'cover_image_path' | 'gallery_image_paths' | 'deliverable_path', value: string | string[] | null) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('store_products')
    .update({ [field]: value })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string || 'images'

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  const supabase = await createClient()
  
  // Generate unique filename
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const { error } = await supabase.storage
    .from('store-assets')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, path: filename }
}

export async function deleteProductImage(path: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from('store-assets')
    .remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getAllOrders(filters?: { status?: string; product_id?: string }) {
  const supabase = await createClient()
  let query = supabase
    .from('store_orders')
    .select(`
      *,
      product:store_products(id, name, slug)
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.product_id) {
    query = query.eq('product_id', filters.product_id)
  }

  const { data, error } = await query

  if (error) throw error
  return data as (StoreOrder & { product: Pick<StoreProduct, 'id' | 'name' | 'slug'> | null })[]
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_orders')
    .select(`
      *,
      product:store_products(*),
      license_key:store_license_keys(*),
      deploy_request:store_deploy_requests(*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  
  return {
    ...data,
    product: data.product,
    license_key: Array.isArray(data.license_key) ? data.license_key[0] || null : data.license_key,
    deploy_request: Array.isArray(data.deploy_request) ? data.deploy_request[0] || null : data.deploy_request,
  } as OrderWithDetails
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('store_orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function resendOrderEmail(orderId: string) {
  const order = await getOrderById(orderId)
  if (!order || !order.buyer_email) {
    return { success: false, error: 'Order not found or no email address' }
  }

  try {
    await sendStoreEmail('buyer_receipt', order)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function getAllDeployRequests(filters?: { status?: string }) {
  const supabase = await createClient()
  let query = supabase
    .from('store_deploy_requests')
    .select(`
      *,
      order:store_orders(
        *,
        product:store_products(id, name, slug)
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getDeployRequestById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_deploy_requests')
    .select(`
      *,
      order:store_orders(
        *,
        product:store_products(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function updateDeployRequest(id: string, input: DeployRequestInput) {
  const validated = deployRequestSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('store_deploy_requests')
    .update(validated.data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Admin: Get all payment confirmations
export async function getAllPaymentConfirmations(filters?: { status?: string }) {
  const adminClient = createAdminClient()
  
  let query = adminClient
    .from('store_payment_confirmations')
    .select(`
      *,
      order:store_orders(
        id,
        order_code,
        buyer_phone,
        buyer_email,
        buyer_name,
        amount_cents,
        currency,
        status,
        product:store_products(id, name, slug)
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('review_status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payment confirmations:', error)
    return []
  }

  return data as (PaymentConfirmation & { 
    order: StoreOrder & { product: Pick<StoreProduct, 'id' | 'name' | 'slug'> | null } 
  })[]
}

// Admin: Get payment confirmation by ID
export async function getPaymentConfirmationById(id: string) {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient
    .from('store_payment_confirmations')
    .select(`
      *,
      order:store_orders(
        *,
        product:store_products(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  
  return data as PaymentConfirmation & { 
    order: StoreOrder & { product: StoreProduct | null } 
  }
}

export async function confirmPayment(orderId: string) {
  const adminClient = createAdminClient()
  
  // Get the order with payment info
  const { data: order, error: orderError } = await adminClient
    .from('store_orders')
    .select('*, product:store_products(*)')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }

  if (order.status === 'confirmed' || order.status === 'paid') {
    return { success: false, error: 'Payment already confirmed' }
  }

  const now = new Date().toISOString()

  // Update order status
  const { error: updateOrderError } = await adminClient
    .from('store_orders')
    .update({
      status: 'paid',
      paid_at: now,
    })
    .eq('id', orderId)

  if (updateOrderError) {
    return { success: false, error: 'Failed to update order' }
  }

  // Update payment confirmation if exists
  await adminClient
    .from('store_payment_confirmations')
    .update({
      review_status: 'approved',
      reviewed_at: now,
    })
    .eq('order_id', orderId)

  // Generate license key
  const licenseKey = generateLicenseKey()
  await adminClient
    .from('store_license_keys')
    .insert({
      order_id: orderId,
      license_key: licenseKey,
    })

  // Create deploy request if needed
  if (order.delivery_type === 'deploy' || order.delivery_type === 'both') {
    await adminClient
      .from('store_deploy_requests')
      .insert({
        order_id: orderId,
        status: 'new',
      })
  }

  // Get complete order for emails
  const completeOrder = await getOrderById(orderId)
  if (completeOrder) {
    // Send emails
    try {
      if (completeOrder.buyer_email) {
        await sendStoreEmail('buyer_receipt', completeOrder)
      }
      await sendStoreEmail('admin_new_purchase', completeOrder)
    } catch (emailError) {
      console.error('Failed to send emails:', emailError)
    }
  }

  revalidatePath('/admin/store/orders')
  revalidatePath('/admin/store/payments')
  return { success: true }
}

export async function rejectPayment(orderId: string) {
  const adminClient = createAdminClient()
  
  // Get the order
  const { data: order, error: orderError } = await adminClient
    .from('store_orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }

  if (order.status === 'confirmed' || order.status === 'paid') {
    return { success: false, error: 'Cannot reject a confirmed payment' }
  }

  const now = new Date().toISOString()

  // Update order status
  const { error: updateError } = await adminClient
    .from('store_orders')
    .update({
      status: 'rejected',
    })
    .eq('id', orderId)

  if (updateError) {
    return { success: false, error: 'Failed to update order' }
  }

  // Update payment confirmation if exists
  await adminClient
    .from('store_payment_confirmations')
    .update({
      review_status: 'rejected',
      reviewed_at: now,
    })
    .eq('order_id', orderId)

  revalidatePath('/admin/store/orders')
  revalidatePath('/admin/store/payments')
  return { success: true }
}

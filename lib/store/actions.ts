'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSchema, type CheckoutInput, productSchema, type ProductInput, deployRequestSchema, type DeployRequestInput } from './validations'
import { calculateTotal, generateOrderToken, generateLicenseKey, type StoreProduct, type StoreOrder, type OrderWithDetails } from './types'
import { sendStoreEmail } from '@/lib/email/store-emails'
import { createCheckoutSession } from '@/lib/payssd/client'

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

  const supabase = await createClient()
  
  const { data: product, error: productError } = await supabase
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

  const { data: order, error: orderError } = await supabase
    .from('store_orders')
    .insert({
      product_id: validated.data.product_id,
      buyer_name: validated.data.buyer_name || null,
      buyer_phone: validated.data.buyer_phone,
      buyer_email: validated.data.buyer_email || null,
      license_type: validated.data.license_type,
      delivery_type: validated.data.delivery_type,
      amount_cents: totalCents,
      currency: product.currency,
      status: 'pending',
      payment_provider: 'payssd',
      order_access_token: orderToken,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { success: false, error: 'Failed to create order' }
  }

  // Create PaySSD checkout session
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jambisystems.com'
  const checkoutResult = await createCheckoutSession({
    amount: totalCents,
    currency: product.currency,
    customer_phone: validated.data.buyer_phone,
    customer_email: validated.data.buyer_email,
    success_url: `${siteUrl}/store/success?token=${orderToken}`,
    cancel_url: `${siteUrl}/store/checkout/${product.slug}`,
    metadata: {
      order_id: order.id,
    },
  })

  if (!checkoutResult.success || !checkoutResult.data) {
    // Order created but PaySSD failed - still return order token for manual payment
    console.error('PaySSD checkout error:', checkoutResult.error)
    return {
      success: true,
      order: order as StoreOrder,
      orderToken,
      checkoutUrl: null,
      paymentError: checkoutResult.error,
    }
  }

  // Update order with PaySSD reference
  await supabase
    .from('store_orders')
    .update({
      provider_reference: checkoutResult.data.checkout_session.id,
    })
    .eq('id', order.id)

  return {
    success: true,
    order: order as StoreOrder,
    orderToken,
    checkoutUrl: checkoutResult.data.checkout_session.url,
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
      deploy_request:store_deploy_requests(*)
    `)
    .eq('order_access_token', token)
    .single()

  if (error || !order) return null

  return {
    ...order,
    product: order.product,
    license_key: Array.isArray(order.license_key) ? order.license_key[0] || null : order.license_key,
    deploy_request: Array.isArray(order.deploy_request) ? order.deploy_request[0] || null : order.deploy_request,
  } as OrderWithDetails
}

export async function getDeliverableSignedUrl(orderId: string, productId: string): Promise<string | null> {
  const adminClient = createAdminClient()

  const { data: order } = await adminClient
    .from('store_orders')
    .select('status, delivery_type')
    .eq('id', orderId)
    .single()

  if (!order || order.status !== 'paid') return null
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

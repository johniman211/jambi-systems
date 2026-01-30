import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateLicenseKey } from '@/lib/store/types'
import { sendStoreEmail } from '@/lib/email/store-emails'
import crypto from 'crypto'

const PAYSSD_WEBHOOK_SECRET = process.env.PAYSSD_WEBHOOK_SECRET

function verifySignature(payload: string, signature: string): boolean {
  if (!PAYSSD_WEBHOOK_SECRET) {
    console.warn('PAYSSD_WEBHOOK_SECRET not configured, skipping signature verification')
    return true
  }

  const expectedSignature = crypto
    .createHmac('sha256', PAYSSD_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-payssd-signature') || ''

    // Verify webhook signature if secret is configured
    if (PAYSSD_WEBHOOK_SECRET && !verifySignature(payload, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(payload)
    
    // Expected webhook payload structure from PaySSD
    // {
    //   event: 'payment.completed' | 'payment.failed',
    //   reference: string, // Our order ID or provider reference
    //   amount: number,
    //   currency: string,
    //   status: 'success' | 'failed',
    //   metadata: { order_id: string }
    // }

    const { event, reference, status, metadata } = data
    const orderId = metadata?.order_id || reference

    if (!orderId) {
      console.error('No order ID in webhook payload')
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('store_orders')
      .select(`
        *,
        product:store_products(*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', orderId)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Handle payment events
    if (event === 'payment.completed' && status === 'success') {
      // Update order status to paid
      const { error: updateError } = await supabase
        .from('store_orders')
        .update({
          status: 'paid',
          provider_reference: reference,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Failed to update order:', updateError)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
      }

      // Generate license key
      const licenseKey = generateLicenseKey()
      const { error: licenseError } = await supabase
        .from('store_license_keys')
        .insert({
          order_id: orderId,
          license_key: licenseKey,
        })

      if (licenseError) {
        console.error('Failed to create license key:', licenseError)
      }

      // Create deploy request if deployment was selected
      if (order.delivery_type === 'deploy' || order.delivery_type === 'both') {
        const { error: deployError } = await supabase
          .from('store_deploy_requests')
          .insert({
            order_id: orderId,
            status: 'new',
          })

        if (deployError) {
          console.error('Failed to create deploy request:', deployError)
        }
      }

      // Fetch complete order with relations for emails
      const { data: completeOrder } = await supabase
        .from('store_orders')
        .select(`
          *,
          product:store_products(*),
          license_key:store_license_keys(*),
          deploy_request:store_deploy_requests(*)
        `)
        .eq('id', orderId)
        .single()

      if (completeOrder) {
        const orderWithDetails = {
          ...completeOrder,
          product: completeOrder.product,
          license_key: Array.isArray(completeOrder.license_key) 
            ? completeOrder.license_key[0] || null 
            : completeOrder.license_key,
          deploy_request: Array.isArray(completeOrder.deploy_request) 
            ? completeOrder.deploy_request[0] || null 
            : completeOrder.deploy_request,
        }

        // Send emails
        try {
          // Buyer receipt
          if (orderWithDetails.buyer_email) {
            await sendStoreEmail('buyer_receipt', orderWithDetails as any)
          }

          // Buyer deploy notification
          if (orderWithDetails.deploy_request && orderWithDetails.buyer_email) {
            await sendStoreEmail('buyer_deploy_request', orderWithDetails as any)
          }

          // Admin notifications
          await sendStoreEmail('admin_new_purchase', orderWithDetails as any)

          if (orderWithDetails.deploy_request) {
            await sendStoreEmail('admin_deploy_request', orderWithDetails as any)
          }
        } catch (emailError) {
          console.error('Failed to send emails:', emailError)
          // Don't fail the webhook for email errors
        }
      }

      console.log('Payment completed for order:', orderId)
      return NextResponse.json({ success: true, message: 'Payment processed' })
    }

    if (event === 'payment.failed' || status === 'failed') {
      // Update order status to failed
      const { error: updateError } = await supabase
        .from('store_orders')
        .update({
          status: 'failed',
          provider_reference: reference,
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Failed to update order:', updateError)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
      }

      console.log('Payment failed for order:', orderId)
      return NextResponse.json({ success: true, message: 'Payment failure recorded' })
    }

    // Unknown event type
    console.log('Unhandled webhook event:', event)
    return NextResponse.json({ success: true, message: 'Event acknowledged' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle webhook verification (GET request)
export async function GET(request: NextRequest) {
  // Some payment providers send a verification request
  const challenge = request.nextUrl.searchParams.get('challenge')
  if (challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ status: 'Webhook endpoint active' })
}

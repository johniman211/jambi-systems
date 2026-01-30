import { createAdminClient } from '@/lib/supabase/admin'
import { createWebhookSignature } from './auth'
import type { WebhookEvent, WebhookPayload, PaymentResponse, PayssdWebhook } from './types'

// Dispatch webhook to all configured endpoints for a merchant
export async function dispatchWebhook(
  merchantId: string,
  event: WebhookEvent,
  payment: PaymentResponse
): Promise<void> {
  const supabase = createAdminClient()

  // Get all active webhooks for this merchant that subscribe to this event
  const { data: webhooks, error } = await supabase
    .from('payssd_webhooks')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_active', true)
    .contains('events', [event])

  if (error || !webhooks || webhooks.length === 0) {
    return
  }

  const timestamp = new Date().toISOString()
  const payload: WebhookPayload = {
    event,
    timestamp,
    data: { payment },
  }

  const payloadString = JSON.stringify(payload)

  // Send webhooks in parallel
  await Promise.allSettled(
    webhooks.map((webhook) => sendWebhook(webhook as PayssdWebhook, payloadString, timestamp, payment.id))
  )
}

async function sendWebhook(
  webhook: PayssdWebhook,
  payloadString: string,
  timestamp: string,
  paymentId: string
): Promise<void> {
  const supabase = createAdminClient()
  const signature = createWebhookSignature(payloadString, timestamp, webhook.secret)

  let responseStatus: number | null = null
  let responseBody: string | null = null
  let delivered = false

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payssd-Signature': signature,
        'X-Payssd-Timestamp': timestamp,
        'X-Payssd-Event': JSON.parse(payloadString).event,
      },
      body: payloadString,
    })

    responseStatus = response.status
    responseBody = await response.text().catch(() => null)
    delivered = response.ok
  } catch (err) {
    responseBody = err instanceof Error ? err.message : 'Unknown error'
  }

  // Log the webhook delivery attempt
  await supabase.from('payssd_webhook_logs').insert({
    webhook_id: webhook.id,
    payment_id: paymentId,
    event: JSON.parse(payloadString).event,
    payload: JSON.parse(payloadString),
    response_status: responseStatus,
    response_body: responseBody,
    attempts: 1,
    delivered_at: delivered ? new Date().toISOString() : null,
  })
}

// Format payment for API response
export function formatPaymentResponse(payment: any): PaymentResponse {
  return {
    id: payment.id,
    reference_code: payment.reference_code,
    amount: parseFloat(payment.amount),
    currency: payment.currency,
    status: payment.status,
    payment_method: payment.payment_method,
    customer_phone: payment.customer_phone,
    customer_email: payment.customer_email,
    description: payment.description,
    external_id: payment.external_id,
    metadata: payment.metadata || {},
    transaction_id: payment.transaction_id,
    proof_url: payment.proof_url,
    source: payment.source,
    created_at: payment.created_at,
    expires_at: payment.expires_at,
    matched_at: payment.matched_at,
    confirmed_at: payment.confirmed_at,
  }
}

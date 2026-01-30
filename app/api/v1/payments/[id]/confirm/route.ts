import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { authenticateApiRequest } from '@/lib/payssd/auth'
import { dispatchWebhook, formatPaymentResponse } from '@/lib/payssd/webhooks'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the request
  const { auth, error: authError } = await authenticateApiRequest(request)
  if (authError) return authError

  const { merchant } = auth!
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Payment ID is required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Find the payment by UUID, reference_code, or external_id
  let payment = null
  let paymentId = null

  // Check if it's a UUID format
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  if (isUuid) {
    const { data } = await supabase
      .from('payssd_payments')
      .select('*')
      .eq('id', id)
      .eq('merchant_id', merchant.id)
      .single()
    payment = data
    paymentId = id
  }

  if (!payment) {
    // Search by reference_code
    const { data } = await supabase
      .from('payssd_payments')
      .select('*')
      .eq('reference_code', id)
      .eq('merchant_id', merchant.id)
      .single()
    payment = data
    if (data) paymentId = data.id
  }

  if (!payment) {
    // Search by external_id
    const { data } = await supabase
      .from('payssd_payments')
      .select('*')
      .eq('external_id', id)
      .eq('merchant_id', merchant.id)
      .single()
    payment = data
    if (data) paymentId = data.id
  }

  if (!payment) {
    return NextResponse.json(
      { success: false, error: 'Payment not found' },
      { status: 404 }
    )
  }

  // Check if payment can be confirmed
  if (payment.status === 'confirmed') {
    return NextResponse.json(
      { success: false, error: 'Payment is already confirmed' },
      { status: 400 }
    )
  }

  if (payment.status === 'rejected') {
    return NextResponse.json(
      { success: false, error: 'Cannot confirm a rejected payment' },
      { status: 400 }
    )
  }

  if (payment.status === 'expired') {
    return NextResponse.json(
      { success: false, error: 'Cannot confirm an expired payment' },
      { status: 400 }
    )
  }

  // Update payment status to confirmed
  const confirmedAt = new Date().toISOString()
  const { data: updatedPayment, error: updateError } = await supabase
    .from('payssd_payments')
    .update({
      status: 'confirmed',
      confirmed_at: confirmedAt,
    })
    .eq('id', paymentId)
    .select()
    .single()

  if (updateError || !updatedPayment) {
    console.error('Failed to confirm payment:', updateError)
    return NextResponse.json(
      { success: false, error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }

  const paymentResponse = formatPaymentResponse(updatedPayment)

  // Dispatch webhook (fire and forget)
  dispatchWebhook(merchant.id, 'payment.confirmed', paymentResponse).catch(console.error)

  return NextResponse.json({
    success: true,
    message: 'Payment confirmed successfully',
    payment: paymentResponse,
  })
}

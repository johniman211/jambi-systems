import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { authenticateApiRequest, generateReferenceCode } from '@/lib/payssd/auth'
import { dispatchWebhook, formatPaymentResponse } from '@/lib/payssd/webhooks'
import type { CreatePaymentRequest } from '@/lib/payssd/types'

export async function POST(request: NextRequest) {
  // Authenticate the request
  const { auth, error: authError } = await authenticateApiRequest(request)
  if (authError) return authError

  const { merchant } = auth!

  try {
    const body: CreatePaymentRequest = await request.json()

    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      )
    }

    if (!body.customer_phone) {
      return NextResponse.json(
        { success: false, error: 'Customer phone is required' },
        { status: 400 }
      )
    }

    // Set defaults
    const currency = body.currency || 'SSP'
    const paymentMethod = body.payment_method || 'mtn_momo'
    const expiresInHours = body.expires_in_hours || 24

    // Calculate expiry time
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresInHours)

    // Generate unique reference code
    const referenceCode = generateReferenceCode()

    const supabase = createAdminClient()

    // Create the payment
    const { data: payment, error: insertError } = await supabase
      .from('payssd_payments')
      .insert({
        merchant_id: merchant.id,
        reference_code: referenceCode,
        amount: body.amount,
        currency,
        status: 'pending',
        payment_method: paymentMethod,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        description: body.description || null,
        external_id: body.external_id || null,
        metadata: body.metadata || {},
        source: 'api',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (insertError || !payment) {
      console.error('Failed to create payment:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create payment' },
        { status: 500 }
      )
    }

    const paymentResponse = formatPaymentResponse(payment)

    // Build payment instructions
    const paymentInstructions: Record<string, any> = {}
    
    if (paymentMethod === 'mtn_momo' && merchant.mtn_momo_number) {
      paymentInstructions.mtn_momo_number = merchant.mtn_momo_number
      paymentInstructions.instructions = `Send ${currency} ${body.amount} to ${merchant.mtn_momo_number}. Include reference code: ${referenceCode}`
    } else if (paymentMethod === 'bank_transfer' && merchant.bank_account_info) {
      paymentInstructions.bank_account = merchant.bank_account_info
      paymentInstructions.instructions = `Transfer ${currency} ${body.amount} to the bank account. Include reference code: ${referenceCode}`
    } else {
      paymentInstructions.instructions = `Pay ${currency} ${body.amount}. Reference code: ${referenceCode}`
    }

    // Dispatch webhook (fire and forget)
    dispatchWebhook(merchant.id, 'payment.created', paymentResponse).catch(console.error)

    return NextResponse.json({
      success: true,
      payment: paymentResponse,
      payment_instructions: paymentInstructions,
      merchant: {
        name: merchant.name,
      },
    })
  } catch (err) {
    console.error('Create payment error:', err)
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

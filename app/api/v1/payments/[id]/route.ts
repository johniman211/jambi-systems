import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { authenticateApiRequest } from '@/lib/payssd/auth'
import { formatPaymentResponse } from '@/lib/payssd/webhooks'

export async function GET(
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

  // Try to find payment by UUID, reference_code, or external_id
  let payment = null

  // Check if it's a UUID format
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  if (isUuid) {
    // Search by UUID
    const { data } = await supabase
      .from('payssd_payments')
      .select('*')
      .eq('id', id)
      .eq('merchant_id', merchant.id)
      .single()
    payment = data
  }

  if (!payment) {
    // Search by reference_code (10-digit number)
    const { data } = await supabase
      .from('payssd_payments')
      .select('*')
      .eq('reference_code', id)
      .eq('merchant_id', merchant.id)
      .single()
    payment = data
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
  }

  if (!payment) {
    return NextResponse.json(
      { success: false, error: 'Payment not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    payment: formatPaymentResponse(payment),
  })
}

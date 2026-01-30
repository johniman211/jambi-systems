import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { authenticateApiRequest } from '@/lib/payssd/auth'
import { formatPaymentResponse } from '@/lib/payssd/webhooks'

export async function GET(request: NextRequest) {
  // Authenticate the request
  const { auth, error: authError } = await authenticateApiRequest(request)
  if (authError) return authError

  const { merchant } = auth!

  // Parse query parameters
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const customerPhone = searchParams.get('customer_phone')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const supabase = createAdminClient()

  // Build query
  let query = supabase
    .from('payssd_payments')
    .select('*', { count: 'exact' })
    .eq('merchant_id', merchant.id)
    .order('created_at', { ascending: false })

  // Apply filters
  if (status) {
    const validStatuses = ['pending', 'matched', 'confirmed', 'rejected', 'expired']
    if (validStatuses.includes(status)) {
      query = query.eq('status', status)
    }
  }

  if (customerPhone) {
    query = query.eq('customer_phone', customerPhone)
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: payments, count, error } = await query

  if (error) {
    console.error('Failed to list payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve payments' },
      { status: 500 }
    )
  }

  const total = count || 0

  return NextResponse.json({
    success: true,
    payments: (payments || []).map(formatPaymentResponse),
    pagination: {
      total,
      limit,
      offset,
      has_more: offset + limit < total,
    },
  })
}

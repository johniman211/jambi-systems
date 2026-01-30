const PAYSSD_API_KEY = process.env.PAYSSD_SECRET_KEY
const BASE_URL = 'https://www.payssd.com/api/v1'

export interface CheckoutSessionRequest {
  price_id?: string
  amount?: number
  currency?: string
  customer_phone: string
  customer_email?: string
  success_url?: string
  cancel_url?: string
  metadata?: Record<string, any>
}

export interface CheckoutSession {
  id: string
  url: string
  reference_code: string
  amount: number
  currency: string
  expires_at: string
  payment_methods: {
    mtn_momo?: {
      number: string
      name: string
    }
  }
}

export interface CheckoutResponse {
  success: boolean
  data?: {
    checkout_session: CheckoutSession
  }
  error?: string
}

export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutResponse> {
  if (!PAYSSD_API_KEY) {
    console.error('PAYSSD_SECRET_KEY not configured')
    return { success: false, error: 'Payment gateway not configured' }
  }

  try {
    const response = await fetch(`${BASE_URL}/checkout/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSSD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create checkout session' }
    }

    return data as CheckoutResponse
  } catch (error) {
    console.error('PaySSD checkout error:', error)
    return { success: false, error: 'Payment service unavailable' }
  }
}

export interface AccessCheckRequest {
  product_id: string
  customer_phone: string
}

export interface AccessCheckResponse {
  success: boolean
  data?: {
    has_access: boolean
    subscription?: {
      id: string
      status: string
      current_period_end: string
      days_remaining: number
      is_renewable: boolean
    }
  }
  error?: string
}

export async function checkCustomerAccess(
  request: AccessCheckRequest
): Promise<AccessCheckResponse> {
  if (!PAYSSD_API_KEY) {
    return { success: false, error: 'Payment gateway not configured' }
  }

  try {
    const response = await fetch(`${BASE_URL}/access/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSSD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  } catch (error) {
    console.error('PaySSD access check error:', error)
    return { success: false, error: 'Payment service unavailable' }
  }
}

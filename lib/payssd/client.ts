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

  // Either price_id or amount is required
  if (!request.price_id && !request.amount) {
    console.error('PaySSD requires either price_id or amount')
    return { success: false, error: 'Payment amount not specified' }
  }

  try {
    console.log('PaySSD request:', JSON.stringify(request))
    
    // Build request body - use price_id if available, otherwise use amount
    const requestBody: Record<string, any> = {
      customer_phone: request.customer_phone,
      customer_email: request.customer_email,
      success_url: request.success_url,
      cancel_url: request.cancel_url,
      metadata: request.metadata,
    }

    if (request.price_id) {
      requestBody.price_id = request.price_id
    } else {
      requestBody.amount = request.amount
      requestBody.currency = request.currency || 'SSP'
    }
    
    const response = await fetch(`${BASE_URL}/checkout/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSSD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const text = await response.text()
    
    // Check if response is JSON
    if (!text.startsWith('{') && !text.startsWith('[')) {
      console.error('PaySSD returned non-JSON:', text.substring(0, 200))
      return { success: false, error: 'Payment service error - please try again' }
    }

    const data = JSON.parse(text)
    console.log('PaySSD response:', JSON.stringify(data))

    if (!response.ok) {
      console.error('PaySSD error response:', data)
      return { success: false, error: data.error || data.message || 'Failed to create checkout session' }
    }

    // Handle response format
    if (data.data?.checkout_session) {
      return data as CheckoutResponse
    }
    
    if (data.checkout_session) {
      return { success: true, data: { checkout_session: data.checkout_session } }
    }

    // If response has url directly
    if (data.url) {
      return {
        success: true,
        data: {
          checkout_session: {
            id: data.id || 'unknown',
            url: data.url,
            reference_code: data.reference_code || '',
            amount: data.amount || 0,
            currency: data.currency || 'SSP',
            expires_at: data.expires_at || '',
            payment_methods: data.payment_methods || {},
          }
        }
      }
    }

    console.error('Unexpected PaySSD response format:', data)
    return { success: false, error: 'Unexpected response from payment gateway' }
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

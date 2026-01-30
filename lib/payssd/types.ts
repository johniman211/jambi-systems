// PaySSD API Types

export interface PayssdMerchant {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  mtn_momo_number: string | null
  bank_account_info: Record<string, any> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PayssdApiKey {
  id: string
  merchant_id: string
  key_prefix: string
  key_hash: string
  name: string
  is_live: boolean
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

export interface PayssdPayment {
  id: string
  merchant_id: string
  reference_code: string
  amount: number
  currency: string
  status: 'pending' | 'matched' | 'confirmed' | 'rejected' | 'expired'
  payment_method: 'mtn_momo' | 'bank_transfer'
  customer_phone: string
  customer_email: string | null
  description: string | null
  external_id: string | null
  metadata: Record<string, any>
  transaction_id: string | null
  proof_url: string | null
  source: 'api' | 'dashboard' | 'checkout'
  expires_at: string
  matched_at: string | null
  confirmed_at: string | null
  rejected_at: string | null
  created_at: string
  updated_at: string
}

export interface PayssdWebhook {
  id: string
  merchant_id: string
  url: string
  secret: string
  events: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PayssdWebhookLog {
  id: string
  webhook_id: string
  payment_id: string | null
  event: string
  payload: Record<string, any>
  response_status: number | null
  response_body: string | null
  attempts: number
  delivered_at: string | null
  created_at: string
}

// API Request/Response Types

export interface CreatePaymentRequest {
  amount: number
  currency?: string
  customer_phone: string
  customer_email?: string
  description?: string
  external_id?: string
  metadata?: Record<string, any>
  payment_method?: 'mtn_momo' | 'bank_transfer'
  expires_in_hours?: number
}

export interface PaymentResponse {
  id: string
  reference_code: string
  amount: number
  currency: string
  status: string
  payment_method: string
  customer_phone: string
  customer_email: string | null
  description: string | null
  external_id: string | null
  metadata: Record<string, any>
  transaction_id: string | null
  proof_url: string | null
  source: string
  created_at: string
  expires_at: string
  matched_at: string | null
  confirmed_at: string | null
}

export interface PaymentInstructions {
  mtn_momo_number?: string
  bank_account?: {
    bank_name: string
    account_number: string
    account_name: string
  }
  instructions: string
}

export interface CreatePaymentResponse {
  success: boolean
  payment?: PaymentResponse
  payment_instructions?: PaymentInstructions
  merchant?: {
    name: string
  }
  error?: string
}

export interface GetPaymentResponse {
  success: boolean
  payment?: PaymentResponse
  error?: string
}

export interface ListPaymentsResponse {
  success: boolean
  payments?: PaymentResponse[]
  pagination?: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
  error?: string
}

export interface ConfirmPaymentResponse {
  success: boolean
  message?: string
  payment?: PaymentResponse
  error?: string
}

export type WebhookEvent = 
  | 'payment.created' 
  | 'payment.confirmed' 
  | 'payment.rejected' 
  | 'payment.expired'

export interface WebhookPayload {
  event: WebhookEvent
  timestamp: string
  data: {
    payment: PaymentResponse
  }
}

// Auth context passed to API handlers
export interface ApiAuthContext {
  merchant: PayssdMerchant
  apiKey: PayssdApiKey
}

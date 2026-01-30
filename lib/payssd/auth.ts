import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'
import type { ApiAuthContext, PayssdMerchant, PayssdApiKey } from './types'

// Hash an API key for comparison
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// Generate a new API key
export function generateApiKey(isLive: boolean): { key: string; prefix: string; hash: string } {
  const prefix = isLive ? 'sk_live_' : 'sk_test_'
  const randomPart = crypto.randomBytes(24).toString('base64url')
  const key = `${prefix}${randomPart}`
  const hash = hashApiKey(key)
  return { key, prefix, hash }
}

// Generate a 10-digit reference code
export function generateReferenceCode(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

// Generate webhook secret
export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(32).toString('base64url')}`
}

// Authenticate API request and return merchant context
export async function authenticateApiRequest(
  request: NextRequest
): Promise<{ auth: ApiAuthContext | null; error: NextResponse | null }> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, error: 'Missing or invalid Authorization header' },
        { status: 401 }
      ),
    }
  }

  const apiKey = authHeader.slice(7) // Remove 'Bearer '
  
  if (!apiKey || apiKey.length < 10) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, error: 'Invalid API key format' },
        { status: 401 }
      ),
    }
  }

  // Extract prefix (first 8 chars like "sk_live_" or "sk_test_")
  const prefix = apiKey.substring(0, 8)
  const keyHash = hashApiKey(apiKey)

  const supabase = createAdminClient()

  // Find the API key
  const { data: apiKeyRecord, error: keyError } = await supabase
    .from('payssd_api_keys')
    .select('*')
    .eq('key_prefix', prefix)
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single()

  if (keyError || !apiKeyRecord) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      ),
    }
  }

  // Get the merchant
  const { data: merchant, error: merchantError } = await supabase
    .from('payssd_merchants')
    .select('*')
    .eq('id', apiKeyRecord.merchant_id)
    .eq('is_active', true)
    .single()

  if (merchantError || !merchant) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, error: 'Merchant account not found or inactive' },
        { status: 401 }
      ),
    }
  }

  // Update last used timestamp (fire and forget)
  supabase
    .from('payssd_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', apiKeyRecord.id)
    .then(() => {})

  return {
    auth: {
      merchant: merchant as PayssdMerchant,
      apiKey: apiKeyRecord as PayssdApiKey,
    },
    error: null,
  }
}

// Create webhook signature
export function createWebhookSignature(
  payload: string,
  timestamp: string,
  secret: string
): string {
  const signaturePayload = `${timestamp}.${payload}`
  return crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex')
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  timestamp: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createWebhookSignature(payload, timestamp, secret)
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

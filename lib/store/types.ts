export type LicenseType = 'single' | 'multi'
export type DeliveryType = 'download' | 'deploy' | 'both'
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DeployRequestStatus = 'new' | 'in_progress' | 'done'

export interface StoreProduct {
  id: string
  name: string
  slug: string
  summary: string
  description: string
  category: string
  base_price_cents: number
  currency: string
  multi_use_price_cents: number
  deploy_addon_price_cents: number
  demo_url: string | null
  cover_image_path: string | null
  gallery_image_paths: string[] | null
  deliverable_path: string | null
  whats_included: string[] | null
  requirements: string[] | null
  support_info: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface StoreOrder {
  id: string
  product_id: string | null
  buyer_name: string | null
  buyer_phone: string
  buyer_email: string | null
  license_type: LicenseType
  delivery_type: DeliveryType
  amount_cents: number
  currency: string
  status: OrderStatus
  payment_provider: string
  provider_reference: string | null
  order_access_token: string
  paid_at: string | null
  created_at: string
  product?: StoreProduct
}

export interface StoreLicenseKey {
  id: string
  order_id: string
  license_key: string
  issued_at: string
}

export interface StoreDeployRequest {
  id: string
  order_id: string
  status: DeployRequestStatus
  notes: string | null
  created_at: string
  updated_at: string
  order?: StoreOrder
}

export interface CheckoutFormData {
  license_type: LicenseType
  delivery_type: DeliveryType
  buyer_name?: string
  buyer_phone: string
  buyer_email?: string
}

export interface OrderWithDetails extends Omit<StoreOrder, 'product'> {
  product: StoreProduct | null
  license_key: StoreLicenseKey | null
  deploy_request: StoreDeployRequest | null
}

export function formatPrice(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function calculateTotal(
  product: StoreProduct,
  licenseType: LicenseType,
  deliveryType: DeliveryType
): number {
  let total = product.base_price_cents

  if (licenseType === 'multi') {
    total += product.multi_use_price_cents
  }

  if (deliveryType === 'deploy' || deliveryType === 'both') {
    total += product.deploy_addon_price_cents
  }

  return total
}

export function generateOrderToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let token = ''
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function generateLicenseKey(): string {
  const segments = []
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let s = 0; s < 4; s++) {
    let segment = ''
    for (let i = 0; i < 5; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return segments.join('-')
}

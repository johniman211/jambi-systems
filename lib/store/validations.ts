import { z } from 'zod'

export const checkoutSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
  license_type: z.enum(['single', 'multi'], {
    required_error: 'Please select a license type',
  }),
  delivery_type: z.enum(['download', 'deploy', 'both'], {
    required_error: 'Please select a delivery option',
  }),
  buyer_name: z.string().optional(),
  buyer_phone: z
    .string()
    .min(9, 'Phone number must be at least 9 digits')
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number'),
  buyer_email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  base_price_cents: z.coerce.number().min(100, 'Price must be at least $1.00'),
  currency: z.string().default('USD'),
  multi_use_price_cents: z.coerce.number().min(0).default(0),
  deploy_addon_price_cents: z.coerce.number().min(0).default(0),
  demo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  cover_image_path: z.string().optional(),
  gallery_image_paths: z.array(z.string()).optional(),
  deliverable_path: z.string().optional(),
  payssd_price_id: z.string().optional(),
  whats_included: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  support_info: z.string().optional(),
  is_published: z.boolean().default(false),
})

export type ProductInput = z.infer<typeof productSchema>

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'failed', 'refunded']),
})

export const deployRequestSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done']),
  notes: z.string().optional(),
})

export type DeployRequestInput = z.infer<typeof deployRequestSchema>

export const PRODUCT_CATEGORIES = [
  { value: 'subscription', label: 'Subscription Systems' },
  { value: 'payment', label: 'Payment Systems' },
  { value: 'tracking', label: 'Tracking Systems' },
  { value: 'management', label: 'Management Systems' },
  { value: 'dashboard', label: 'Dashboard Systems' },
  { value: 'other', label: 'Other' },
] as const

export function getCategoryLabel(value: string): string {
  const category = PRODUCT_CATEGORIES.find((c) => c.value === value)
  return category?.label || value
}

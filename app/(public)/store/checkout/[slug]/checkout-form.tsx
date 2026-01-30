'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createOrder } from '@/lib/store/actions'
import { formatPrice, calculateTotal, type StoreProduct, type LicenseType, type DeliveryType } from '@/lib/store/types'
import { Check, Loader2 } from 'lucide-react'

interface CheckoutFormProps {
  product: StoreProduct
}

export function CheckoutForm({ product }: CheckoutFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [licenseType, setLicenseType] = useState<LicenseType>('single')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('download')
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')

  const total = calculateTotal(product, licenseType, deliveryType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createOrder({
        product_id: product.id,
        license_type: licenseType,
        delivery_type: deliveryType,
        buyer_name: buyerName || undefined,
        buyer_phone: buyerPhone,
        buyer_email: buyerEmail || undefined,
      })

      if (!result.success) {
        setError(result.error || 'Failed to create order')
        return
      }

      // Redirect to payment instructions page
      router.push(`/store/pay/${result.orderToken}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Summary */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Product</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-background-secondary rounded-xl flex items-center justify-center flex-shrink-0">
            {product.cover_image_path ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${product.cover_image_path}`}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-foreground-secondary">{product.summary}</p>
          </div>
        </div>
      </div>

      {/* License Selection */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">License Type</h2>
        <div className="space-y-3">
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              licenseType === 'single'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="license"
                value="single"
                checked={licenseType === 'single'}
                onChange={() => setLicenseType('single')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  licenseType === 'single' ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {licenseType === 'single' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-foreground">Single Organization</p>
                <p className="text-sm text-foreground-secondary">Use for one business or project</p>
              </div>
            </div>
            <span className="text-sm text-foreground-secondary">Included</span>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              licenseType === 'multi'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="license"
                value="multi"
                checked={licenseType === 'multi'}
                onChange={() => setLicenseType('multi')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  licenseType === 'multi' ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {licenseType === 'multi' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-foreground">Multi-Use License</p>
                <p className="text-sm text-foreground-secondary">Use for unlimited projects</p>
              </div>
            </div>
            <span className="font-medium text-accent">
              +{formatPrice(product.multi_use_price_cents, product.currency)}
            </span>
          </label>
        </div>
      </div>

      {/* Delivery Selection */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Delivery Option</h2>
        <div className="space-y-3">
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              deliveryType === 'download'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value="download"
                checked={deliveryType === 'download'}
                onChange={() => setDeliveryType('download')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'download' ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {deliveryType === 'download' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-foreground">Download Only</p>
                <p className="text-sm text-foreground-secondary">Get source code and deploy yourself</p>
              </div>
            </div>
            <span className="text-sm text-foreground-secondary">Included</span>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              deliveryType === 'deploy'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value="deploy"
                checked={deliveryType === 'deploy'}
                onChange={() => setDeliveryType('deploy')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'deploy' ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {deliveryType === 'deploy' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-foreground">We Deploy For You</p>
                <p className="text-sm text-foreground-secondary">We set up and configure everything</p>
              </div>
            </div>
            <span className="font-medium text-accent">
              +{formatPrice(product.deploy_addon_price_cents, product.currency)}
            </span>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              deliveryType === 'both'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value="both"
                checked={deliveryType === 'both'}
                onChange={() => setDeliveryType('both')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'both' ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {deliveryType === 'both' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-foreground">Download + Deploy</p>
                <p className="text-sm text-foreground-secondary">Get source code and we deploy it</p>
              </div>
            </div>
            <span className="font-medium text-accent">
              +{formatPrice(product.deploy_addon_price_cents, product.currency)}
            </span>
          </label>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Your Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name <span className="text-foreground-muted">(optional)</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+211 9XX XXX XXX"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              required
            />
            <p className="text-xs text-foreground-muted mt-1">
              Required for payment verification and delivery
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-foreground-muted">(optional but recommended)</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
            <p className="text-xs text-foreground-muted mt-1">
              Receive order confirmation and download link via email
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-secondary">{product.name}</span>
            <span className="text-foreground">{formatPrice(product.base_price_cents, product.currency)}</span>
          </div>

          {licenseType === 'multi' && (
            <div className="flex justify-between text-sm">
              <span className="text-foreground-secondary">Multi-use license</span>
              <span className="text-foreground">+{formatPrice(product.multi_use_price_cents, product.currency)}</span>
            </div>
          )}

          {(deliveryType === 'deploy' || deliveryType === 'both') && (
            <div className="flex justify-between text-sm">
              <span className="text-foreground-secondary">Deployment service</span>
              <span className="text-foreground">+{formatPrice(product.deploy_addon_price_cents, product.currency)}</span>
            </div>
          )}

          <div className="border-t border-border pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-accent">{formatPrice(total, product.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Order...
          </>
        ) : (
          `Continue to Payment — ${formatPrice(total, product.currency)}`
        )}
      </Button>

      <p className="text-xs text-center text-foreground-muted">
        By completing this purchase you agree to our{' '}
        <a href="/store/terms" className="underline hover:text-foreground">
          Store Terms
        </a>{' '}
        and{' '}
        <a href="/store/license" className="underline hover:text-foreground">
          License Agreement
        </a>
      </p>
    </form>
  )
}

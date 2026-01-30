import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button, ScrollReveal } from '@/components/ui'
import { SuccessIllustration } from '@/components/illustrations/StoreIllustration'
import { getOrderByToken } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { ArrowRight, Clock, Download, Rocket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Placed',
  description: 'Your order has been placed successfully.',
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) {
    redirect('/store')
  }

  const order = await getOrderByToken(token)

  if (!order) {
    redirect('/store')
  }

  const isPaid = order.status === 'paid'
  const hasDownload = order.delivery_type === 'download' || order.delivery_type === 'both'
  const hasDeploy = order.delivery_type === 'deploy' || order.delivery_type === 'both'

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="container-wide relative">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <SuccessIllustration />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 mt-8">
              {isPaid ? 'Payment Confirmed!' : 'Order Placed!'}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-foreground-secondary text-lg mb-8">
              {isPaid
                ? `Thank you for your purchase of ${order.product?.name || 'this product'}.`
                : 'Your order has been created. Please complete the payment to access your purchase.'}
            </p>
          </ScrollReveal>

          {/* Order Summary Card */}
          <ScrollReveal delay={0.4}>
            <div className="bg-card rounded-2xl border border-border p-6 text-left mb-8">
              <h2 className="font-semibold text-foreground mb-4">Order Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Order ID</span>
                  <span className="font-mono text-foreground">{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Product</span>
                  <span className="text-foreground">{order.product?.name || 'Product'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">License</span>
                  <span className="text-foreground">
                    {order.license_type === 'multi' ? 'Multi-use' : 'Single organization'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Delivery</span>
                  <span className="text-foreground">
                    {order.delivery_type === 'both'
                      ? 'Download + Deploy'
                      : order.delivery_type === 'deploy'
                      ? 'Deploy for you'
                      : 'Download'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Status</span>
                  <span className={`font-medium ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                    {isPaid ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-accent">{formatPrice(order.amount_cents, order.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Status-based content */}
          {isPaid ? (
            <>
              {/* License Key */}
              {order.license_key && (
                <ScrollReveal delay={0.5}>
                  <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold text-foreground mb-2">Your License Key</h3>
                    <p className="font-mono text-lg text-accent bg-accent/10 px-4 py-3 rounded-lg">
                      {order.license_key.license_key}
                    </p>
                    <p className="text-xs text-foreground-muted mt-2">
                      Keep this key safe. It's required for product activation.
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {/* Download Section */}
              {hasDownload && (
                <ScrollReveal delay={0.6}>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Download className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Download Ready</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-4">
                      Your purchase is ready to download.
                    </p>
                    <Link href={`/store/orders/${order.order_access_token}`}>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Go to Downloads
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              )}

              {/* Deploy Section */}
              {hasDeploy && (
                <ScrollReveal delay={0.7}>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Rocket className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Deployment Requested</h3>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Our team will contact you at <strong>{order.buyer_phone}</strong> within 24-48 hours to begin the deployment process.
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </>
          ) : (
            <ScrollReveal delay={0.5}>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Awaiting Payment</h3>
                </div>
                <p className="text-amber-700 text-sm mb-4">
                  Complete your payment via PaySSD to access your purchase.
                </p>
                {order.payssd_checkout_url ? (
                  <a href={order.payssd_checkout_url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Complete Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <p className="text-amber-600 text-sm">
                    Payment link unavailable. Please contact support.
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/store/orders/${order.order_access_token}`}>
                <Button variant="outline">
                  View Order Details
                </Button>
              </Link>
              <Link href="/store">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <p className="text-sm text-foreground-muted mt-8">
              Save this link to access your order anytime:<br />
              <code className="text-xs bg-background-secondary px-2 py-1 rounded mt-1 inline-block">
                {process.env.NEXT_PUBLIC_SITE_URL}/store/orders/{order.order_access_token}
              </code>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

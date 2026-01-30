import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOrderByToken } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { ScrollReveal } from '@/components/ui'
import { Clock, Copy, CheckCircle, Phone, AlertCircle } from 'lucide-react'
import { PaymentStatus } from './payment-status'
import { CopyButton } from './copy-button'

interface PageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'Complete Payment - PaySSD',
    description: 'Complete your payment via MTN MoMo',
  }
}

export default async function PaymentPage({ params }: PageProps) {
  const { token } = await params
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  // Get payment details from environment
  const momoNumber = process.env.PAYSSD_MOMO_NUMBER || '+211912000000'
  const businessName = process.env.PAYSSD_BUSINESS_NAME || 'Jambi Systems'

  // Calculate amount (convert cents to whole)
  const amount = order.amount_cents / 100

  // Check if order is already paid
  const isPaid = order.status === 'confirmed' || order.status === 'paid'
  const isExpired = order.status === 'expired'
  const isRejected = order.status === 'rejected'

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="container-wide relative">
        <div className="max-w-xl mx-auto">
          <ScrollReveal>
            {isPaid ? (
              <div className="bg-card rounded-2xl border border-green-200 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Confirmed!</h1>
                <p className="text-foreground-secondary mb-6">
                  Your payment has been verified. You can now access your purchase.
                </p>
                <a
                  href={`/store/orders/${token}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                >
                  View Your Order
                </a>
              </div>
            ) : isExpired ? (
              <div className="bg-card rounded-2xl border border-amber-200 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Expired</h1>
                <p className="text-foreground-secondary mb-6">
                  This payment request has expired. Please create a new order to continue.
                </p>
                <a
                  href="/store"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                >
                  Browse Store
                </a>
              </div>
            ) : isRejected ? (
              <div className="bg-card rounded-2xl border border-red-200 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Rejected</h1>
                <p className="text-foreground-secondary mb-6">
                  This payment was not verified. Please contact support if you believe this is an error.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                    Complete Your Payment
                  </h1>
                  <p className="text-foreground-secondary">
                    Send payment via MTN MoMo to complete your order
                  </p>
                </div>

                {/* Payment Amount */}
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 mb-6 text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Amount to Pay</p>
                  <p className="text-4xl font-bold text-accent">
                    {formatPrice(order.amount_cents, order.currency)}
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-accent" />
                    Payment Instructions
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Open MTN MoMo</p>
                        <p className="text-sm text-foreground-secondary">Dial *165# or use the MTN MoMo app</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Send money to:</p>
                        <div className="mt-2 bg-background-secondary rounded-xl p-3 flex items-center justify-between">
                          <span className="font-mono text-lg text-foreground">{momoNumber}</span>
                          <CopyButton text={momoNumber} label="number" />
                        </div>
                        <p className="text-xs text-foreground-muted mt-1">
                          Recipient: {businessName}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Include this reference code:</p>
                        <div className="mt-2 bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
                          <span className="font-mono text-xl font-bold text-accent">{order.payssd_reference_code}</span>
                          <CopyButton text={order.payssd_reference_code || ''} label="code" />
                        </div>
                        <p className="text-xs text-foreground-muted mt-1">
                          Add this code in the payment note/reference field
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold">4</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Wait for confirmation</p>
                        <p className="text-sm text-foreground-secondary">
                          We'll verify your payment and update this page automatically
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Product</span>
                      <span className="text-foreground">{order.product?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">License</span>
                      <span className="text-foreground">
                        {order.license_type === 'multi' ? 'Multi-use' : 'Single Organization'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Delivery</span>
                      <span className="text-foreground">
                        {order.delivery_type === 'both' ? 'Download + Deploy' : 
                         order.delivery_type === 'deploy' ? 'We Deploy' : 'Download'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Status Checker */}
                <PaymentStatus token={token} />

                {/* Help Text */}
                <div className="text-center mt-6">
                  <p className="text-sm text-foreground-muted">
                    Having trouble? <a href="/contact" className="text-accent hover:underline">Contact support</a>
                  </p>
                </div>
              </>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

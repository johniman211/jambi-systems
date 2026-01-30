import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOrderByToken } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { ScrollReveal } from '@/components/ui'
import { Clock, CheckCircle, AlertCircle, Hourglass } from 'lucide-react'
import { CopyButton } from './copy-button'
import { PaymentInstructions } from './payment-instructions'
import { PaymentConfirmationForm } from './payment-confirmation-form'

interface PageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'Complete Payment - Jambi Systems',
    description: 'Complete your payment via MoMo or Bank Transfer',
  }
}

export default async function PaymentPage({ params }: PageProps) {
  const { token } = await params
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  // Check order status
  const isPaid = order.status === 'confirmed' || order.status === 'paid'
  const isPendingVerification = order.status === 'pending_verification'
  const isExpired = order.status === 'expired'
  const isRejected = order.status === 'rejected'
  const hasConfirmation = !!order.payment_confirmation

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="container-wide relative">
        <div className="max-w-2xl mx-auto">
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
            ) : isPendingVerification ? (
              <div className="bg-card rounded-2xl border border-amber-200 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hourglass className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Your Payment</h1>
                <p className="text-foreground-secondary mb-4">
                  We've received your payment confirmation and are verifying it now.
                </p>
                <p className="text-sm text-foreground-muted mb-6">
                  This usually takes 5-30 minutes during business hours. We'll notify you once verified.
                </p>
                
                {order.payment_confirmation && (
                  <div className="bg-background-secondary rounded-xl p-4 text-left mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-2">Submitted Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground-secondary">Method</span>
                        <span className="text-foreground capitalize">{order.payment_confirmation.payment_method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-secondary">Reference</span>
                        <span className="font-mono text-foreground">{order.payment_confirmation.transaction_reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-secondary">Amount</span>
                        <span className="text-foreground">{formatPrice(order.payment_confirmation.amount_cents, order.payment_confirmation.currency)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <a
                  href={`/store/orders/${token}`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-background-secondary transition-colors"
                >
                  View Order Status
                </a>
              </div>
            ) : isExpired ? (
              <div className="bg-card rounded-2xl border border-amber-200 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Order Expired</h1>
                <p className="text-foreground-secondary mb-6">
                  This order has expired. Please create a new order to continue.
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
                  We couldn't verify your payment. Please contact support if you believe this is an error.
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
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                    Complete Your Payment
                  </h1>
                  <p className="text-foreground-secondary">
                    Follow the steps below to complete your purchase
                  </p>
                </div>

                {/* Order Code - Prominent Display */}
                <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-6 mb-6 text-center">
                  <p className="text-sm text-foreground-secondary mb-2">Your Order Reference</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl md:text-4xl font-bold text-accent tracking-wider">
                      {order.order_code}
                    </span>
                    <CopyButton text={order.order_code} label="code" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-2">
                    Include this code when making your payment
                  </p>
                </div>

                {/* Amount */}
                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground-secondary">Amount to Pay</p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatPrice(order.amount_cents, order.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground-secondary">Product</p>
                      <p className="font-medium text-foreground">{order.product?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <PaymentInstructions 
                  orderCode={order.order_code}
                  amount={order.amount_cents / 100}
                  currency={order.currency}
                />

                {/* Payment Confirmation Form */}
                {!hasConfirmation && (
                  <PaymentConfirmationForm 
                    orderToken={token}
                    orderCode={order.order_code}
                    expectedAmount={order.amount_cents / 100}
                    currency={order.currency}
                  />
                )}

                {/* Help Text */}
                <div className="text-center mt-8">
                  <p className="text-sm text-foreground-muted">
                    Need help? <a href="/contact" className="text-accent hover:underline">Contact support</a>
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

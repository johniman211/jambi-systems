import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPaymentConfirmationById, getReceiptSignedUrl } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { ArrowLeft, CreditCard, User, Package, Clock, CheckCircle, XCircle, FileImage, Sparkles } from 'lucide-react'
import { PaymentActions } from './payment-actions'

export const metadata = {
  title: 'Payment Detail - Admin',
  description: 'Review payment confirmation details',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PaymentDetailPage({ params }: PageProps) {
  const { id } = await params
  const confirmation = await getPaymentConfirmationById(id)

  if (!confirmation) {
    notFound()
  }

  const order = confirmation.order
  const product = order?.product

  // Get receipt URL if available
  let receiptUrl: string | null = null
  if (confirmation.receipt_path) {
    receiptUrl = await getReceiptSignedUrl(confirmation.receipt_path)
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  }

  const amountMatches = confirmation.amount_cents === order?.amount_cents

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/store/payments"
          className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground-secondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent" />
            Payment Confirmation
          </h1>
          <p className="text-foreground-secondary">
            Order: <span className="font-mono text-accent">{order?.order_code || 'N/A'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className={`rounded-xl border p-4 ${statusColors[confirmation.review_status]}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {confirmation.review_status === 'pending' ? (
                  <Clock className="w-5 h-5" />
                ) : confirmation.review_status === 'approved' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <div>
                  <p className="font-semibold capitalize">{confirmation.review_status}</p>
                  <p className="text-sm opacity-80">
                    {confirmation.review_status === 'pending' 
                      ? 'Awaiting manual review' 
                      : confirmation.reviewed_at 
                      ? `Reviewed on ${new Date(confirmation.reviewed_at).toLocaleString()}`
                      : 'Review status updated'}
                  </p>
                </div>
              </div>
              {confirmation.auto_approved && (
                <div className="flex items-center gap-1 text-sm bg-white/50 px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  Auto-approved
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Payment Details
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground-muted">Payment Method</p>
                <p className="font-medium text-foreground capitalize">
                  {confirmation.payment_method === 'momo' ? 'MTN MoMo' : 'Equity Bank USD'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Amount Submitted</p>
                <p className={`font-medium ${amountMatches ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPrice(confirmation.amount_cents, confirmation.currency)}
                  {!amountMatches && (
                    <span className="text-xs ml-2">
                      (Expected: {formatPrice(order?.amount_cents || 0, order?.currency || 'USD')})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Transaction Reference</p>
                <p className="font-mono font-medium text-foreground break-all">
                  {confirmation.transaction_reference}
                </p>
              </div>
              {confirmation.payer_phone && (
                <div>
                  <p className="text-sm text-foreground-muted">Payer Phone</p>
                  <p className="font-medium text-foreground">{confirmation.payer_phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-foreground-muted">Submitted At</p>
                <p className="font-medium text-foreground">
                  {new Date(confirmation.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {confirmation.note && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-foreground-muted">Note from Buyer</p>
                <p className="text-foreground mt-1">{confirmation.note}</p>
              </div>
            )}
          </div>

          {/* Receipt Preview */}
          {receiptUrl && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-accent" />
                Payment Receipt
              </h2>
              <div className="bg-background-secondary rounded-lg p-4">
                {confirmation.receipt_path?.endsWith('.pdf') ? (
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-2"
                  >
                    <FileImage className="w-5 h-5" />
                    View PDF Receipt
                  </a>
                ) : (
                  <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={receiptUrl}
                      alt="Payment receipt"
                      className="max-w-full max-h-96 rounded-lg mx-auto"
                    />
                  </a>
                )}
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                Click to view full size. Link expires in 1 hour.
              </p>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Order Details
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground-muted">Product</p>
                <p className="font-medium text-foreground">{product?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Order Amount</p>
                <p className="font-medium text-foreground">
                  {formatPrice(order?.amount_cents || 0, order?.currency || 'USD')}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">License Type</p>
                <p className="font-medium text-foreground capitalize">
                  {order?.license_type === 'multi' ? 'Multi-use' : 'Single'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Delivery</p>
                <p className="font-medium text-foreground capitalize">
                  {order?.delivery_type === 'both' ? 'Download + Deploy' : order?.delivery_type}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Order Status</p>
                <p className="font-medium text-foreground capitalize">{order?.status}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Order Created</p>
                <p className="font-medium text-foreground">
                  {order ? new Date(order.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href={`/admin/store/orders/${order?.id}`}
                className="text-accent hover:underline text-sm"
              >
                View Full Order Details →
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Buyer Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-foreground-muted">Phone</p>
                <p className="font-medium text-foreground">{order?.buyer_phone || 'N/A'}</p>
              </div>
              {order?.buyer_name && (
                <div>
                  <p className="text-sm text-foreground-muted">Name</p>
                  <p className="font-medium text-foreground">{order.buyer_name}</p>
                </div>
              )}
              {order?.buyer_email && (
                <div>
                  <p className="text-sm text-foreground-muted">Email</p>
                  <p className="font-medium text-foreground">{order.buyer_email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Checks */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Verification Checks</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Amount Match</span>
                <span className={`text-sm font-medium ${amountMatches ? 'text-green-600' : 'text-red-600'}`}>
                  {amountMatches ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Receipt Provided</span>
                <span className={`text-sm font-medium ${confirmation.receipt_path ? 'text-green-600' : 'text-amber-600'}`}>
                  {confirmation.receipt_path ? '✓ Yes' : '– No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Phone Provided</span>
                <span className={`text-sm font-medium ${confirmation.payer_phone ? 'text-green-600' : 'text-amber-600'}`}>
                  {confirmation.payer_phone ? '✓ Yes' : '– No'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {confirmation.review_status === 'pending' && order && (
            <PaymentActions orderId={order.id} confirmationId={confirmation.id} />
          )}
        </div>
      </div>
    </div>
  )
}

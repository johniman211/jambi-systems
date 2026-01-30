import Link from 'next/link'
import { getAllPaymentConfirmations } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { CreditCard, Clock, CheckCircle, XCircle, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Payment Verifications - Admin',
  description: 'Review and verify payment confirmations',
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const confirmations = await getAllPaymentConfirmations(status ? { status } : undefined)

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const pendingCount = confirmations.filter(c => c.review_status === 'pending').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent" />
            Payment Verifications
          </h1>
          <p className="text-foreground-secondary mt-1">
            Review and approve payment confirmations
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium">
            {pendingCount} pending verification{pendingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/store/payments"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !status
              ? 'bg-accent text-white'
              : 'bg-background-secondary text-foreground-secondary hover:text-foreground'
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/store/payments?status=pending"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-background-secondary text-foreground-secondary hover:text-foreground'
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/store/payments?status=approved"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-background-secondary text-foreground-secondary hover:text-foreground'
          }`}
        >
          Approved
        </Link>
        <Link
          href="/admin/store/payments?status=rejected"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-background-secondary text-foreground-secondary hover:text-foreground'
          }`}
        >
          Rejected
        </Link>
      </div>

      {/* Confirmations Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {confirmations.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-secondary">No payment confirmations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Buyer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Method</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Reference</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {confirmations.map((confirmation) => (
                  <tr key={confirmation.id} className="hover:bg-background-secondary/50">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono font-medium text-accent">
                          {confirmation.order?.order_code || 'N/A'}
                        </span>
                        <p className="text-xs text-foreground-muted">
                          {confirmation.order?.product?.name || 'Unknown product'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-foreground">{confirmation.order?.buyer_phone}</p>
                        {confirmation.order?.buyer_name && (
                          <p className="text-xs text-foreground-muted">{confirmation.order.buyer_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-foreground">
                        {confirmation.payment_method === 'momo' ? 'MoMo' : 'Equity Bank'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">
                        {formatPrice(confirmation.amount_cents, confirmation.currency)}
                      </span>
                      {confirmation.order && confirmation.amount_cents !== confirmation.order.amount_cents && (
                        <p className="text-xs text-red-500">
                          Expected: {formatPrice(confirmation.order.amount_cents, confirmation.order.currency)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {confirmation.transaction_reference.slice(0, 15)}
                        {confirmation.transaction_reference.length > 15 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[confirmation.review_status] || 'bg-gray-100 text-gray-700'
                        }`}>
                          {confirmation.review_status}
                        </span>
                        {confirmation.auto_approved && (
                          <span className="flex items-center gap-1 text-xs text-accent" title="Auto-approved">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-secondary">
                      {new Date(confirmation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/store/payments/${confirmation.id}`}
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

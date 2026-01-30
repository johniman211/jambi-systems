'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus, resendOrderEmail, confirmPayment, rejectPayment } from '@/lib/store/actions'
import type { OrderWithDetails } from '@/lib/store/types'
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react'

interface OrderActionsProps {
  order: OrderWithDetails
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleStatusChange = async (status: string) => {
    setMessage(null)
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, status)
      if (result.success) {
        setMessage({ type: 'success', text: 'Status updated' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update status' })
      }
    })
  }

  const handleResendEmail = async () => {
    setMessage(null)
    startTransition(async () => {
      const result = await resendOrderEmail(order.id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Email sent' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send email' })
      }
    })
  }

  const handleConfirmPayment = async () => {
    setMessage(null)
    startTransition(async () => {
      const result = await confirmPayment(order.id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Payment confirmed! License key generated.' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to confirm payment' })
      }
    })
  }

  const handleRejectPayment = async () => {
    setMessage(null)
    startTransition(async () => {
      const result = await rejectPayment(order.id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Payment rejected' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to reject payment' })
      }
    })
  }

  const isPending_ = order.status === 'pending' || order.status === 'matched'
  const isConfirmed = order.status === 'confirmed' || order.status === 'paid'

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4">Actions</h2>
      
      <div className="space-y-4">
        {/* Payment Actions for pending orders */}
        {isPending_ && (
          <div className="space-y-2">
            <p className="text-sm text-foreground-muted mb-2">Payment Verification</p>
            {order.payssd_reference_code && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-3">
                <p className="text-xs text-foreground-muted">Reference Code</p>
                <p className="font-mono text-lg font-bold text-accent">{order.payssd_reference_code}</p>
              </div>
            )}
            <button
              onClick={handleConfirmPayment}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Confirm Payment
            </button>
            <button
              onClick={handleRejectPayment}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject Payment
            </button>
          </div>
        )}

        {/* Status Change (for manual override) */}
        <div>
          <label className="block text-sm text-foreground-muted mb-2">Manual Status Override</label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="pending">Pending</option>
            <option value="matched">Matched</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="paid">Paid (Legacy)</option>
            <option value="failed">Failed (Legacy)</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Resend Email */}
        {order.buyer_email && isConfirmed && (
          <button
            onClick={handleResendEmail}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background-secondary text-foreground rounded-lg hover:bg-background transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Resend Receipt Email
          </button>
        )}

        {/* Message */}
        {message && (
          <div className={`text-sm p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

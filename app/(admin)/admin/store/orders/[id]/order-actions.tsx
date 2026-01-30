'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus, resendOrderEmail } from '@/lib/store/actions'
import type { OrderWithDetails } from '@/lib/store/types'
import { Loader2, Mail, RefreshCw } from 'lucide-react'

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

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4">Actions</h2>
      
      <div className="space-y-4">
        {/* Status Change */}
        <div>
          <label className="block text-sm text-foreground-muted mb-2">Change Status</label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Resend Email */}
        {order.buyer_email && (
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
            Resend Email
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

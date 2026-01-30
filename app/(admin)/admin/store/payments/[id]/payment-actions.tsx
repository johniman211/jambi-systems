'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { confirmPayment, rejectPayment } from '@/lib/store/actions'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface PaymentActionsProps {
  orderId: string
  confirmationId: string
}

export function PaymentActions({ orderId, confirmationId }: PaymentActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = () => {
    setError(null)
    setAction('approve')
    
    startTransition(async () => {
      const result = await confirmPayment(orderId)
      
      if (!result.success) {
        setError(result.error || 'Failed to approve payment')
        setAction(null)
        return
      }
      
      router.refresh()
    })
  }

  const handleReject = () => {
    setError(null)
    setAction('reject')
    
    startTransition(async () => {
      const result = await rejectPayment(orderId)
      
      if (!result.success) {
        setError(result.error || 'Failed to reject payment')
        setAction(null)
        return
      }
      
      router.refresh()
    })
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4">Actions</h2>
      
      <div className="space-y-3">
        <Button
          onClick={handleApprove}
          disabled={isPending}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isPending && action === 'approve' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Payment
            </>
          )}
        </Button>
        
        <Button
          onClick={handleReject}
          disabled={isPending}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50"
        >
          {isPending && action === 'reject' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rejecting...
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Payment
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-foreground-muted mt-4">
        Approving will mark the order as paid, generate a license key, and notify the buyer.
      </p>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'

interface PaymentStatusProps {
  token: string
}

export function PaymentStatus({ token }: PaymentStatusProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Auto-check every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus()
    }, 30000)

    return () => clearInterval(interval)
  }, [token])

  const checkStatus = async () => {
    setChecking(true)
    try {
      // Refresh the page to get latest status
      router.refresh()
      setLastChecked(new Date())
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-amber-500 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Waiting for payment...</p>
            {lastChecked && (
              <p className="text-xs text-foreground-muted">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={checkStatus}
          disabled={checking}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Check Status
        </button>
      </div>
      <p className="text-xs text-foreground-muted mt-3">
        This page will automatically update when your payment is confirmed.
      </p>
    </div>
  )
}

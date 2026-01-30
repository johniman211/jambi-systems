'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { updateExchangeRate } from '@/lib/store/actions'
import { Loader2, CheckCircle, RefreshCw } from 'lucide-react'

interface ExchangeRateFormProps {
  currentRate: number
  lastUpdated: string
}

export function ExchangeRateForm({ currentRate, lastUpdated }: ExchangeRateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rate, setRate] = useState(currentRate.toString())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const newRate = parseInt(rate, 10)
    if (isNaN(newRate) || newRate <= 0) {
      setError('Please enter a valid exchange rate')
      return
    }

    startTransition(async () => {
      const result = await updateExchangeRate(newRate)
      
      if (!result.success) {
        setError(result.error || 'Failed to update exchange rate')
        return
      }

      setSuccess(true)
      router.refresh()
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    })
  }

  const previewUsd = 100 // Preview with $100
  const previewSsp = previewUsd * parseInt(rate || '0', 10)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-foreground mb-2">
            1 USD = ? SSP
          </label>
          <div className="relative">
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5000"
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
              SSP
            </span>
          </div>
        </div>

        <div className="bg-background-secondary rounded-lg p-4">
          <p className="text-sm text-foreground-secondary mb-2">Preview Conversion</p>
          <div className="flex items-center justify-between">
            <span className="text-foreground">${previewUsd} USD</span>
            <span className="text-foreground-muted">=</span>
            <span className="font-semibold text-foreground">
              SSP {previewSsp.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Current Rate Info */}
      <div className="text-sm text-foreground-secondary">
        <p>
          Current rate: <span className="font-medium text-foreground">1 USD = {currentRate.toLocaleString()} SSP</span>
        </p>
        <p className="text-xs text-foreground-muted mt-1">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Exchange rate updated successfully!
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Exchange Rate
          </>
        )}
      </Button>
    </form>
  )
}

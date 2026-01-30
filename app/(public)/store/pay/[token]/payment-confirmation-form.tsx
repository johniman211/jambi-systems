'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { submitPaymentConfirmation, uploadPaymentReceipt } from '@/lib/store/actions'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentConfirmationFormProps {
  orderToken: string
  orderCode: string
  expectedAmountUsd: number
  expectedAmountSsp: number
  exchangeRate: number
}

type PaymentMethodType = 'momo' | 'equity_ssp' | 'equity_usd'

export function PaymentConfirmationForm({ 
  orderToken, 
  orderCode, 
  expectedAmountUsd,
  expectedAmountSsp,
  exchangeRate
}: PaymentConfirmationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ autoApproved: boolean; message: string } | null>(null)
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('momo')
  const [payerPhone, setPayerPhone] = useState('')
  const [transactionReference, setTransactionReference] = useState('')
  const [note, setNote] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)

  // Get currency and expected amount based on payment method
  const isUsdPayment = paymentMethod === 'equity_usd'
  const currency = isUsdPayment ? 'USD' : 'SSP'
  const expectedAmount = isUsdPayment ? expectedAmountUsd : expectedAmountSsp
  const [amount, setAmount] = useState(expectedAmountSsp.toString())

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PNG, JPG, WEBP, or PDF')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB')
        return
      }
      setReceiptFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!transactionReference.trim()) {
      setError('Transaction reference is required')
      return
    }
    if (paymentMethod === 'momo' && !payerPhone.trim()) {
      setError('Phone number is required for MoMo payments')
      return
    }

    // Map payment method for API
    const apiPaymentMethod = paymentMethod === 'equity_usd' || paymentMethod === 'equity_ssp' ? 'equity' : 'momo'
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    startTransition(async () => {
      try {
        // Upload receipt if provided
        let receiptPath: string | undefined
        if (receiptFile) {
          setUploadingReceipt(true)
          const formData = new FormData()
          formData.append('file', receiptFile)
          formData.append('orderCode', orderCode)
          
          const uploadResult = await uploadPaymentReceipt(formData)
          setUploadingReceipt(false)
          
          if (!uploadResult.success) {
            setError(uploadResult.error || 'Failed to upload receipt')
            return
          }
          receiptPath = uploadResult.path
        }

        // Submit payment confirmation
        const result = await submitPaymentConfirmation({
          order_token: orderToken,
          payment_method: apiPaymentMethod,
          payer_phone: paymentMethod === 'momo' ? payerPhone : undefined,
          transaction_reference: transactionReference.trim(),
          amount: parseFloat(amount),
          currency: currency,
          note: note.trim() || undefined,
          receipt_path: receiptPath,
        })

        if (!result.success) {
          setError(result.error || 'Failed to submit confirmation')
          return
        }

        setSuccess({
          autoApproved: result.autoApproved || false,
          message: result.message || 'Confirmation submitted',
        })

        // Refresh page after a short delay to show updated status
        setTimeout(() => {
          router.refresh()
        }, 2000)

      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
      }
    })
  }

  if (success) {
    return (
      <div className={`rounded-2xl p-6 text-center ${
        success.autoApproved 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          success.autoApproved ? 'bg-green-100' : 'bg-amber-100'
        }`}>
          {success.autoApproved ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600" />
          )}
        </div>
        <h3 className={`font-semibold mb-2 ${
          success.autoApproved ? 'text-green-800' : 'text-amber-800'
        }`}>
          {success.autoApproved ? 'Payment Verified!' : 'Confirmation Received'}
        </h3>
        <p className={`text-sm ${
          success.autoApproved ? 'text-green-700' : 'text-amber-700'
        }`}>
          {success.message}
        </p>
        {success.autoApproved && (
          <p className="text-sm text-green-600 mt-2">
            Redirecting to your order...
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-1">Step 2: Confirm Your Payment</h3>
      <p className="text-sm text-foreground-secondary mb-6">
        After completing your payment, fill out this form to speed up verification
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Method & Currency
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('momo')
                setAmount(expectedAmountSsp.toString())
              }}
              className={`px-3 py-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-colors ${
                paymentMethod === 'momo'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-border text-foreground-secondary hover:border-amber-300'
              }`}
            >
              MoMo (SSP)
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('equity_ssp')
                setAmount(expectedAmountSsp.toString())
              }}
              className={`px-3 py-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-colors ${
                paymentMethod === 'equity_ssp'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-border text-foreground-secondary hover:border-green-300'
              }`}
            >
              Bank (SSP)
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('equity_usd')
                setAmount(expectedAmountUsd.toString())
              }}
              className={`px-3 py-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-colors ${
                paymentMethod === 'equity_usd'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-foreground-secondary hover:border-accent/50'
              }`}
            >
              Bank (USD)
            </button>
          </div>
          <p className="text-xs text-foreground-muted mt-2">
            Rate: 1 USD = {exchangeRate.toLocaleString()} SSP
          </p>
        </div>

        {/* Payer Phone (for MoMo) */}
        {paymentMethod === 'momo' && (
          <div>
            <label htmlFor="payerPhone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number Used <span className="text-red-500">*</span>
            </label>
            <Input
              id="payerPhone"
              type="tel"
              placeholder="+211 9XX XXX XXX"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value)}
              required
            />
            <p className="text-xs text-foreground-muted mt-1">
              The phone number you sent payment from
            </p>
          </div>
        )}

        {/* Transaction Reference */}
        <div>
          <label htmlFor="transactionRef" className="block text-sm font-medium text-foreground mb-2">
            Transaction Reference/ID <span className="text-red-500">*</span>
          </label>
          <Input
            id="transactionRef"
            type="text"
            placeholder="e.g., TXN123456789"
            value={transactionReference}
            onChange={(e) => setTransactionReference(e.target.value)}
            required
          />
          <p className="text-xs text-foreground-muted mt-1">
            From your payment confirmation SMS or receipt
          </p>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
            Amount Sent <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder={expectedAmount.toString()}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
              {currency}
            </span>
          </div>
          {parseFloat(amount) !== expectedAmount && amount !== '' && (
            <p className="text-xs text-amber-600 mt-1">
              Expected amount: {currency} {expectedAmount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Receipt <span className="text-foreground-muted">(recommended)</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              className="sr-only"
              id="receipt-upload"
            />
            <label
              htmlFor="receipt-upload"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors"
            >
              <Upload className="w-4 h-4 text-foreground-secondary" />
              <span className="text-sm text-foreground-secondary">
                {receiptFile ? receiptFile.name : 'Upload screenshot or PDF'}
              </span>
            </label>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Helps speed up verification. Max 5MB (PNG, JPG, PDF)
          </p>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-foreground mb-2">
            Additional Note <span className="text-foreground-muted">(optional)</span>
          </label>
          <textarea
            id="note"
            rows={2}
            placeholder="Any additional information..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isPending || uploadingReceipt}
        >
          {isPending || uploadingReceipt ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadingReceipt ? 'Uploading Receipt...' : 'Submitting...'}
            </>
          ) : (
            'Submit Payment Confirmation'
          )}
        </Button>

        <p className="text-xs text-center text-foreground-muted">
          Your confirmation will be reviewed and you'll receive an update shortly
        </p>
      </form>
    </div>
  )
}

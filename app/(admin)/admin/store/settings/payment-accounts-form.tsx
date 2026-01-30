'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { updatePaymentAccounts, PaymentAccounts } from '@/lib/store/actions'
import { Loader2, CheckCircle, Save } from 'lucide-react'

interface PaymentAccountsFormProps {
  accounts: PaymentAccounts
}

export function PaymentAccountsForm({ accounts }: PaymentAccountsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [momoNumber, setMomoNumber] = useState(accounts.momo_number)
  const [momoName, setMomoName] = useState(accounts.momo_name)
  const [equitySspAccount, setEquitySspAccount] = useState(accounts.equity_ssp_account)
  const [equitySspName, setEquitySspName] = useState(accounts.equity_ssp_name)
  const [equityUsdAccount, setEquityUsdAccount] = useState(accounts.equity_usd_account)
  const [equityUsdName, setEquityUsdName] = useState(accounts.equity_usd_name)
  const [bankName, setBankName] = useState(accounts.bank_name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!momoNumber.trim() || !equitySspAccount.trim() || !equityUsdAccount.trim()) {
      setError('All account numbers are required')
      return
    }

    startTransition(async () => {
      const result = await updatePaymentAccounts({
        momo_number: momoNumber.trim(),
        momo_name: momoName.trim(),
        equity_ssp_account: equitySspAccount.trim(),
        equity_ssp_name: equitySspName.trim(),
        equity_usd_account: equityUsdAccount.trim(),
        equity_usd_name: equityUsdName.trim(),
        bank_name: bankName.trim(),
      })
      
      if (!result.success) {
        setError(result.error || 'Failed to update payment accounts')
        return
      }

      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bank Name */}
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-foreground mb-2">
          Bank Name
        </label>
        <Input
          id="bankName"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Equity Bank"
        />
      </div>

      {/* MoMo Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-amber-800">MTN MoMo (SSP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="momoNumber" className="block text-xs font-medium text-amber-700 mb-1">
              Phone Number
            </label>
            <Input
              id="momoNumber"
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              placeholder="+211929385157"
              className="bg-white"
            />
          </div>
          <div>
            <label htmlFor="momoName" className="block text-xs font-medium text-amber-700 mb-1">
              Account Name
            </label>
            <Input
              id="momoName"
              value={momoName}
              onChange={(e) => setMomoName(e.target.value)}
              placeholder="John Jambi"
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Equity SSP Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-green-800">Equity Bank (SSP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="equitySspAccount" className="block text-xs font-medium text-green-700 mb-1">
              Account Number
            </label>
            <Input
              id="equitySspAccount"
              value={equitySspAccount}
              onChange={(e) => setEquitySspAccount(e.target.value)}
              placeholder="2101111359346"
              className="bg-white"
            />
          </div>
          <div>
            <label htmlFor="equitySspName" className="block text-xs font-medium text-green-700 mb-1">
              Account Name
            </label>
            <Input
              id="equitySspName"
              value={equitySspName}
              onChange={(e) => setEquitySspName(e.target.value)}
              placeholder="John Jambi"
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Equity USD Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-blue-800">Equity Bank (USD)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="equityUsdAccount" className="block text-xs font-medium text-blue-700 mb-1">
              Account Number
            </label>
            <Input
              id="equityUsdAccount"
              value={equityUsdAccount}
              onChange={(e) => setEquityUsdAccount(e.target.value)}
              placeholder="2002111332379"
              className="bg-white"
            />
          </div>
          <div>
            <label htmlFor="equityUsdName" className="block text-xs font-medium text-blue-700 mb-1">
              Account Name
            </label>
            <Input
              id="equityUsdName"
              value={equityUsdName}
              onChange={(e) => setEquityUsdName(e.target.value)}
              placeholder="John Jambi"
              className="bg-white"
            />
          </div>
        </div>
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
          Payment accounts updated successfully!
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Payment Accounts
          </>
        )}
      </Button>
    </form>
  )
}

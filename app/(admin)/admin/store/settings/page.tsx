import { getExchangeRate } from '@/lib/store/actions'
import { Settings } from 'lucide-react'
import { ExchangeRateForm } from './exchange-rate-form'

export const metadata = {
  title: 'Store Settings - Admin',
  description: 'Manage store settings and exchange rates',
}

export default async function StoreSettingsPage() {
  const exchangeRate = await getExchangeRate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" />
          Store Settings
        </h1>
        <p className="text-foreground-secondary mt-1">
          Manage exchange rates and payment configuration
        </p>
      </div>

      {/* Exchange Rate Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Exchange Rate (SSP/USD)</h2>
        <p className="text-sm text-foreground-secondary mb-6">
          Set the exchange rate for converting USD prices to South Sudanese Pounds. 
          This rate is shown to customers on the checkout and payment pages.
        </p>

        <ExchangeRateForm 
          currentRate={exchangeRate.ssp_to_usd} 
          lastUpdated={exchangeRate.updated_at}
        />
      </div>

      {/* Payment Accounts Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Payment Accounts</h2>
        <p className="text-sm text-foreground-secondary mb-4">
          The following accounts are configured to receive payments:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* MoMo */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-800 mb-2">MTN MoMo</h3>
            <p className="text-sm text-amber-700">+211929385157</p>
            <p className="text-xs text-amber-600 mt-1">John Jambi</p>
          </div>

          {/* Equity SSP */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Equity Bank (SSP)</h3>
            <p className="text-sm text-green-700 font-mono">2101111359346</p>
            <p className="text-xs text-green-600 mt-1">John Jambi</p>
          </div>

          {/* Equity USD */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Equity Bank (USD)</h3>
            <p className="text-sm text-blue-700 font-mono">2002111332379</p>
            <p className="text-xs text-blue-600 mt-1">John Jambi</p>
          </div>
        </div>

        <p className="text-xs text-foreground-muted mt-4">
          To change payment accounts, update the values in the payment-instructions.tsx file.
        </p>
      </div>
    </div>
  )
}

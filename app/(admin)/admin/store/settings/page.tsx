import { getExchangeRate, getPaymentAccounts } from '@/lib/store/actions'
import { Settings, AlertTriangle } from 'lucide-react'
import { ExchangeRateForm } from './exchange-rate-form'
import { PaymentAccountsForm } from './payment-accounts-form'

export const metadata = {
  title: 'Store Settings - Admin',
  description: 'Manage store settings and exchange rates',
}

export default async function StoreSettingsPage() {
  const [exchangeRate, paymentAccounts] = await Promise.all([
    getExchangeRate(),
    getPaymentAccounts()
  ])

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

      {/* Migration Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Database Migration Required</p>
          <p className="text-xs text-amber-700 mt-1">
            If you see "Failed to update" errors, run the migration file <code className="bg-amber-100 px-1 rounded">006_exchange_rate_settings.sql</code> in your Supabase SQL Editor.
          </p>
        </div>
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

      {/* Payment Accounts */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Payment Accounts</h2>
        <p className="text-sm text-foreground-secondary mb-6">
          Configure the accounts where customers will send payments.
          These details are shown on the payment page.
        </p>

        <PaymentAccountsForm accounts={paymentAccounts} />
      </div>
    </div>
  )
}

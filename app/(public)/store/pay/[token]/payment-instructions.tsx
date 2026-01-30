'use client'

import { useState } from 'react'
import { Phone, Building2 } from 'lucide-react'
import { CopyButton } from './copy-button'

interface PaymentInstructionsProps {
  orderCode: string
  amount: number
  currency: string
}

type PaymentTab = 'momo' | 'equity'

export function PaymentInstructions({ orderCode, amount, currency }: PaymentInstructionsProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>('momo')

  // Payment details from environment (will be passed from server or use defaults)
  const momoNumber = process.env.NEXT_PUBLIC_MOMO_NUMBER || '+211912345678'
  const equityAccountName = process.env.NEXT_PUBLIC_EQUITY_USD_ACCOUNT_NAME || 'Jambi Systems Ltd'
  const equityAccountNumber = process.env.NEXT_PUBLIC_EQUITY_USD_ACCOUNT_NUMBER || '2002111332379'
  const equityBankName = process.env.NEXT_PUBLIC_EQUITY_USD_BANK_NAME || 'Equity Bank South Sudan'

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('momo')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'momo'
              ? 'bg-accent/10 text-accent border-b-2 border-accent -mb-px'
              : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Phone className="w-4 h-4" />
          MoMo South Sudan
        </button>
        <button
          onClick={() => setActiveTab('equity')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'equity'
              ? 'bg-accent/10 text-accent border-b-2 border-accent -mb-px'
              : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Equity Bank USD
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'momo' ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Pay via MTN MoMo</h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Open MTN MoMo</p>
                  <p className="text-sm text-foreground-secondary">Dial *165# or use the MTN MoMo app</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Send {currency} {amount.toLocaleString()} to:</p>
                  <div className="mt-2 bg-background-secondary rounded-xl p-3 flex items-center justify-between">
                    <span className="font-mono text-lg text-foreground">{momoNumber}</span>
                    <CopyButton text={momoNumber} label="number" />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">In the payment note, include:</p>
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-amber-700">{orderCode}</span>
                    <CopyButton text={orderCode} label="code" />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Submit confirmation below</p>
                  <p className="text-sm text-foreground-secondary">After sending, fill out the confirmation form with your transaction details</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Pay via Equity Bank USD Transfer</h3>
            
            <div className="bg-background-secondary rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Bank Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{equityBankName}</span>
                  <CopyButton text={equityBankName} label="bank" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{equityAccountName}</span>
                  <CopyButton text={equityAccountName} label="name" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">{equityAccountNumber}</span>
                  <CopyButton text={equityAccountNumber} label="account" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Amount (USD)</span>
                <span className="font-bold text-foreground">${amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-medium text-amber-800 mb-1">Important: Include reference</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-amber-700">{orderCode}</span>
                <CopyButton text={orderCode} label="code" />
              </div>
              <p className="text-xs text-amber-600 mt-1">Add this code in the transfer reference/narration field</p>
            </div>

            <p className="text-sm text-foreground-secondary">
              After completing the transfer, fill out the confirmation form below with your transaction details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

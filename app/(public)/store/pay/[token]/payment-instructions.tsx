'use client'

import { useState } from 'react'
import { Phone, Building2, DollarSign } from 'lucide-react'
import { CopyButton } from './copy-button'

interface PaymentInstructionsProps {
  orderCode: string
  amountUsd: number
  amountSsp: number
  exchangeRate: number
}

type PaymentTab = 'momo' | 'equity_ssp' | 'equity_usd'

export function PaymentInstructions({ orderCode, amountUsd, amountSsp, exchangeRate }: PaymentInstructionsProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>('momo')

  // Payment details
  const momoNumber = '+211929385157'
  const momoAccountName = 'John Jambi'
  
  const equitySspAccountNumber = '2101111359346'
  const equitySspAccountName = 'John Jambi'
  
  const equityUsdAccountNumber = '2002111332379'
  const equityUsdAccountName = 'John Jambi'
  
  const bankName = 'Equity Bank'

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
      {/* Exchange Rate Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center">
        <p className="text-sm text-blue-700">
          Exchange Rate: <span className="font-semibold">1 USD = {exchangeRate.toLocaleString()} SSP</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('momo')}
          className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'momo'
              ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500 -mb-px'
              : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">MTN</span> MoMo
        </button>
        <button
          onClick={() => setActiveTab('equity_ssp')}
          className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'equity_ssp'
              ? 'bg-green-50 text-green-700 border-b-2 border-green-500 -mb-px'
              : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Bank SSP
        </button>
        <button
          onClick={() => setActiveTab('equity_usd')}
          className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'equity_usd'
              ? 'bg-accent/10 text-accent border-b-2 border-accent -mb-px'
              : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Bank USD
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'momo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Pay via MTN MoMo</h3>
              <span className="text-lg font-bold text-amber-600">SSP {amountSsp.toLocaleString()}</span>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Open MTN MoMo</p>
                  <p className="text-sm text-foreground-secondary">Dial *200# or use the MTN MoMo app</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Send SSP {amountSsp.toLocaleString()} to:</p>
                  <div className="mt-2 bg-background-secondary rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-secondary">Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg text-foreground">{momoNumber}</span>
                        <CopyButton text={momoNumber} label="number" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">Name</span>
                      <span className="font-medium text-foreground">{momoAccountName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-semibold text-sm">3</span>
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
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-semibold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Submit confirmation below</p>
                  <p className="text-sm text-foreground-secondary">After sending, fill out the confirmation form with your transaction details</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equity_ssp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Pay via Equity Bank (SSP)</h3>
              <span className="text-lg font-bold text-green-600">SSP {amountSsp.toLocaleString()}</span>
            </div>
            
            <div className="bg-background-secondary rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Bank Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{bankName}</span>
                  <CopyButton text={bankName} label="bank" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{equitySspAccountName}</span>
                  <CopyButton text={equitySspAccountName} label="name" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">{equitySspAccountNumber}</span>
                  <CopyButton text={equitySspAccountNumber} label="account" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-foreground-secondary">Amount (SSP)</span>
                <span className="font-bold text-green-600">SSP {amountSsp.toLocaleString()}</span>
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

        {activeTab === 'equity_usd' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Pay via Equity Bank (USD)</h3>
              <span className="text-lg font-bold text-accent">${amountUsd.toLocaleString()}</span>
            </div>
            
            <div className="bg-background-secondary rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Bank Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{bankName}</span>
                  <CopyButton text={bankName} label="bank" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{equityUsdAccountName}</span>
                  <CopyButton text={equityUsdAccountName} label="name" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">{equityUsdAccountNumber}</span>
                  <CopyButton text={equityUsdAccountNumber} label="account" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-foreground-secondary">Amount (USD)</span>
                <span className="font-bold text-accent">${amountUsd.toLocaleString()}</span>
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

'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  businessTypeLabels,
  systemCategoryLabels,
  paymentLabels,
  requiresLoginLabels,
  timelineLabels,
  budgetLabels,
} from '@/lib/validations'

export function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Build JSON payload
    const payload = {
      full_name: formData.get('full_name') as string,
      business_name: formData.get('business_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      business_type: formData.get('business_type') as string,
      system_category: formData.get('system_category') as string,
      problem: formData.get('problem') as string,
      goals: formData.get('goals') as string || undefined,
      payments: selectedPayments,
      requires_login: formData.get('requires_login') as string,
      timeline: formData.get('timeline') as string,
      budget_range: formData.get('budget_range') as string,
      additional_info: formData.get('additional_info') as string || undefined,
      consent: formData.get('consent') === 'on',
      company_website: formData.get('company_website') as string, // honeypot
    }

    try {
      const response = await fetch('/api/forms/request-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePayment = (value: string) => {
    setSelectedPayments(prev => 
      prev.includes(value) 
        ? prev.filter(p => p !== value)
        : [...prev, value]
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-accent-2-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent-2" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Thank you for contacting Jambi Systems.
        </h3>
        <p className="text-foreground-secondary mb-2">
          We've received your request and will review it carefully.
        </p>
        <p className="text-foreground-secondary">
          If your project is a good fit, we'll contact you within 24–48 hours.
        </p>
      </div>
    )
  }

  const businessTypeOptions = Object.entries(businessTypeLabels).map(([value, label]) => ({ value, label }))
  const systemCategoryOptions = Object.entries(systemCategoryLabels).map(([value, label]) => ({ value, label }))
  const timelineOptions = Object.entries(timelineLabels).map(([value, label]) => ({ value, label }))
  const budgetOptions = Object.entries(budgetLabels).map(([value, label]) => ({ value, label }))

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot - hidden field to catch bots */}
      <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Contact Information</h2>
        <div className="space-y-4">
          <Input
            name="full_name"
            label="Full Name"
            placeholder="Your full name"
            required
          />
          <Input
            name="business_name"
            label="Business / Brand Name"
            placeholder="Your business or brand name"
            required
          />
          <Input
            name="phone"
            label="Phone Number (WhatsApp preferred)"
            placeholder="+211 ..."
            required
          />
          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="your@email.com (optional)"
          />
        </div>
      </div>

      {/* Business Type */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Business Type</h2>
        <Select
          name="business_type"
          label="What best describes your business?"
          options={businessTypeOptions}
          placeholder="Select your business type"
          required
        />
      </div>

      {/* System Category */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">System Category</h2>
        <Select
          name="system_category"
          label="What type of system do you need?"
          options={systemCategoryOptions}
          placeholder="Select system type"
          required
        />
      </div>

      {/* Problem & Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Problem & Goals</h2>
        <div className="space-y-4">
          <Textarea
            name="problem"
            label="What problem are you trying to solve?"
            placeholder="Describe how you currently manage this and what is not working."
            required
          />
          <Textarea
            name="goals"
            label="What do you want the system to help you achieve?"
            placeholder="Example: accept payments online, control access, track customers, reduce manual work."
          />
        </div>
      </div>

      {/* Payments & Access */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Payments & Access</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Will the system handle payments? <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(paymentLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => togglePayment(value)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                    selectedPayments.includes(value)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-background-secondary text-foreground-secondary border-border hover:border-foreground-muted'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Will users need to login to access features or content? <span className="text-error">*</span>
            </label>
            <div className="space-y-2">
              {Object.entries(requiresLoginLabels).map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="requires_login"
                    value={value}
                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                    required
                  />
                  <span className="text-sm text-foreground-secondary group-hover:text-foreground transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Project Timeline</h2>
        <Select
          name="timeline"
          label="When do you want this system ready?"
          options={timelineOptions}
          placeholder="Select timeline"
          required
        />
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Budget Range (Important)</h2>
        <Select
          name="budget_range"
          label="What is your estimated budget for this system?"
          options={budgetOptions}
          placeholder="Select budget range"
          required
          hint="We only take on projects with a clear budget range."
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground pb-2 border-b border-border">Additional Information</h2>
        <Textarea
          name="additional_info"
          label="Is there anything else we should know?"
          placeholder="Optional: Share any additional details about your project."
        />
      </div>

      {/* Consent */}
      <div className="bg-background-secondary rounded-xl p-4 border border-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            required
          />
          <span className="text-sm text-foreground-secondary">
            I understand that Jambi Systems builds custom systems, not templates, and pricing depends on scope. <span className="text-error">*</span>
          </span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-xl text-sm border border-error/20">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Request My System
      </Button>
    </form>
  )
}

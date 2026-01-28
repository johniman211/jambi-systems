'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Build JSON payload
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      message: formData.get('message') as string,
      company_website: formData.get('company_website') as string, // honeypot
    }

    try {
      const response = await fetch('/api/forms/contact', {
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

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-accent-2-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent-2" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
        <p className="text-foreground-secondary">Thank you for contacting us. We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot - hidden field to catch bots */}
      <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Input
        name="name"
        label="Name"
        placeholder="Your name"
        required
      />

      <Input
        name="email"
        type="email"
        label="Email Address"
        placeholder="your@email.com"
      />

      <Input
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="+211 ... (optional)"
      />

      <p className="text-sm text-foreground-muted">Please provide either email or phone number</p>

      <Textarea
        name="message"
        label="Message"
        placeholder="How can we help you?"
        required
      />

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-xl text-sm border border-error/20">
          {error}
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Send Message
      </Button>
    </form>
  )
}

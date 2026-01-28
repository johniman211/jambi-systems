'use server'

import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email'
import { contactFormEmailHtml, contactFormEmailText } from '@/lib/email/templates'
import { checkRateLimit } from '@/lib/rate-limit'

export async function submitContactForm(formData: FormData) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    // Rate limiting
    const { allowed } = checkRateLimit(ip)
    if (!allowed) {
      return { success: false, error: 'Too many requests. Please try again later.' }
    }

    // Parse form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || '',
      message: formData.get('message') as string,
      honeypot: formData.get('website') as string || '',
    }

    // Validate
    const result = contactFormSchema.safeParse(rawData)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || 'Invalid form data'
      return { success: false, error: firstError }
    }

    const { name, email, message } = result.data

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Message from ${name}`,
        html: contactFormEmailHtml(name, email || undefined, message),
        text: contactFormEmailText(name, email || undefined, message),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

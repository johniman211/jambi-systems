'use server'

import { headers } from 'next/headers'
import { systemRequestSchema } from '@/lib/validations'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { newRequestEmailHtml, newRequestEmailText } from '@/lib/email/templates'
import { checkRateLimit } from '@/lib/rate-limit'
import type { SystemRequest } from '@/lib/types'

export async function submitSystemRequest(formData: FormData) {
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
    const paymentsRaw = formData.getAll('payments') as string[]
    
    const rawData = {
      full_name: formData.get('full_name') as string,
      business_name: formData.get('business_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || '',
      business_type: formData.get('business_type') as string,
      system_category: formData.get('system_category') as string,
      problem: formData.get('problem') as string,
      goals: formData.get('goals') as string || '',
      payments: paymentsRaw,
      requires_login: formData.get('requires_login') as string,
      timeline: formData.get('timeline') as string,
      budget_range: formData.get('budget_range') as string,
      additional_info: formData.get('additional_info') as string || '',
      consent: formData.get('consent') === 'on',
      honeypot: formData.get('website') as string || '',
    }

    // Validate
    const result = systemRequestSchema.safeParse(rawData)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || 'Invalid form data'
      return { success: false, error: firstError }
    }

    const validatedData = result.data

    // Insert into Supabase
    const supabase = createAdminClient()
    const { data: insertedData, error: dbError } = await supabase
      .from('system_requests')
      .insert({
        full_name: validatedData.full_name,
        business_name: validatedData.business_name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        business_type: validatedData.business_type,
        system_category: validatedData.system_category,
        problem: validatedData.problem,
        goals: validatedData.goals || null,
        payments: validatedData.payments,
        requires_login: validatedData.requires_login,
        timeline: validatedData.timeline,
        budget_range: validatedData.budget_range,
        additional_info: validatedData.additional_info || null,
        consent: validatedData.consent,
        status: 'new',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return { success: false, error: 'Failed to submit request. Please try again.' }
    }

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && insertedData) {
      await sendEmail({
        to: adminEmail,
        subject: `New System Request from ${validatedData.full_name}`,
        html: newRequestEmailHtml(insertedData as SystemRequest),
        text: newRequestEmailText(insertedData as SystemRequest),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('System request error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

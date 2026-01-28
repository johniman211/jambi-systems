import { NextRequest, NextResponse } from 'next/server'
import { sendFormEmail, sendUserConfirmationEmail } from '@/lib/mailer'
import { checkRateLimit } from '@/lib/rate-limiter'

interface RequestSystemPayload {
  full_name: string
  business_name: string
  phone: string
  email?: string
  business_type: string
  system_category: string
  problem: string
  goals?: string
  payments: string[]
  requires_login: string
  timeline: string
  budget_range: string
  additional_info?: string
  consent: boolean
  company_website?: string // honeypot
}

const businessTypeLabels: Record<string, string> = {
  creator_influencer: 'Content Creator / Influencer',
  shop_landlord: 'Shop Owner / Landlord',
  school_ngo: 'School / NGO / Organization',
  service_provider: 'Service Provider (Gym, Salon, Clinic)',
  other: 'Other',
}

const systemCategoryLabels: Record<string, string> = {
  creator_subscription: 'Creator Subscription Platform',
  debt_tracking: 'Debt / Credit Tracking',
  booking_scheduling: 'Booking & Scheduling',
  internal_management: 'Internal Management System',
  custom: 'Custom / Not Sure',
}

const paymentLabels: Record<string, string> = {
  mobile_money: 'Mobile Money',
  bank: 'Bank Transfer',
  card: 'Card Payments',
  cash_only: 'Cash Only (No online payments)',
  none: 'No payments needed',
}

const requiresLoginLabels: Record<string, string> = {
  yes: 'Yes, users will need accounts',
  no: 'No, public access only',
  not_sure: 'Not sure yet',
}

const timelineLabels: Record<string, string> = {
  asap: 'As soon as possible',
  '2_4_weeks': '2–4 weeks',
  '1_2_months': '1–2 months',
  flexible: 'Flexible / No rush',
}

const budgetLabels: Record<string, string> = {
  under_500: 'Under $500',
  '500_800': '$500 – $800',
  '800_1500': '$800 – $1,500',
  '1500_3000': '$1,500 – $3,000',
  '3000_plus': '$3,000+',
}

function validatePayload(data: unknown): { valid: true; payload: RequestSystemPayload } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const payload = data as Record<string, unknown>

  if (!payload.full_name || typeof payload.full_name !== 'string' || payload.full_name.trim().length < 2) {
    return { valid: false, error: 'Full name is required (minimum 2 characters)' }
  }

  if (!payload.business_name || typeof payload.business_name !== 'string' || payload.business_name.trim().length < 2) {
    return { valid: false, error: 'Business name is required (minimum 2 characters)' }
  }

  if (!payload.phone || typeof payload.phone !== 'string' || payload.phone.trim().length < 9) {
    return { valid: false, error: 'Valid phone number is required' }
  }

  if (!payload.business_type || typeof payload.business_type !== 'string') {
    return { valid: false, error: 'Business type is required' }
  }

  if (!payload.system_category || typeof payload.system_category !== 'string') {
    return { valid: false, error: 'System category is required' }
  }

  if (!payload.problem || typeof payload.problem !== 'string' || payload.problem.trim().length < 10) {
    return { valid: false, error: 'Problem description is required (minimum 10 characters)' }
  }

  if (!Array.isArray(payload.payments) || payload.payments.length === 0) {
    return { valid: false, error: 'At least one payment option is required' }
  }

  if (!payload.requires_login || typeof payload.requires_login !== 'string') {
    return { valid: false, error: 'Login requirement selection is required' }
  }

  if (!payload.timeline || typeof payload.timeline !== 'string') {
    return { valid: false, error: 'Timeline selection is required' }
  }

  if (!payload.budget_range || typeof payload.budget_range !== 'string') {
    return { valid: false, error: 'Budget range is required' }
  }

  if (payload.consent !== true) {
    return { valid: false, error: 'You must accept the terms to submit' }
  }

  return {
    valid: true,
    payload: {
      full_name: (payload.full_name as string).trim(),
      business_name: (payload.business_name as string).trim(),
      phone: (payload.phone as string).trim(),
      email: typeof payload.email === 'string' && payload.email.trim() ? payload.email.trim() : undefined,
      business_type: payload.business_type as string,
      system_category: payload.system_category as string,
      problem: (payload.problem as string).trim(),
      goals: typeof payload.goals === 'string' && payload.goals.trim() ? payload.goals.trim() : undefined,
      payments: payload.payments as string[],
      requires_login: payload.requires_login as string,
      timeline: payload.timeline as string,
      budget_range: payload.budget_range as string,
      additional_info: typeof payload.additional_info === 'string' && payload.additional_info.trim() ? payload.additional_info.trim() : undefined,
      consent: true,
      company_website: typeof payload.company_website === 'string' ? payload.company_website : undefined,
    },
  }
}

function buildEmailHtml(payload: RequestSystemPayload): string {
  const submissionTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const paymentsFormatted = payload.payments
    .map((p) => paymentLabels[p] || p)
    .join(', ')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
    .section:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1e293b; }
    .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">New System Request</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">${submissionTime}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">📇 Contact Information</h2>
      <div style="margin-bottom: 10px;">
        <div class="label">Full Name</div>
        <div class="value">${payload.full_name}</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div class="label">Business Name</div>
        <div class="value">${payload.business_name}</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div class="label">Phone</div>
        <div class="value">${payload.phone}</div>
      </div>
      ${payload.email ? `
      <div style="margin-bottom: 10px;">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${payload.email}">${payload.email}</a></div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">🏢 Business Details</h2>
      <div style="margin-bottom: 10px;">
        <div class="label">Business Type</div>
        <div class="value">${businessTypeLabels[payload.business_type] || payload.business_type}</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div class="label">System Category</div>
        <div class="value">${systemCategoryLabels[payload.system_category] || payload.system_category}</div>
      </div>
    </div>

    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">🎯 Problem & Goals</h2>
      <div style="margin-bottom: 10px;">
        <div class="label">Problem to Solve</div>
        <div class="value">${payload.problem}</div>
      </div>
      ${payload.goals ? `
      <div style="margin-bottom: 10px;">
        <div class="label">Goals</div>
        <div class="value">${payload.goals}</div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">💳 Payments & Access</h2>
      <div style="margin-bottom: 10px;">
        <div class="label">Payment Methods</div>
        <div class="value">${paymentsFormatted}</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div class="label">Requires Login</div>
        <div class="value">${requiresLoginLabels[payload.requires_login] || payload.requires_login}</div>
      </div>
    </div>

    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">📅 Timeline & Budget</h2>
      <div style="margin-bottom: 10px;">
        <div class="label">Timeline</div>
        <div class="value">${timelineLabels[payload.timeline] || payload.timeline}</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div class="label">Budget Range</div>
        <div class="value" style="font-weight: bold; color: #059669;">${budgetLabels[payload.budget_range] || payload.budget_range}</div>
      </div>
    </div>

    ${payload.additional_info ? `
    <div class="section">
      <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">📝 Additional Information</h2>
      <div class="value">${payload.additional_info}</div>
    </div>
    ` : ''}
  </div>

  <div class="footer">
    <p>This submission was sent from the Jambi Systems website.</p>
  </div>
</body>
</html>
  `.trim()
}

function buildUserConfirmationHtml(payload: RequestSystemPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #1e293b; color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .highlight { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    .button { display: inline-block; background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">Thank You, ${payload.full_name}!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your system request</p>
  </div>
  
  <div class="content">
    <p>Hello ${payload.full_name},</p>
    
    <p>Thank you for reaching out to <strong>Jambi Systems</strong>. We've received your request for <strong>${payload.business_name}</strong> and our team is reviewing it.</p>
    
    <div class="highlight">
      <strong>What happens next?</strong>
      <p style="margin: 10px 0 0 0;">If your project is a good fit for what we do, we'll contact you within <strong>24–48 hours</strong> to discuss next steps.</p>
    </div>
    
    <p><strong>Your request summary:</strong></p>
    <ul>
      <li><strong>Business:</strong> ${payload.business_name}</li>
      <li><strong>System Type:</strong> ${payload.system_category.replace(/_/g, ' ')}</li>
      <li><strong>Timeline:</strong> ${payload.timeline.replace(/_/g, ' ')}</li>
      <li><strong>Budget:</strong> ${payload.budget_range.replace(/_/g, ' ')}</li>
    </ul>
    
    <p>In the meantime, feel free to reply to this email if you have any questions or additional information to share.</p>
    
    <p>Best regards,<br><strong>The Jambi Systems Team</strong></p>
  </div>

  <div class="footer">
    <p>Jambi Systems – Custom Systems for African Businesses</p>
    <p style="margin-top: 10px;">This is an automated confirmation. Please do not reply unless you have questions.</p>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      )
    }

    // Parse body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // Validate
    const validation = validatePayload(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const { payload } = validation

    // Honeypot check - if filled, silently succeed
    if (payload.company_website && payload.company_website.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    // Build and send admin notification email
    const html = buildEmailHtml(payload)
    await sendFormEmail({
      subject: `[Jambi Systems] New Request: ${payload.business_name}`,
      html,
      replyTo: payload.email,
    })

    // Send confirmation email to user if email provided
    if (payload.email) {
      const confirmationHtml = buildUserConfirmationHtml(payload)
      await sendUserConfirmationEmail({
        to: payload.email,
        subject: `Thank you for your request – Jambi Systems`,
        html: confirmationHtml,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Request system form error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

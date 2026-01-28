import { NextRequest, NextResponse } from 'next/server'
import { sendFormEmail } from '@/lib/mailer'
import { checkRateLimit } from '@/lib/rate-limiter'

interface ContactPayload {
  name: string
  email?: string
  phone?: string
  message: string
  company_website?: string // honeypot
}

function validatePayload(data: unknown): { valid: true; payload: ContactPayload } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const payload = data as Record<string, unknown>

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    return { valid: false, error: 'Name is required (minimum 2 characters)' }
  }

  if (!payload.message || typeof payload.message !== 'string' || payload.message.trim().length < 10) {
    return { valid: false, error: 'Message is required (minimum 10 characters)' }
  }

  // At least email or phone required
  const hasEmail = typeof payload.email === 'string' && payload.email.trim().length > 0
  const hasPhone = typeof payload.phone === 'string' && payload.phone.trim().length > 0

  if (!hasEmail && !hasPhone) {
    return { valid: false, error: 'Please provide either an email address or phone number' }
  }

  // Validate email format if provided
  if (hasEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.email as string)) {
      return { valid: false, error: 'Please provide a valid email address' }
    }
  }

  return {
    valid: true,
    payload: {
      name: (payload.name as string).trim(),
      email: hasEmail ? (payload.email as string).trim() : undefined,
      phone: hasPhone ? (payload.phone as string).trim() : undefined,
      message: (payload.message as string).trim(),
      company_website: typeof payload.company_website === 'string' ? payload.company_website : undefined,
    },
  }
}

function buildEmailHtml(payload: ContactPayload): string {
  const submissionTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1e293b; }
    .message-box { background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 20px; }
    .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">${submissionTime}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <div style="margin-bottom: 10px;">
        <div class="label">Name</div>
        <div class="value">${payload.name}</div>
      </div>
      ${payload.email ? `
      <div style="margin-bottom: 10px;">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${payload.email}">${payload.email}</a></div>
      </div>
      ` : ''}
      ${payload.phone ? `
      <div style="margin-bottom: 10px;">
        <div class="label">Phone</div>
        <div class="value">${payload.phone}</div>
      </div>
      ` : ''}
    </div>

    <div class="message-box">
      <div class="label">Message</div>
      <div class="value" style="white-space: pre-wrap;">${payload.message}</div>
    </div>
  </div>

  <div class="footer">
    <p>This message was sent from the Jambi Systems contact form.</p>
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

    // Build and send email
    const html = buildEmailHtml(payload)
    await sendFormEmail({
      subject: `[Jambi Systems] Contact: ${payload.name}`,
      html,
      replyTo: payload.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

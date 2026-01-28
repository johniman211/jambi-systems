import nodemailer from 'nodemailer'
import type { EmailOptions } from './index'

export async function sendWithSMTP(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.error('SMTP configuration is incomplete')
    return { success: false, error: 'Email configuration error' }
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    return { success: true }
  } catch (error) {
    console.error('SMTP send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

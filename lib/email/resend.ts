import { Resend } from 'resend'
import type { EmailOptions } from './index'

export async function sendWithResend(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return { success: false, error: 'Email configuration error' }
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: 'Jambi Systems <noreply@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Resend send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

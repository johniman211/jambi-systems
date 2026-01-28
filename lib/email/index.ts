import { sendWithResend } from './resend'
import { sendWithSMTP } from './smtp'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER || 'resend'

  try {
    if (provider === 'resend') {
      return await sendWithResend(options)
    } else if (provider === 'smtp') {
      return await sendWithSMTP(options)
    } else {
      console.error(`Unknown email provider: ${provider}`)
      return { success: false, error: `Unknown email provider: ${provider}` }
    }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

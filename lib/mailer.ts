'use server'

import nodemailer from 'nodemailer'

interface SendEmailOptions {
  subject: string
  html: string
  replyTo?: string
}

function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function createTransporter() {
  const user = getEnvVar('SMTP_USER')
  const pass = getEnvVar('SMTP_PASS')

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

export async function sendFormEmail({ subject, html, replyTo }: SendEmailOptions): Promise<void> {
  const transporter = createTransporter()
  const from = getEnvVar('SMTP_FROM')
  const to = getEnvVar('FORMS_TO_EMAIL')

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Jambi Systems" <${from}>`,
    to,
    subject,
    html,
  }

  if (replyTo) {
    mailOptions.replyTo = replyTo
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}

interface SendUserConfirmationOptions {
  to: string
  subject: string
  html: string
}

export async function sendUserConfirmationEmail({ to, subject, html }: SendUserConfirmationOptions): Promise<void> {
  const transporter = createTransporter()
  const from = getEnvVar('SMTP_FROM')

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Jambi Systems" <${from}>`,
    to,
    subject,
    html,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't throw - confirmation email failure shouldn't break the form submission
  }
}

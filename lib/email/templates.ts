import { SystemRequest } from '@/lib/types'
import { businessTypeLabels, systemCategoryLabels, paymentLabels, budgetLabels, timelineLabels, requiresLoginLabels } from '@/lib/validations'

export function newRequestEmailHtml(request: SystemRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New System Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #0f172a; margin: 0 0 24px 0; font-size: 24px;">New System Request</h1>
    
    <p style="color: #475569; margin: 0 0 24px 0;">You have received a new system request from the Jambi Systems website.</p>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <h2 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Contact Information</h2>
      <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${request.full_name}</p>
      <p style="margin: 0 0 8px 0;"><strong>Business:</strong> ${request.business_name}</p>
      <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${request.phone}</p>
      ${request.email ? `<p style="margin: 0;"><strong>Email:</strong> ${request.email}</p>` : ''}
    </div>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <h2 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Project Details</h2>
      <p style="margin: 0 0 8px 0;"><strong>Business Type:</strong> ${businessTypeLabels[request.business_type] || request.business_type}</p>
      <p style="margin: 0 0 8px 0;"><strong>System Category:</strong> ${systemCategoryLabels[request.system_category] || request.system_category}</p>
      <p style="margin: 0 0 8px 0;"><strong>Budget Range:</strong> ${budgetLabels[request.budget_range] || request.budget_range}</p>
      <p style="margin: 0 0 8px 0;"><strong>Timeline:</strong> ${timelineLabels[request.timeline] || request.timeline}</p>
      <p style="margin: 0 0 8px 0;"><strong>Payments:</strong> ${request.payments.map(p => paymentLabels[p] || p).join(', ')}</p>
      <p style="margin: 0;"><strong>Requires Login:</strong> ${requiresLoginLabels[request.requires_login] || request.requires_login}</p>
    </div>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <h2 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Problem & Goals</h2>
      <p style="margin: 0 0 16px 0;"><strong>Problem:</strong></p>
      <p style="margin: 0 0 16px 0; white-space: pre-wrap;">${request.problem}</p>
      ${request.goals ? `
      <p style="margin: 0 0 16px 0;"><strong>Goals:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${request.goals}</p>
      ` : ''}
    </div>
    
    ${request.additional_info ? `
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <h2 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Additional Information</h2>
      <p style="margin: 0; white-space: pre-wrap;">${request.additional_info}</p>
    </div>
    ` : ''}
    
    <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        View this submission in your admin dashboard to respond.
      </p>
    </div>
  </div>
</body>
</html>
`
}

export function newRequestEmailText(request: SystemRequest): string {
  return `
NEW SYSTEM REQUEST
==================

You have received a new system request from the Jambi Systems website.

CONTACT INFORMATION
-------------------
Name: ${request.full_name}
Business: ${request.business_name}
Phone: ${request.phone}
${request.email ? `Email: ${request.email}` : ''}

PROJECT DETAILS
---------------
Business Type: ${businessTypeLabels[request.business_type] || request.business_type}
System Category: ${systemCategoryLabels[request.system_category] || request.system_category}
Budget Range: ${budgetLabels[request.budget_range] || request.budget_range}
Timeline: ${timelineLabels[request.timeline] || request.timeline}
Payments: ${request.payments.map(p => paymentLabels[p] || p).join(', ')}
Requires Login: ${requiresLoginLabels[request.requires_login] || request.requires_login}

PROBLEM
-------
${request.problem}

${request.goals ? `GOALS\n-----\n${request.goals}\n` : ''}
${request.additional_info ? `ADDITIONAL INFO\n---------------\n${request.additional_info}\n` : ''}
---
View this submission in your admin dashboard to respond.
`
}

export function contactFormEmailHtml(name: string, email: string | undefined, message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #0f172a; margin: 0 0 24px 0; font-size: 24px;">New Contact Message</h1>
    
    <p style="color: #475569; margin: 0 0 24px 0;">You have received a new contact message from the Jambi Systems website.</p>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>
      ${email ? `<p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>` : ''}
    </div>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 20px;">
      <h2 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Message</h2>
      <p style="margin: 0; white-space: pre-wrap;">${message}</p>
    </div>
  </div>
</body>
</html>
`
}

export function contactFormEmailText(name: string, email: string | undefined, message: string): string {
  return `
NEW CONTACT MESSAGE
===================

Name: ${name}
${email ? `Email: ${email}` : ''}

MESSAGE
-------
${message}
`
}

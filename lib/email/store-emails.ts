import { sendEmail } from './index'
import type { OrderWithDetails } from '@/lib/store/types'
import { formatPrice } from '@/lib/store/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jambisystems.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jambisystems.com'

type StoreEmailType = 
  | 'buyer_order_created'
  | 'buyer_receipt'
  | 'buyer_deploy_request'
  | 'admin_order_created'
  | 'admin_new_purchase'
  | 'admin_deploy_request'
  | 'admin_new_product'
  | 'admin_payment_pending'

export async function sendStoreEmail(type: StoreEmailType, order: OrderWithDetails) {
  switch (type) {
    case 'buyer_order_created':
      if (!order.buyer_email) return
      return sendBuyerOrderCreatedEmail(order)
    case 'buyer_receipt':
      if (!order.buyer_email) return
      return sendBuyerReceiptEmail(order)
    case 'buyer_deploy_request':
      if (!order.buyer_email) return
      return sendBuyerDeployRequestEmail(order)
    case 'admin_order_created':
      return sendAdminOrderCreatedEmail(order)
    case 'admin_new_purchase':
      return sendAdminNewPurchaseEmail(order)
    case 'admin_deploy_request':
      return sendAdminDeployRequestEmail(order)
    case 'admin_payment_pending':
      return sendAdminPaymentPendingEmail(order)
  }
}

export async function sendNewProductEmail(product: { name: string; slug: string; base_price_cents: number; currency: string }) {
  return sendAdminNewProductEmail(product)
}

async function sendBuyerOrderCreatedEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const orderUrl = `${SITE_URL}/store/success?token=${order.order_access_token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #6366f1; margin: 0;">Jambi Systems</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Order Created</p>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #92400e;">Payment Pending</h2>
        <p style="margin: 0;">Hi${order.buyer_name ? ` ${order.buyer_name}` : ''},</p>
        <p>Your order for <strong>${productName}</strong> has been created and is awaiting payment.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; color: #92400e;">Order ID</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; text-align: right; font-family: monospace;">${order.id.slice(0, 8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; color: #92400e;">Product</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; text-align: right;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; color: #92400e;">License</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #fcd34d; text-align: right;">${order.license_type === 'multi' ? 'Multi-use' : 'Single organization'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Amount Due</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #b45309;">${formatPrice(order.amount_cents, order.currency)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${orderUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Complete Payment</a>
      </div>

      <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">Jambi Systems</p>
        <p style="margin: 4px 0 0 0;">Building systems for creators and businesses</p>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.buyer_email!,
    subject: `Order Created - ${productName} - Payment Pending`,
    html,
  })
}

async function sendAdminOrderCreatedEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const adminUrl = `${SITE_URL}/admin/store/orders/${order.id}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #f59e0b; margin: 0;">New Order Created</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Awaiting Payment</p>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #92400e;">${formatPrice(order.amount_cents, order.currency)}</h2>
        <p style="margin: 0; color: #a16207;">Pending payment for ${productName}</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Buyer Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Name:</td>
            <td style="padding: 4px 0;">${order.buyer_name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Phone:</td>
            <td style="padding: 4px 0;">${order.buyer_phone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Email:</td>
            <td style="padding: 4px 0;">${order.buyer_email || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Order Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Product:</td>
            <td style="padding: 4px 0;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">License:</td>
            <td style="padding: 4px 0;">${order.license_type === 'multi' ? 'Multi-use' : 'Single'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Delivery:</td>
            <td style="padding: 4px 0;">${order.delivery_type === 'both' ? 'Download + Deploy' : order.delivery_type}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Status:</td>
            <td style="padding: 4px 0; color: #f59e0b; font-weight: 600;">Pending Payment</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View Order in Admin</a>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Order Created: ${productName} - ${formatPrice(order.amount_cents, order.currency)} (Pending)`,
    html,
  })
}

async function sendAdminNewProductEmail(product: { name: string; slug: string; base_price_cents: number; currency: string }) {
  const productUrl = `${SITE_URL}/store/${product.slug}`
  const adminUrl = `${SITE_URL}/admin/store/products`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #22c55e; margin: 0;">New Product Added</h1>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #166534;">${product.name}</h2>
        <p style="margin: 0; color: #15803d;">Base price: ${formatPrice(product.base_price_cents, product.currency)}</p>
      </div>

      <div style="text-align: center; margin-bottom: 16px;">
        <a href="${productUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-right: 8px;">View Product</a>
        <a href="${adminUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Manage Products</a>
      </div>

      <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">Jambi Systems Store</p>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Product Added: ${product.name}`,
    html,
  })
}

async function sendBuyerReceiptEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const orderUrl = `${SITE_URL}/store/orders/${order.order_access_token}`
  
  const downloadSection = (order.delivery_type === 'download' || order.delivery_type === 'both')
    ? `
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px 0; color: #166534;">Download Ready</h3>
        <p style="margin: 0 0 12px 0; color: #15803d;">Your purchase is ready for download.</p>
        <a href="${orderUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Download Now</a>
      </div>
    `
    : ''

  const deploySection = (order.delivery_type === 'deploy' || order.delivery_type === 'both')
    ? `
      <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px 0; color: #1e40af;">Deployment Service</h3>
        <p style="margin: 0; color: #1d4ed8;">You selected our deployment service. Our team will contact you within 24-48 hours to begin the deployment process.</p>
      </div>
    `
    : ''

  const licenseSection = order.license_key
    ? `
      <div style="background-color: #faf5ff; border: 1px solid #a855f7; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px 0; color: #7e22ce;">Your License Key</h3>
        <p style="font-family: monospace; font-size: 18px; background-color: #f3e8ff; padding: 12px; border-radius: 4px; margin: 0; color: #581c87;">${order.license_key.license_key}</p>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">License type: ${order.license_type === 'multi' ? 'Multi-use' : 'Single organization'}</p>
      </div>
    `
    : ''

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #6366f1; margin: 0;">Jambi Systems</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Payment Confirmation</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #111827;">Thank you for your purchase!</h2>
        <p style="margin: 0;">Hi${order.buyer_name ? ` ${order.buyer_name}` : ''},</p>
        <p>Your payment for <strong>${productName}</strong> has been confirmed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Order ID</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace;">${order.id.slice(0, 8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Product</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">License</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${order.license_type === 'multi' ? 'Multi-use' : 'Single organization'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Delivery</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${order.delivery_type === 'both' ? 'Download + Deploy' : order.delivery_type === 'deploy' ? 'Deploy for you' : 'Download'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Total Paid</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #059669;">${formatPrice(order.amount_cents, order.currency)}</td>
          </tr>
        </table>
      </div>

      ${licenseSection}
      ${downloadSection}
      ${deploySection}

      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">View your order anytime:</p>
        <a href="${orderUrl}" style="color: #6366f1; text-decoration: none;">${orderUrl}</a>
      </div>

      <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">Jambi Systems</p>
        <p style="margin: 4px 0 0 0;">Building systems for creators and businesses</p>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.buyer_email!,
    subject: `Payment Confirmed - ${productName}`,
    html,
  })
}

async function sendBuyerDeployRequestEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const orderUrl = `${SITE_URL}/store/orders/${order.order_access_token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #6366f1; margin: 0;">Jambi Systems</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Deployment Request Received</p>
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #1e40af;">Your deployment request is being processed</h2>
        <p style="margin: 0;">Hi${order.buyer_name ? ` ${order.buyer_name}` : ''},</p>
        <p>We've received your deployment request for <strong>${productName}</strong>.</p>
        <p>Our team will contact you at <strong>${order.buyer_phone}</strong> within 24-48 hours to discuss the deployment details and next steps.</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">What happens next?</h3>
        <ol style="margin: 0; padding-left: 20px; color: #6b7280;">
          <li style="margin-bottom: 8px;">Our team reviews your deployment request</li>
          <li style="margin-bottom: 8px;">We contact you to gather requirements</li>
          <li style="margin-bottom: 8px;">We deploy and configure the system for you</li>
          <li style="margin-bottom: 0;">You receive access to your deployed system</li>
        </ol>
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Track your order:</p>
        <a href="${orderUrl}" style="color: #6366f1; text-decoration: none;">${orderUrl}</a>
      </div>

      <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">Jambi Systems</p>
        <p style="margin: 4px 0 0 0;">Building systems for creators and businesses</p>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.buyer_email!,
    subject: `Deployment Request Received - ${productName}`,
    html,
  })
}

async function sendAdminNewPurchaseEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const adminUrl = `${SITE_URL}/admin/store/orders/${order.id}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #6366f1; margin: 0;">New Store Purchase</h1>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #166534;">${formatPrice(order.amount_cents, order.currency)}</h2>
        <p style="margin: 0; color: #15803d;">Payment received for ${productName}</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Buyer Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Name:</td>
            <td style="padding: 4px 0;">${order.buyer_name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Phone:</td>
            <td style="padding: 4px 0;">${order.buyer_phone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Email:</td>
            <td style="padding: 4px 0;">${order.buyer_email || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Order Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Product:</td>
            <td style="padding: 4px 0;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">License:</td>
            <td style="padding: 4px 0;">${order.license_type === 'multi' ? 'Multi-use' : 'Single'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Delivery:</td>
            <td style="padding: 4px 0;">${order.delivery_type === 'both' ? 'Download + Deploy' : order.delivery_type}</td>
          </tr>
        </table>
      </div>

      ${(order.delivery_type === 'deploy' || order.delivery_type === 'both') ? `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; color: #92400e;">⚠️ Deployment Requested</h3>
          <p style="margin: 0; color: #a16207;">This order includes deployment service. Please contact the buyer to begin deployment.</p>
        </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View Order in Admin</a>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Store Purchase: ${productName} - ${formatPrice(order.amount_cents, order.currency)}`,
    html,
  })
}

async function sendAdminDeployRequestEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const adminUrl = `${SITE_URL}/admin/store/deployments`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #f59e0b; margin: 0;">New Deployment Request</h1>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #92400e;">Action Required</h2>
        <p style="margin: 0; color: #a16207;">A customer has requested deployment service for ${productName}.</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Contact Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Name:</td>
            <td style="padding: 4px 0;">${order.buyer_name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Phone:</td>
            <td style="padding: 4px 0; font-weight: 600;">${order.buyer_phone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Email:</td>
            <td style="padding: 4px 0;">${order.buyer_email || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View Deployment Requests</a>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Deployment Request: ${productName}`,
    html,
  })
}

async function sendAdminPaymentPendingEmail(order: OrderWithDetails) {
  const productName = order.product?.name || 'Product'
  const adminUrl = `${SITE_URL}/admin/store/payments`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #f59e0b; margin: 0;">Payment Verification Needed</h1>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #92400e;">Manual Review Required</h2>
        <p style="margin: 0; color: #a16207;">A payment confirmation for <strong>${productName}</strong> needs manual verification.</p>
        <p style="margin: 8px 0 0 0; color: #a16207;">Order: <strong>${order.order_code}</strong> - ${formatPrice(order.amount_cents, order.currency)}</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #374151;">Buyer Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Name:</td>
            <td style="padding: 4px 0;">${order.buyer_name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Phone:</td>
            <td style="padding: 4px 0; font-weight: 600;">${order.buyer_phone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Email:</td>
            <td style="padding: 4px 0;">${order.buyer_email || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Review Payment</a>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Payment Verification Needed: ${order.order_code} - ${formatPrice(order.amount_cents, order.currency)}`,
    html,
  })
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button, ScrollReveal } from '@/components/ui'
import { OrderIllustration } from '@/components/illustrations/StoreIllustration'
import { getOrderByToken, getDeliverableSignedUrl } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { Download, Clock, CheckCircle, Rocket, Key, Hourglass, XCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Order Details',
    description: 'View your order details and download your purchase.',
  }
}

export default async function OrderPage({ params }: PageProps) {
  const { token } = await params
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  const isPaid = order.status === 'paid' || order.status === 'confirmed'
  const isPendingVerification = order.status === 'pending_verification'
  const isRejected = order.status === 'rejected'
  const hasDownload = order.delivery_type === 'download' || order.delivery_type === 'both'
  const hasDeploy = order.delivery_type === 'deploy' || order.delivery_type === 'both'

  let downloadUrl: string | null = null
  if (isPaid && hasDownload && order.product_id) {
    downloadUrl = await getDeliverableSignedUrl(order.id, order.product_id)
  }

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-center mb-8">
              <OrderIllustration />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                Order Details
              </h1>
              <p className="text-foreground-secondary">
                Order ID: <span className="font-mono">{order.id.slice(0, 8)}</span>
              </p>
            </div>
          </ScrollReveal>

          {/* Status Banner */}
          <ScrollReveal delay={0.2}>
            <div className={`rounded-2xl p-6 mb-8 ${
              isPaid 
                ? 'bg-green-50 border border-green-200' 
                : isPendingVerification
                ? 'bg-blue-50 border border-blue-200'
                : isRejected
                ? 'bg-red-50 border border-red-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                {isPaid ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : isPendingVerification ? (
                  <Hourglass className="w-6 h-6 text-blue-600" />
                ) : isRejected ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-600" />
                )}
                <div>
                  <h2 className={`font-semibold ${
                    isPaid ? 'text-green-800' 
                    : isPendingVerification ? 'text-blue-800'
                    : isRejected ? 'text-red-800'
                    : 'text-amber-800'
                  }`}>
                    {isPaid 
                      ? 'Payment Confirmed' 
                      : isPendingVerification 
                      ? 'Verifying Payment'
                      : isRejected
                      ? 'Payment Rejected'
                      : 'Awaiting Payment'}
                  </h2>
                  <p className={`text-sm ${
                    isPaid ? 'text-green-700' 
                    : isPendingVerification ? 'text-blue-700'
                    : isRejected ? 'text-red-700'
                    : 'text-amber-700'
                  }`}>
                    {isPaid 
                      ? `Confirmed on ${order.paid_at ? new Date(order.paid_at).toLocaleDateString() : new Date(order.created_at).toLocaleDateString()}` 
                      : isPendingVerification
                      ? 'We received your payment confirmation and are verifying it'
                      : isRejected
                      ? 'Your payment could not be verified. Please contact support.'
                      : 'Complete your payment to access your purchase'}
                  </p>
                </div>
              </div>
              {!isPaid && !isRejected && (
                <div className="mt-4 pt-4 border-t border-current/10">
                  <Link href={`/store/pay/${token}`}>
                    <Button size="sm" className={
                      isPendingVerification 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-amber-600 hover:bg-amber-700'
                    }>
                      {isPendingVerification ? 'View Payment Status' : 'Complete Payment'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Order Details Card */}
          <ScrollReveal delay={0.3}>
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                {/* Product */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-background-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    {order.product?.cover_image_path ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${order.product.cover_image_path}`}
                        alt={order.product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-foreground">{order.product?.name || 'Product'}</h4>
                    <p className="text-sm text-foreground-secondary">{order.product?.summary}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-foreground-muted mb-1">License Type</p>
                    <p className="text-foreground font-medium">
                      {order.license_type === 'multi' ? 'Multi-use' : 'Single Organization'}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted mb-1">Delivery</p>
                    <p className="text-foreground font-medium">
                      {order.delivery_type === 'both' 
                        ? 'Download + Deploy' 
                        : order.delivery_type === 'deploy' 
                        ? 'Deploy for You' 
                        : 'Download'}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted mb-1">Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted mb-1">Status</p>
                    <p className={`font-medium ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-semibold text-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(order.amount_cents, order.currency)}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* License Key */}
          {isPaid && order.license_key && (
            <ScrollReveal delay={0.4}>
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">License Key</h3>
                </div>
                <div className="bg-accent/10 rounded-xl p-4">
                  <p className="font-mono text-lg text-accent text-center break-all">
                    {order.license_key.license_key}
                  </p>
                </div>
                <p className="text-xs text-foreground-muted mt-3 text-center">
                  Issued on {new Date(order.license_key.issued_at).toLocaleDateString()}
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Download Section */}
          {isPaid && hasDownload && (
            <ScrollReveal delay={0.5}>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Download</h3>
                </div>
                {downloadUrl ? (
                  <>
                    <p className="text-green-700 text-sm mb-4">
                      Your download is ready. Click the button below to download the source files.
                    </p>
                    <a href={downloadUrl} download>
                      <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Download Files
                      </Button>
                    </a>
                    <p className="text-xs text-green-600 mt-3">
                      Download link expires in 1 hour. Refresh the page to generate a new link.
                    </p>
                  </>
                ) : (
                  <p className="text-green-700 text-sm">
                    Download files are being prepared. Please check back shortly.
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Deploy Section */}
          {isPaid && hasDeploy && (
            <ScrollReveal delay={0.6}>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Deployment Service</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-blue-700">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.deploy_request?.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : order.deploy_request?.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.deploy_request?.status === 'done'
                        ? 'Completed'
                        : order.deploy_request?.status === 'in_progress'
                        ? 'In Progress'
                        : 'Pending'}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {order.deploy_request?.status === 'done'
                      ? 'Your deployment has been completed! Check your email for access details.'
                      : order.deploy_request?.status === 'in_progress'
                      ? 'Our team is working on your deployment. We will contact you soon with updates.'
                      : `Our team will contact you at ${order.buyer_phone} within 24-48 hours to begin the deployment process.`}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Buyer Info */}
          <ScrollReveal delay={0.7}>
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-2 text-sm">
                {order.buyer_name && (
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Name</span>
                    <span className="text-foreground">{order.buyer_name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Phone</span>
                  <span className="text-foreground">{order.buyer_phone}</span>
                </div>
                {order.buyer_email && (
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Email</span>
                    <span className="text-foreground">{order.buyer_email}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Actions */}
          <ScrollReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store">
                <Button variant="outline">
                  Browse More Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Contact Support
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

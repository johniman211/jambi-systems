import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { OrderActions } from './order-actions'
import { ArrowLeft, Download, Key, Rocket, User, Phone, Mail, Package } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Order Details | Admin',
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <div>
      <Link
        href="/admin/store/orders"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
          <p className="text-foreground-secondary mt-1 font-mono">{order.id}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[order.status]}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Product
            </h2>
            <div className="flex items-center gap-4">
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
              <div>
                <p className="font-semibold text-foreground">{order.product?.name || 'Unknown Product'}</p>
                <p className="text-sm text-foreground-secondary">{order.product?.summary}</p>
                {order.product && (
                  <Link
                    href={`/admin/store/${order.product.id}/edit`}
                    className="text-xs text-accent hover:underline"
                  >
                    Edit product →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground-muted">License Type</p>
                <p className="font-medium text-foreground">
                  {order.license_type === 'multi' ? 'Multi-use' : 'Single Organization'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Delivery Type</p>
                <p className="font-medium text-foreground">
                  {order.delivery_type === 'both' 
                    ? 'Download + Deploy' 
                    : order.delivery_type === 'deploy' 
                    ? 'Deploy for You' 
                    : 'Download'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Payment Provider</p>
                <p className="font-medium text-foreground uppercase">{order.payment_provider}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Provider Reference</p>
                <p className="font-medium text-foreground font-mono text-sm">
                  {order.provider_reference || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Created</p>
                <p className="font-medium text-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Paid At</p>
                <p className="font-medium text-foreground">
                  {order.paid_at ? new Date(order.paid_at).toLocaleString() : 'Not paid'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(order.amount_cents, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* License Key */}
          {order.license_key && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                License Key
              </h2>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <p className="font-mono text-lg text-accent text-center">
                  {order.license_key.license_key}
                </p>
              </div>
              <p className="text-xs text-foreground-muted mt-2 text-center">
                Issued: {new Date(order.license_key.issued_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* Deploy Request */}
          {order.deploy_request && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-accent" />
                Deployment Request
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground-muted">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.deploy_request.status === 'done'
                      ? 'bg-green-100 text-green-700'
                      : order.deploy_request.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.deploy_request.status === 'done'
                      ? 'Completed'
                      : order.deploy_request.status === 'in_progress'
                      ? 'In Progress'
                      : 'New'}
                  </span>
                </div>
                {order.deploy_request.notes && (
                  <div>
                    <p className="text-sm text-foreground-muted mb-1">Notes:</p>
                    <p className="text-foreground bg-background-secondary rounded-lg p-3 text-sm">
                      {order.deploy_request.notes}
                    </p>
                  </div>
                )}
                <Link
                  href={`/admin/store/deployments/${order.deploy_request.id}`}
                  className="inline-block text-sm text-accent hover:underline"
                >
                  Manage deployment →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Customer</h2>
            <div className="space-y-4">
              {order.buyer_name && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-foreground-muted mt-1" />
                  <div>
                    <p className="text-xs text-foreground-muted">Name</p>
                    <p className="text-foreground">{order.buyer_name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-foreground-muted mt-1" />
                <div>
                  <p className="text-xs text-foreground-muted">Phone</p>
                  <p className="text-foreground">{order.buyer_phone}</p>
                </div>
              </div>
              {order.buyer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-foreground-muted mt-1" />
                  <div>
                    <p className="text-xs text-foreground-muted">Email</p>
                    <p className="text-foreground">{order.buyer_email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Token */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Order Access</h2>
            <p className="text-xs text-foreground-muted mb-2">Access Token (for customer)</p>
            <p className="font-mono text-xs text-foreground bg-background-secondary p-2 rounded break-all">
              {order.order_access_token}
            </p>
            <a
              href={`/store/orders/${order.order_access_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline mt-2 block"
            >
              View customer order page →
            </a>
          </div>

          {/* Actions */}
          <OrderActions order={order} />
        </div>
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeployRequestById } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { DeploymentActions } from './deployment-actions'
import { ArrowLeft, Package, User, Phone, Mail } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Deployment Details | Admin',
}

export default async function DeploymentDetailPage({ params }: PageProps) {
  const { id } = await params
  const deployRequest = await getDeployRequestById(id)

  if (!deployRequest) {
    notFound()
  }

  const order = deployRequest.order
  const product = order?.product

  const statusColors: Record<string, string> = {
    new: 'bg-amber-100 text-amber-700 border-amber-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    done: 'bg-green-100 text-green-700 border-green-200',
  }

  const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    done: 'Completed',
  }

  return (
    <div>
      <Link
        href="/admin/store/deployments"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deployments
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deployment Request</h1>
          <p className="text-foreground-secondary mt-1 font-mono">{deployRequest.id}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[deployRequest.status]}`}>
          {statusLabels[deployRequest.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product */}
          {product && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Product to Deploy
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-background-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  {product.cover_image_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${product.cover_image_path}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="text-sm text-foreground-secondary">{product.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Info */}
          {order && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground-muted">Order ID</p>
                  <Link
                    href={`/admin/store/orders/${order.id}`}
                    className="font-mono text-sm text-accent hover:underline"
                  >
                    {order.id.slice(0, 8)}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Amount Paid</p>
                  <p className="font-medium text-foreground">
                    {formatPrice(order.amount_cents, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">License Type</p>
                  <p className="font-medium text-foreground">
                    {order.license_type === 'multi' ? 'Multi-use' : 'Single Organization'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Order Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Internal Notes</h2>
            {deployRequest.notes ? (
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">{deployRequest.notes}</p>
              </div>
            ) : (
              <p className="text-foreground-muted text-sm">No notes yet</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <p className="text-sm text-foreground">Request created</p>
                  <p className="text-xs text-foreground-muted">
                    {new Date(deployRequest.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {deployRequest.updated_at !== deployRequest.created_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="text-sm text-foreground">Last updated</p>
                    <p className="text-xs text-foreground-muted">
                      {new Date(deployRequest.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Contact */}
          {order && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Customer Contact</h2>
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
                    <p className="text-foreground font-medium">{order.buyer_phone}</p>
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
          )}

          {/* Actions */}
          <DeploymentActions deployRequest={deployRequest} />
        </div>
      </div>
    </div>
  )
}

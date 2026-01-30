import Link from 'next/link'
import { getAllOrders } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { Eye, Mail } from 'lucide-react'

export const metadata = {
  title: 'Store Orders | Admin',
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Store Orders</h1>
        <p className="text-foreground-secondary mt-1">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === 'paid').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-accent">
            {formatPrice(
              orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount_cents, 0),
              'USD'
            )}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground-secondary">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background-secondary">
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Order</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Product</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Customer</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Amount</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Date</th>
                  <th className="text-right p-4 font-medium text-foreground-secondary text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-background-secondary/50">
                    <td className="p-4">
                      <p className="font-mono text-sm text-foreground">{order.id.slice(0, 8)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{order.product?.name || 'Unknown'}</p>
                      <p className="text-xs text-foreground-muted">
                        {order.license_type === 'multi' ? 'Multi-use' : 'Single'} • {order.delivery_type}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{order.buyer_name || 'Anonymous'}</p>
                      <p className="text-xs text-foreground-muted">{order.buyer_phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">
                        {formatPrice(order.amount_cents, order.currency)}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground-secondary">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/store/orders/${order.id}`}
                          className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

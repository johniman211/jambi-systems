import Link from 'next/link'
import { getAllDeployRequests } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { Eye, Rocket } from 'lucide-react'

export const metadata = {
  title: 'Deployment Requests | Admin',
}

export default async function AdminDeploymentsPage() {
  const deployRequests = await getAllDeployRequests()

  const statusColors: Record<string, string> = {
    new: 'bg-amber-100 text-amber-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }

  const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    done: 'Completed',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Deployment Requests</h1>
        <p className="text-foreground-secondary mt-1">Manage customer deployment requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-foreground">{deployRequests.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {deployRequests.filter((d) => d.status === 'new' || d.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {deployRequests.filter((d) => d.status === 'done').length}
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {deployRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Rocket className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-secondary">No deployment requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background-secondary">
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Request</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Product</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Customer</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Date</th>
                  <th className="text-right p-4 font-medium text-foreground-secondary text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployRequests.map((request: any) => (
                  <tr key={request.id} className="border-b border-border last:border-0 hover:bg-background-secondary/50">
                    <td className="p-4">
                      <p className="font-mono text-sm text-foreground">{request.id.slice(0, 8)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{request.order?.product?.name || 'Unknown'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{request.order?.buyer_name || 'Anonymous'}</p>
                      <p className="text-xs text-foreground-muted">{request.order?.buyer_phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground-secondary">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/store/deployments/${request.id}`}
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

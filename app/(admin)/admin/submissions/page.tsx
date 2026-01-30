import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { statusLabels, systemCategoryLabels, budgetLabels } from '@/lib/validations'
import type { SystemRequest } from '@/lib/types'
import { AdminFiltersForm } from '../admin-filters'
import { ExportButton } from '../export-button'
import Link from 'next/link'
import { FileText } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    status?: string
    system_category?: string
    budget_range?: string
    date_from?: string
    date_to?: string
    search?: string
    page?: string
  }>
}

export default async function SubmissionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const page = parseInt(params.page || '1', 10)
  const perPage = 20
  const offset = (page - 1) * perPage

  let query = supabase
    .from('system_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (params.status) {
    query = query.eq('status', params.status)
  }
  if (params.system_category) {
    query = query.eq('system_category', params.system_category)
  }
  if (params.budget_range) {
    query = query.eq('budget_range', params.budget_range)
  }
  if (params.date_from) {
    query = query.gte('created_at', params.date_from)
  }
  if (params.date_to) {
    query = query.lte('created_at', params.date_to + 'T23:59:59')
  }
  if (params.search) {
    query = query.or(
      `full_name.ilike.%${params.search}%,business_name.ilike.%${params.search}%,phone.ilike.%${params.search}%,email.ilike.%${params.search}%`
    )
  }

  const { data: submissions, count } = await query

  const totalPages = count ? Math.ceil(count / perPage) : 1

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'info'
      case 'in_review': return 'warning'
      case 'contacted': return 'success'
      case 'closed': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">System Requests</h1>
          <p className="text-primary-600 mt-1">
            {count} total submission{count !== 1 ? 's' : ''}
          </p>
        </div>
        <ExportButton filters={params} />
      </div>

      <Card>
        <CardContent className="p-4">
          <AdminFiltersForm />
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Business</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {submissions && submissions.length > 0 ? (
                submissions.map((submission: SystemRequest) => (
                  <tr key={submission.id} className="hover:bg-primary-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary-900">{submission.full_name}</div>
                      <div className="text-sm text-primary-500">{submission.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-700">{submission.business_name}</td>
                    <td className="px-4 py-3 text-sm text-primary-700">
                      {systemCategoryLabels[submission.system_category] || submission.system_category}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-700">
                      {budgetLabels[submission.budget_range] || submission.budget_range}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(submission.status) as any}>
                        {statusLabels[submission.status] || submission.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/submissions/${submission.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-primary-300 mb-3" />
                    <p className="text-primary-500">No submissions found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-primary-100">
            <div className="text-sm text-primary-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/submissions?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                  <Button variant="outline" size="sm">Previous</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/submissions?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
                  <Button variant="outline" size="sm">Next</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Container, Card, CardContent, CardHeader, Badge, Button } from '@/components/ui'
import {
  statusLabels,
  systemCategoryLabels,
  budgetLabels,
  businessTypeLabels,
  timelineLabels,
  paymentLabels,
  requiresLoginLabels,
} from '@/lib/validations'
import { UpdateStatusForm } from './update-status-form'
import { UpdateNotesForm } from './update-notes-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: submission, error } = await supabase
    .from('system_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !submission) {
    notFound()
  }

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
    <Container>
      <div className="mb-6">
        <Link href="/admin" className="text-primary-600 hover:text-primary-900 text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">{submission.full_name}</h1>
          <p className="text-primary-600">{submission.business_name}</p>
        </div>
        <Badge variant={statusBadgeVariant(submission.status) as any} className="text-sm px-3 py-1">
          {statusLabels[submission.status] || submission.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Contact Information</h2>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-primary-500">Phone</dt>
                  <dd className="font-medium text-primary-900">{submission.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">Email</dt>
                  <dd className="font-medium text-primary-900">{submission.email || '—'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Project Details</h2>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-primary-500">Business Type</dt>
                  <dd className="font-medium text-primary-900">
                    {businessTypeLabels[submission.business_type] || submission.business_type}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">System Category</dt>
                  <dd className="font-medium text-primary-900">
                    {systemCategoryLabels[submission.system_category] || submission.system_category}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">Budget Range</dt>
                  <dd className="font-medium text-primary-900">
                    {budgetLabels[submission.budget_range] || submission.budget_range}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">Timeline</dt>
                  <dd className="font-medium text-primary-900">
                    {timelineLabels[submission.timeline] || submission.timeline}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">Payments</dt>
                  <dd className="font-medium text-primary-900">
                    {submission.payments?.map((p: string) => paymentLabels[p] || p).join(', ') || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-primary-500">Requires Login</dt>
                  <dd className="font-medium text-primary-900">
                    {requiresLoginLabels[submission.requires_login] || submission.requires_login}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Problem & Goals */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Problem & Goals</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm text-primary-500 mb-1">Problem</dt>
                <dd className="text-primary-900 whitespace-pre-wrap">{submission.problem}</dd>
              </div>
              {submission.goals && (
                <div>
                  <dt className="text-sm text-primary-500 mb-1">Goals</dt>
                  <dd className="text-primary-900 whitespace-pre-wrap">{submission.goals}</dd>
                </div>
              )}
              {submission.additional_info && (
                <div>
                  <dt className="text-sm text-primary-500 mb-1">Additional Information</dt>
                  <dd className="text-primary-900 whitespace-pre-wrap">{submission.additional_info}</dd>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Update Status</h2>
            </CardHeader>
            <CardContent>
              <UpdateStatusForm submissionId={submission.id} currentStatus={submission.status} />
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Internal Notes</h2>
            </CardHeader>
            <CardContent>
              <UpdateNotesForm submissionId={submission.id} currentNotes={submission.internal_notes || ''} />
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-primary-900">Submission Info</h2>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-primary-500">Submitted</dt>
                  <dd className="text-primary-900">
                    {new Date(submission.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-primary-500">ID</dt>
                  <dd className="text-primary-900 font-mono text-xs">{submission.id}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

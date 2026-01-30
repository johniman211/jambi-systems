'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateDeployRequest } from '@/lib/store/actions'
import { Loader2, CheckCircle } from 'lucide-react'

interface DeploymentActionsProps {
  deployRequest: {
    id: string
    status: string
    notes: string | null
  }
}

export function DeploymentActions({ deployRequest }: DeploymentActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [status, setStatus] = useState(deployRequest.status)
  const [notes, setNotes] = useState(deployRequest.notes || '')

  const handleSave = async () => {
    setMessage(null)
    startTransition(async () => {
      const result = await updateDeployRequest(deployRequest.id, {
        status: status as 'new' | 'in_progress' | 'done',
        notes: notes || undefined,
      })
      if (result.success) {
        setMessage({ type: 'success', text: 'Changes saved' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save changes' })
      }
    })
  }

  const handleMarkDone = async () => {
    setStatus('done')
    setMessage(null)
    startTransition(async () => {
      const result = await updateDeployRequest(deployRequest.id, {
        status: 'done',
        notes: notes || undefined,
      })
      if (result.success) {
        setMessage({ type: 'success', text: 'Marked as completed' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update' })
      }
    })
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4">Actions</h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm text-foreground-muted mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-foreground-muted mb-2">Internal Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isPending}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            placeholder="Add notes about the deployment..."
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Save Changes
        </button>

        {/* Quick Mark Done */}
        {status !== 'done' && (
          <button
            onClick={handleMarkDone}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Completed
          </button>
        )}

        {/* Message */}
        {message && (
          <div className={`text-sm p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

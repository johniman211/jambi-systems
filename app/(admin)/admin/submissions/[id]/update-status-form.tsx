'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Select } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { statusLabels } from '@/lib/validations'

interface UpdateStatusFormProps {
  submissionId: string
  currentStatus: string
}

export function UpdateStatusForm({ submissionId, currentStatus }: UpdateStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('system_requests')
        .update({ status })
        .eq('id', submissionId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleMarkContacted() {
    setIsUpdating(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('system_requests')
        .update({ status: 'contacted' })
        .eq('id', submissionId)

      if (error) throw error

      setStatus('contacted')
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          name="status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Button type="submit" size="sm" isLoading={isUpdating} className="w-full">
          Update Status
        </Button>
      </form>

      {currentStatus !== 'contacted' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleMarkContacted}
          disabled={isUpdating}
          className="w-full"
        >
          Mark as Contacted
        </Button>
      )}
    </div>
  )
}

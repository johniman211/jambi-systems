'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Textarea } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface UpdateNotesFormProps {
  submissionId: string
  currentNotes: string
}

export function UpdateNotesForm({ submissionId, currentNotes }: UpdateNotesFormProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(currentNotes)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('system_requests')
        .update({ internal_notes: notes })
        .eq('id', submissionId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update notes')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes..."
        className="min-h-[100px]"
      />
      <Button type="submit" size="sm" isLoading={isUpdating} className="w-full">
        Save Notes
      </Button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { systemCategoryLabels, budgetLabels, statusLabels, businessTypeLabels, timelineLabels, paymentLabels, requiresLoginLabels } from '@/lib/validations'
import type { SystemRequest } from '@/lib/types'

interface ExportButtonProps {
  filters: {
    status?: string
    system_category?: string
    budget_range?: string
    date_from?: string
    date_to?: string
    search?: string
  }
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    setIsExporting(true)

    try {
      const supabase = createClient()
      
      let query = supabase
        .from('system_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.system_category) {
        query = query.eq('system_category', filters.system_category)
      }
      if (filters.budget_range) {
        query = query.eq('budget_range', filters.budget_range)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to + 'T23:59:59')
      }
      if (filters.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) throw error

      if (!data || data.length === 0) {
        alert('No data to export')
        return
      }

      // Generate CSV
      const headers = [
        'ID',
        'Full Name',
        'Business Name',
        'Phone',
        'Email',
        'Business Type',
        'System Category',
        'Problem',
        'Goals',
        'Payments',
        'Requires Login',
        'Timeline',
        'Budget Range',
        'Additional Info',
        'Status',
        'Internal Notes',
        'Created At',
      ]

      const rows = data.map((row: SystemRequest) => [
        row.id,
        row.full_name,
        row.business_name,
        row.phone,
        row.email || '',
        businessTypeLabels[row.business_type] || row.business_type,
        systemCategoryLabels[row.system_category] || row.system_category,
        `"${(row.problem || '').replace(/"/g, '""')}"`,
        `"${(row.goals || '').replace(/"/g, '""')}"`,
        row.payments?.map(p => paymentLabels[p] || p).join('; ') || '',
        requiresLoginLabels[row.requires_login] || row.requires_login,
        timelineLabels[row.timeline] || row.timeline,
        budgetLabels[row.budget_range] || row.budget_range,
        `"${(row.additional_info || '').replace(/"/g, '""')}"`,
        statusLabels[row.status] || row.status,
        `"${(row.internal_notes || '').replace(/"/g, '""')}"`,
        new Date(row.created_at).toISOString(),
      ])

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

      // Download
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jambi-submissions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}

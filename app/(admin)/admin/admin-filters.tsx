'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { statusLabels, systemCategoryLabels, budgetLabels } from '@/lib/validations'

export function AdminFiltersForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [category, setCategory] = useState(searchParams.get('system_category') || '')
  const [budget, setBudget] = useState(searchParams.get('budget_range') || '')
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (category) params.set('system_category', category)
    if (budget) params.set('budget_range', budget)
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)
    if (search) params.set('search', search)
    
    router.push(`/admin?${params.toString()}`)
  }

  function handleClear() {
    setStatus('')
    setCategory('')
    setBudget('')
    setDateFrom('')
    setDateTo('')
    setSearch('')
    router.push('/admin')
  }

  const statusOptions = [{ value: '', label: 'All Statuses' }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]
  const categoryOptions = [{ value: '', label: 'All Categories' }, ...Object.entries(systemCategoryLabels).map(([value, label]) => ({ value, label }))]
  const budgetOptions = [{ value: '', label: 'All Budgets' }, ...Object.entries(budgetLabels).map(([value, label]) => ({ value, label }))]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Select
          name="status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Select
          name="system_category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          name="budget_range"
          options={budgetOptions}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <Input
          type="date"
          name="date_from"
          placeholder="From date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          type="date"
          name="date_to"
          placeholder="To date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <Input
          type="search"
          name="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Apply Filters</Button>
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>Clear</Button>
      </div>
    </form>
  )
}

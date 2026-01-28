export interface SystemRequest {
  id: string
  full_name: string
  business_name: string
  phone: string
  email: string | null
  business_type: string
  system_category: string
  problem: string
  goals: string | null
  payments: string[]
  requires_login: string
  timeline: string
  budget_range: string
  additional_info: string | null
  consent: boolean
  status: 'new' | 'in_review' | 'contacted' | 'closed'
  internal_notes: string | null
  created_at: string
}

export interface AdminFilters {
  status?: string
  system_category?: string
  budget_range?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}

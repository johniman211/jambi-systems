import { z } from 'zod'

export const systemRequestSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  business_name: z.string().min(2, 'Business name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  business_type: z.enum([
    'creator_influencer',
    'media_news',
    'online_business',
    'shop_landlord',
    'school_ngo',
    'other',
  ], { required_error: 'Please select your business type' }),
  system_category: z.enum([
    'creator_subscription',
    'payment_access',
    'debt_tracking',
    'internal_management',
    'not_sure',
  ], { required_error: 'Please select a system category' }),
  problem: z.string().min(10, 'Please describe your problem'),
  goals: z.string().optional(),
  payments: z.array(z.enum(['mobile_money', 'bank', 'cash_only', 'none'])).min(1, 'Please select at least one option'),
  requires_login: z.enum(['yes', 'no', 'not_sure'], { required_error: 'Please select an option' }),
  timeline: z.enum(['asap', '2_4_weeks', '1_2_months', 'flexible'], { required_error: 'Please select a timeline' }),
  budget_range: z.enum(['500_800', '800_1500', '1500_3000', '3000_plus', 'not_sure'], { required_error: 'Please select a budget range' }),
  additional_info: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'You must accept the terms'),
  honeypot: z.string().max(0, 'Bot detected'),
})

export type SystemRequestInput = z.infer<typeof systemRequestSchema>

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const businessTypeLabels: Record<string, string> = {
  creator_influencer: 'Creator / Influencer',
  media_news: 'Media / News Platform',
  online_business: 'Online Business / Software',
  shop_landlord: 'Shop / Landlord / Service Business',
  school_ngo: 'School / NGO / Institution',
  other: 'Other',
}

export const systemCategoryLabels: Record<string, string> = {
  creator_subscription: 'Creator Subscription System',
  payment_access: 'Payment & Access Control System',
  debt_tracking: 'Debt & Customer Tracking System',
  internal_management: 'Internal Management System',
  not_sure: 'Not sure (help me decide)',
}

export const paymentLabels: Record<string, string> = {
  mobile_money: 'Mobile money',
  bank: 'Bank payments',
  cash_only: 'Cash tracking only',
  none: 'No payments needed',
}

export const requiresLoginLabels: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  not_sure: 'Not sure',
}

export const timelineLabels: Record<string, string> = {
  asap: 'As soon as possible',
  '2_4_weeks': 'Within 2–4 weeks',
  '1_2_months': '1–2 months',
  flexible: 'Flexible',
}

export const budgetLabels: Record<string, string> = {
  '500_800': '$500 – $800',
  '800_1500': '$800 – $1,500',
  '1500_3000': '$1,500 – $3,000',
  '3000_plus': '$3,000+',
  not_sure: 'Not sure yet',
}

export const statusLabels: Record<string, string> = {
  new: 'New',
  in_review: 'In Review',
  contacted: 'Contacted',
  closed: 'Closed',
}

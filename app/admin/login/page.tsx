import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Logo } from '@/components/brand/Logo'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground-secondary mt-2">Sign in to access the dashboard</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

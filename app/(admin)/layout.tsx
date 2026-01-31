import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-primary-50 flex">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 pt-16 px-4 pb-4 lg:p-8 overflow-auto">{children}</main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Container, Button } from '@/components/ui'

interface AdminNavProps {
  userEmail?: string
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-primary-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-primary-900">
              Jambi Admin
            </Link>
            <Link
              href="/"
              className="text-sm text-primary-500 hover:text-primary-700"
              target="_blank"
            >
              View Site →
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-primary-600">{userEmail}</span>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Rocket,
  FileText,
  Settings,
  Store,
  LogOut,
  ExternalLink,
  CreditCard,
  Menu,
  X,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
}

const sidebarLinks = [
  {
    title: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: 'Store',
    links: [
      { href: '/admin/store', label: 'Products', icon: Package, exact: true },
      { href: '/admin/store/new', label: 'Add Product', icon: Store },
      { href: '/admin/store/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/store/payments', label: 'Payments', icon: CreditCard },
      { href: '/admin/store/deployments', label: 'Deployments', icon: Rocket },
      { href: '/admin/store/settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    title: 'System',
    links: [
      { href: '/admin/submissions', label: 'Submissions', icon: FileText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-primary-100">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-bold text-primary-900">Jambi Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {sidebarLinks.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href, link.exact)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        active
                          ? 'bg-primary-900 text-white'
                          : 'text-primary-600 hover:bg-primary-100 hover:text-primary-900'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* View Site Link */}
        <div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-100 hover:text-primary-900 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            View Site
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-primary-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {userEmail?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-900 truncate">
              {userEmail || 'Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-primary-200"
      >
        <Menu className="w-6 h-6 text-primary-900" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-200 flex flex-col transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-1 text-primary-600 hover:text-primary-900"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-primary-200 flex-col">
        {sidebarContent}
      </aside>
    </>
  )
}

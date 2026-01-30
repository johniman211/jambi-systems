'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Rocket,
  FileText,
  Settings,
  Store,
  CreditCard,
  Users,
  BarChart3,
} from 'lucide-react'

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
      { href: '/admin/store/deployments', label: 'Deployments', icon: Rocket },
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

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-primary-200 p-4">
      <nav className="space-y-6">
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
      </nav>

      {/* Quick Stats Card */}
      <div className="mt-8 p-4 bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl text-white">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs font-medium opacity-80">Quick Tip</span>
        </div>
        <p className="text-sm opacity-90">
          Add products in the Store section to start selling on your website.
        </p>
      </div>
    </aside>
  )
}

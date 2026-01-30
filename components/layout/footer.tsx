import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

const footerLinks = {
  main: [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' },
    { href: '/work', label: 'Work' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/request', label: 'Request a System' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/store/terms', label: 'Store Terms' },
    { href: '/store/license', label: 'License Info' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-background-dark text-foreground-on-dark">
      <div className="container-wide">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/">
                <Logo size="lg" variant="light" />
              </Link>
              <p className="mt-6 text-foreground-on-dark-secondary text-base leading-relaxed max-w-md">
                Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground-on-dark-secondary mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                {footerLinks.main.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-foreground-on-dark-secondary hover:text-foreground-on-dark transition-colors text-sm link-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Location */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground-on-dark-secondary mb-5">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-foreground-on-dark-secondary hover:text-foreground-on-dark transition-colors text-sm link-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground-on-dark-secondary mb-3">
                  Location
                </h3>
                <p className="text-foreground-on-dark-secondary text-sm">South Sudan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-dark py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-foreground-on-dark-secondary text-sm">
              &copy; {new Date().getFullYear()} Jambi Systems. All rights reserved.
            </p>
            <p className="text-foreground-muted text-xs">
              Built for African businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

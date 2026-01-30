import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jambisystems.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jambi Systems | Custom Web Systems for Creators & Businesses in South Sudan',
    template: '%s | Jambi Systems',
  },
  description: 'Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.',
  keywords: ['web systems', 'custom software', 'mobile money', 'South Sudan', 'payment systems', 'subscription systems', 'business software'],
  authors: [{ name: 'Jambi Systems' }],
  creator: 'Jambi Systems',
  publisher: 'Jambi Systems',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Jambi Systems',
    title: 'Jambi Systems | Custom Web Systems for Creators & Businesses',
    description: 'Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jambi Systems | Custom Web Systems for Creators & Businesses',
    description: 'Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

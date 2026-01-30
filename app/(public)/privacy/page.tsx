import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Jambi Systems - how we collect, use, and protect your data.',
  openGraph: {
    title: 'Privacy Policy | Jambi Systems',
    description: 'Privacy Policy for Jambi Systems',
  },
}

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container-narrow">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-foreground-secondary mb-4">
            Clear and transparent information.
          </p>
          <p className="text-foreground-muted text-sm mb-6">
            Last updated: January 2025
          </p>
          {/* Minimal divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-accent/50 to-accent-2/50 rounded-full mb-12" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="prose-custom space-y-8">
            <p className="text-lg text-foreground-secondary">
              Jambi Systems ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Information We Collect</h2>
              <p className="text-foreground-secondary">We collect information that you provide directly to us through our forms:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Contact information (name, email address, phone number)</li>
                <li>Business information (business name, type of business)</li>
                <li>Project details (system requirements, budget, timeline)</li>
                <li>Any additional information you choose to provide</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">How We Use Your Information</h2>
              <p className="text-foreground-secondary">We use the information we collect to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Respond to your inquiries and project requests</li>
                <li>Evaluate whether your project is a good fit for our services</li>
                <li>Communicate with you about our services</li>
                <li>Improve our website and services</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Data Storage</h2>
              <p className="text-foreground-secondary">
                Your information is securely stored using Supabase, a trusted database platform with industry-standard security measures. We take reasonable precautions to protect your data from unauthorized access, disclosure, or misuse.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Data Sharing</h2>
              <p className="text-foreground-secondary">
                <strong className="text-foreground">We do not sell, trade, or rent your personal information to third parties.</strong> We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights or the rights of others</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Rights</h2>
              <p className="text-foreground-secondary">You have the right to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Request access to your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Contact Us</h2>
              <p className="text-foreground-secondary">
                If you have any questions about this Privacy Policy or our data practices, please contact us through our website.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Changes to This Policy</h2>
              <p className="text-foreground-secondary">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

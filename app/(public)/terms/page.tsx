import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Jambi Systems - the terms and conditions for our web development services.',
  openGraph: {
    title: 'Terms of Service | Jambi Systems',
    description: 'Terms of Service for Jambi Systems',
  },
}

export default function TermsPage() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container-narrow">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Terms of Service
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
              These Terms of Service ("Terms") govern your use of Jambi Systems' website and services. By engaging our services, you agree to these Terms.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Scope of Services</h2>
              <p className="text-foreground-secondary">
                Jambi Systems provides custom web system development services. Each project is unique, and the specific scope, features, and deliverables will be agreed upon in writing before work begins.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Estimates and Pricing</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>All estimates are provided after understanding your project requirements</li>
                <li>Estimates may change if the scope of work changes</li>
                <li>Final pricing will be confirmed in a written agreement before work begins</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Payment Terms</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li><strong className="text-foreground">50% upfront payment</strong> is required to begin work on any project</li>
                <li>The remaining 50% is due upon project completion, before final delivery</li>
                <li>Payment methods will be specified in your project agreement</li>
                <li>Late payments may result in project delays</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Timeline</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Project timelines are estimates and may vary based on complexity</li>
                <li>Delays caused by the client (e.g., late feedback, content) may extend the timeline</li>
                <li>We will communicate any significant timeline changes promptly</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Revisions</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>A reasonable number of revisions is included in each project</li>
                <li>Additional revisions or scope changes may incur extra charges</li>
                <li>Revision requests should be submitted in writing</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Client Responsibilities</h2>
              <p className="text-foreground-secondary">You agree to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Provide accurate and complete information about your project</li>
                <li>Respond to requests for feedback and approval in a timely manner</li>
                <li>Provide any required content, assets, or access credentials</li>
                <li>Make payments as agreed</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Intellectual Property</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-foreground-secondary">
                <li>Upon full payment, you will own the rights to your custom-built system</li>
                <li>We retain the right to use the project in our portfolio (without sensitive data)</li>
                <li>Third-party components (e.g., open-source libraries) remain subject to their original licenses</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Limitation of Liability</h2>
              <p className="text-foreground-secondary">
                Jambi Systems provides services on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific project in question.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Termination</h2>
              <p className="text-foreground-secondary">
                Either party may terminate a project with written notice. If you terminate, payment for work completed is still due. Refunds for upfront payments are at our discretion based on work completed.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Changes to These Terms</h2>
              <p className="text-foreground-secondary">
                We may update these Terms from time to time. Continued use of our services constitutes acceptance of any changes.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Contact</h2>
              <p className="text-foreground-secondary">
                If you have questions about these Terms, please contact us through our website.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

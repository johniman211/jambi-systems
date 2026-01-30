import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { FileText, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Store Terms',
  description: 'Terms and conditions for purchasing from Jambi Systems Store.',
}

export default function StoreTermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6">
                <FileText className="w-8 h-8" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
                Store Terms
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="text-xl text-foreground-secondary">
                Terms and conditions for purchases from Jambi Systems Store
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-sm text-foreground-muted mt-4">
                Last updated: January 2026
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Overview</h2>
              <p className="text-foreground-secondary mb-6">
                These Store Terms govern your purchase and use of digital products from Jambi Systems Store. By completing a purchase, you agree to these terms in addition to our general Terms of Service and Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">2. Products</h2>
              <p className="text-foreground-secondary mb-4">
                Jambi Systems Store sells digital products including but not limited to:
              </p>
              <ul className="list-disc list-inside text-foreground-secondary mb-6 space-y-2">
                <li>Web application source code</li>
                <li>System templates and frameworks</li>
                <li>Documentation and guides</li>
                <li>Deployment services</li>
              </ul>
              <p className="text-foreground-secondary mb-6">
                All products are provided "as-is" with documentation for setup and usage. Product descriptions, features, and screenshots represent the product at the time of listing and may be subject to updates.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">3. Pricing and Payment</h2>
              <p className="text-foreground-secondary mb-4">
                All prices are listed in USD unless otherwise specified. Payment is processed through PaySSD, which supports:
              </p>
              <ul className="list-disc list-inside text-foreground-secondary mb-6 space-y-2">
                <li>Mobile money (various providers)</li>
                <li>Bank transfer</li>
              </ul>
              <p className="text-foreground-secondary mb-6">
                Prices may change without notice. The price at checkout is the final price you pay.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">4. Licensing</h2>
              <p className="text-foreground-secondary mb-4">
                Each product purchase includes a license. We offer two license types:
              </p>
              <ul className="list-disc list-inside text-foreground-secondary mb-6 space-y-2">
                <li><strong>Single Organization License:</strong> Use for one organization, business, or project. Included with base price.</li>
                <li><strong>Multi-Use License:</strong> Use for unlimited organizations or projects. Available at additional cost.</li>
              </ul>
              <p className="text-foreground-secondary mb-6">
                See our <Link href="/store/license" className="text-accent hover:underline">License Information</Link> page for full details on permitted usage.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">5. Delivery</h2>
              <p className="text-foreground-secondary mb-4">
                We offer two delivery options:
              </p>
              <ul className="list-disc list-inside text-foreground-secondary mb-6 space-y-2">
                <li><strong>Download:</strong> After payment confirmation, you receive access to download the source files via a secure, time-limited link.</li>
                <li><strong>Deploy for You:</strong> Our team contacts you within 24-48 hours to begin the deployment process. Deployment timelines vary by product complexity.</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">6. Refund Policy</h2>
              <p className="text-foreground-secondary mb-4">
                Due to the digital nature of our products:
              </p>
              <ul className="list-disc list-inside text-foreground-secondary mb-6 space-y-2">
                <li>Refunds are generally not provided once download access is granted</li>
                <li>If you experience technical issues preventing download, contact us within 7 days</li>
                <li>For deployment services, partial refunds may be considered if deployment has not begun</li>
              </ul>
              <p className="text-foreground-secondary mb-6">
                We encourage you to review product descriptions, screenshots, and demos before purchasing.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">7. Support</h2>
              <p className="text-foreground-secondary mb-6">
                Product support varies by product. Check each product's description for support details. General support for download and access issues is available via our contact page.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">8. Intellectual Property</h2>
              <p className="text-foreground-secondary mb-6">
                You receive a license to use the purchased product. Jambi Systems retains all intellectual property rights to the original work. You may not claim authorship of the original code or redistribute the source code publicly.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">9. Limitation of Liability</h2>
              <p className="text-foreground-secondary mb-6">
                Jambi Systems provides products for general business use. We are not liable for any damages arising from your use of our products, including but not limited to lost profits, data loss, or business interruption. Our maximum liability is limited to the amount you paid for the product.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">10. Changes to Terms</h2>
              <p className="text-foreground-secondary mb-6">
                We may update these Store Terms at any time. Changes apply to purchases made after the update date. We encourage you to review these terms before each purchase.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">11. Contact</h2>
              <p className="text-foreground-secondary mb-6">
                For questions about these terms or your purchase, contact us at{' '}
                <Link href="/contact" className="text-accent hover:underline">our contact page</Link>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-on-dark mb-4">
              Ready to browse our products?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              Explore our collection of professionally built systems.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link href="/store">
              <Button variant="secondary" size="lg" className="group">
                Browse Store
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </Section>
    </>
  )
}

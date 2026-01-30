import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { Shield, Check, X, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'License Information',
  description: 'Understand the licensing options for Jambi Systems store products.',
}

export default function LicensePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6">
                <Shield className="w-8 h-8" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
                License Information
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="text-xl text-foreground-secondary">
                Understand your rights and permitted usage for products purchased from Jambi Systems Store.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* License Types Comparison */}
      <Section>
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            License Types
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Single Organization License */}
          <ScrollReveal delay={0.1}>
            <div className="bg-card rounded-2xl border border-border p-8 h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Single Organization</h3>
                <p className="text-foreground-secondary text-sm">Included with every purchase</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Use for one organization or business</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Full source code access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Modify and customize freely</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Deploy on your own servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Cannot resell or redistribute</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Cannot use for multiple clients</span>
                </li>
              </ul>

              <div className="text-center">
                <span className="text-2xl font-bold text-accent">Included</span>
                <p className="text-sm text-foreground-muted mt-1">with base price</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Multi-Use License */}
          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-2xl border-2 border-accent p-8 h-full relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                  RECOMMENDED FOR AGENCIES
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Multi-Use License</h3>
                <p className="text-foreground-secondary text-sm">For agencies and developers</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Use for unlimited organizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Full source code access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Modify and customize freely</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Deploy for multiple clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Use in client projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Cannot resell source code as-is</span>
                </li>
              </ul>

              <div className="text-center">
                <span className="text-2xl font-bold text-accent">+ Extra</span>
                <p className="text-sm text-foreground-muted mt-1">varies by product</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-background-secondary">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-6">
          <ScrollReveal delay={0.1}>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I modify the source code?</h3>
              <p className="text-foreground-secondary">
                Yes! Both license types allow you to fully modify and customize the source code to fit your needs. You own the deployment and can make any changes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">What happens if I need to use it for a second project?</h3>
              <p className="text-foreground-secondary">
                With a Single Organization license, you would need to purchase another license. With a Multi-Use license, you can use it for unlimited projects.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I use this for client work?</h3>
              <p className="text-foreground-secondary">
                Single Organization license: You can build it for one client, who becomes the license holder. Multi-Use license: You can use it for multiple clients.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Is the license perpetual?</h3>
              <p className="text-foreground-secondary">
                Yes! Once you purchase, you own the license forever. There are no recurring fees for the license itself.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">What is NOT allowed?</h3>
              <p className="text-foreground-secondary">
                You cannot redistribute, resell, or share the source code publicly. You cannot claim the original work as your own. You cannot remove license attribution from the code.
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
              Ready to get started?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              Browse our collection of professionally built systems.
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { AboutHeroIllustration } from '@/components/illustrations/HeroIllustration'
import { Eye, Shield, Truck, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Jambi Systems is a web agency focused on building custom web systems for creators and businesses in South Sudan.',
  openGraph: {
    title: 'About | Jambi Systems',
    description: 'Jambi Systems is a web agency focused on building custom web systems for creators and businesses in South Sudan.',
  },
}

const principles = [
  {
    icon: Eye,
    title: 'Clarity',
    description: 'We build systems that are easy to understand and use.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Every system is built with security as a priority.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'We deliver on time with clear communication throughout.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="container-wide relative">
          <div className="py-20 md:py-28 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Content */}
              <div className="text-center lg:text-left">
                <ScrollReveal>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                    About Jambi Systems
                  </h1>
                </ScrollReveal>
                
                <ScrollReveal delay={0.1}>
                  <p className="text-xl text-foreground-secondary mb-6">
                    We build systems that help businesses operate, grow, and stay in control.
                  </p>
                </ScrollReveal>
                
                <ScrollReveal delay={0.2}>
                  <div className="space-y-4 text-foreground-secondary">
                    <p>
                      Jambi Systems is a web agency focused on building custom web systems for creators and businesses in South Sudan.
                    </p>
                    <p>
                      We build systems that help you manage mobile money and bank payments, customers, subscriptions, and internal operations.
                    </p>
                    <p>
                      We focus on clean design, secure development, and reliable delivery.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
              
              {/* Right - Illustration */}
              <ScrollReveal delay={0.2}>
                <div className="mt-8 lg:mt-0">
                  <AboutHeroIllustration />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Statement - Dark Section */}
      <Section variant="dark" size="md">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground-on-dark font-medium leading-relaxed">
              "Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations."
            </p>
          </div>
        </ScrollReveal>
      </Section>

      {/* Principles */}
      <Section size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Our Principles
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {principles.map((principle, index) => (
            <ScrollReveal key={principle.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                  <principle.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-foreground-secondary">
                  {principle.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="secondary" size="lg">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6">
              Ready to build your system?
            </h2>
            <p className="text-foreground-secondary text-lg mb-10">
              Tell us about your project and let's see if we're a good fit.
            </p>
            <Link href="/request">
              <Button size="lg" className="group">
                Request a System
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </Section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal } from '@/components/ui'
import { ContactForm } from './contact-form'
import { ContactHeroIllustration } from '@/components/illustrations/HeroIllustration'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Jambi Systems. Use the Request a System form or contact us directly.',
  openGraph: {
    title: 'Contact | Jambi Systems',
    description: 'Contact Jambi Systems for custom web system development.',
  },
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone / WhatsApp',
    value: 'Contact via Request Form',
    description: 'We respond within 24-48 hours',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'Contact via Request Form',
    description: 'For project inquiries',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'South Sudan',
    description: 'Serving clients locally and remotely',
  },
]

export default function ContactPage() {
  return (
    <section className="relative">
      <div className="absolute inset-0 gradient-subtle" />
      
      <div className="container-wide relative py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Contact Info */}
          <div>
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                Contact
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-lg text-foreground-secondary mb-6">
                Let's talk about your system.
              </p>
            </ScrollReveal>
            
            {/* Illustration */}
            <ScrollReveal delay={0.15}>
              <div className="mb-8 flex justify-center lg:justify-start">
                <ContactHeroIllustration />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="text-foreground-secondary mb-10">
                Use the{' '}
                <Link href="/request" className="text-accent font-medium hover:underline">
                  Request a System
                </Link>{' '}
                form or contact us directly.
              </p>
            </ScrollReveal>
            
            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item, index) => (
                <ScrollReveal key={item.title} delay={0.1 + index * 0.05}>
                  <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-foreground-muted transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-foreground-secondary">{item.value}</p>
                      <p className="text-foreground-muted text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            
            {/* CTA to Request */}
            <ScrollReveal delay={0.3}>
              <div className="bg-background-secondary rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Have a project in mind?</h3>
                <p className="text-foreground-secondary text-sm mb-4">
                  For system requests, use our detailed form to help us understand your needs better.
                </p>
                <Link href="/request">
                  <Button variant="outline" size="sm" className="group">
                    Request a System
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Right Column - Form */}
          <div>
            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 lg:p-10 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

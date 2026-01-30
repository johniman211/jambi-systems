import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { ServicesHeroIllustration } from '@/components/illustrations/HeroIllustration'
import { 
  Check, 
  ArrowRight, 
  Layers, 
  CreditCard, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Jambi Systems designs and builds secure, custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.',
  openGraph: {
    title: 'Services | Jambi Systems',
    description: 'Custom Web Systems for Creators & Businesses',
  },
}

const services = [
  {
    icon: Layers,
    title: 'Creator Subscription Systems',
    for: 'For creators, media platforms, and educators',
    description: 'We build private systems that allow creators to earn from their audience through paid content and subscriptions.',
    bullets: [
      'Creator profile and landing page',
      'Free and premium content sections',
      'User login and access control',
      'Subscription and one-time payment options',
      'Mobile money and bank payment integration',
      'Automatic access after payment',
      'Creator admin dashboard',
    ],
    result: 'Creators can monetize content and control who accesses premium material.',
  },
  {
    icon: CreditCard,
    title: 'Payment & Access Control Systems',
    for: 'For digital businesses and software sellers',
    description: 'We build systems that verify payments and automatically control user access to services or content.',
    bullets: [
      'Secure user accounts',
      'Payment verification logic',
      'Mobile money and bank payment tracking',
      'Automatic unlock or restriction of access',
      'Admin dashboard with reports',
      'Scalable system architecture',
    ],
    result: "Businesses know exactly who paid and who didn't — no manual follow-ups.",
  },
  {
    icon: BarChart3,
    title: 'Debt & Customer Tracking Systems',
    for: 'For shops, landlords, schools, and service businesses',
    description: 'We build systems that help businesses track customers, payments, and outstanding balances.',
    bullets: [
      'Customer and account management',
      'Partial payment tracking',
      'Outstanding balance calculation',
      'Cash, mobile money, and bank payment records',
      'Reports and payment history',
      'Secure data access',
    ],
    result: 'Businesses recover money faster and keep accurate financial records.',
  },
  {
    icon: Settings,
    title: 'Internal Management Systems',
    for: 'For companies, NGOs, and institutions',
    description: 'We build internal systems to manage staff, operations, and sensitive data securely.',
    bullets: [
      'Staff accounts and roles',
      'Permission-based access',
      'Internal workflows and approvals',
      'Reports and dashboards',
      'Optional payment modules',
      'Secure and scalable setup',
    ],
    result: 'Teams work efficiently with full visibility and control.',
  },
]

const howWeWork = [
  { step: 'You explain your problem', description: 'Share your business challenge with us' },
  { step: 'We design the right system', description: 'Custom solution tailored to your needs' },
  { step: 'We agree on scope, price, and timeline', description: 'No surprises or hidden costs' },
  { step: '50% payment to start', description: 'Commitment from both sides' },
  { step: 'System development and review', description: 'Regular updates and feedback loops' },
  { step: 'Final payment and launch', description: 'Your system goes live' },
]

const pricing = [
  { type: 'Creator systems', price: 'from $500' },
  { type: 'Payment & access systems', price: 'from $1,000' },
  { type: 'Tracking systems', price: 'from $800' },
  { type: 'Internal systems', price: 'from $1,500' },
]

export default function ServicesPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            provider: {
              '@type': 'Organization',
              name: 'Jambi Systems',
            },
            serviceType: 'Custom Web Development',
            areaServed: 'South Sudan',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Web System Services',
              itemListElement: services.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description,
                },
                position: index + 1,
              })),
            },
          }),
        }}
      />

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
                    Services
                  </h1>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <p className="text-xl md:text-2xl text-foreground-secondary mb-6">
                    Custom Web Systems for Creators & Businesses
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <p className="text-foreground-secondary text-lg max-w-xl">
                    Every system is built to fit your workflow — no templates, no generic software.
                  </p>
                </ScrollReveal>
              </div>
              
              {/* Right - Illustration */}
              <ScrollReveal delay={0.2}>
                <div className="mt-8 lg:mt-0">
                  <ServicesHeroIllustration />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section variant="secondary" size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Our Core Services
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="space-y-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <div className="bg-card rounded-2xl border border-border p-8 md:p-10 hover:shadow-card-hover transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <service.icon className="w-7 h-7" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-accent text-sm font-medium mb-4">{service.for}</p>
                    <p className="text-foreground-secondary mb-6 max-w-2xl">{service.description}</p>
                    
                    {/* Bullets */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-2/10 text-accent-2 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-foreground-secondary text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Result */}
                    <div className="bg-accent-2-muted rounded-xl p-5 border border-accent-2/20">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground text-sm">Result: </span>
                          <span className="text-foreground-secondary text-sm">{service.result}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* How We Work */}
      <Section size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              How We Work
            </h2>
            <p className="text-foreground-secondary text-lg">
              Clear process. No confusion.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden md:block" />
            
            <div className="space-y-6">
              {howWeWork.map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 0.1}>
                  <div className="flex items-start gap-6 relative">
                    <div className="relative z-10 w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-semibold text-foreground mb-1">{item.step}</p>
                      <p className="text-foreground-secondary text-sm">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section variant="secondary" size="lg">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Pricing
            </h2>
            <p className="text-foreground-secondary text-lg max-w-xl mx-auto">
              Each system is custom-built, so pricing depends on scope and requirements.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={0.1}>
            <p className="text-center text-foreground-secondary mb-8">Projects typically start from:</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {pricing.map((item, index) => (
              <ScrollReveal key={item.type} delay={0.1 + index * 0.05}>
                <div className="bg-card rounded-xl p-6 border border-border hover:border-foreground-muted transition-colors">
                  <p className="font-semibold text-foreground mb-1">{item.type}</p>
                  <p className="text-accent font-medium">{item.price}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal delay={0.3}>
            <p className="text-center text-foreground-muted text-sm">
              Final pricing is shared after understanding your needs.
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="dark" size="lg">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground-on-dark tracking-tight mb-6">
              Request a System
            </h2>
            <p className="text-foreground-on-dark-secondary text-lg mb-10 max-w-xl mx-auto">
              If you need a custom web system for your business or platform, tell us about it.
            </p>
            <Link href="/request">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 group">
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

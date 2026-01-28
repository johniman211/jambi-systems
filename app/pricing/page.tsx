import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { PricingIllustration } from '@/components/illustrations/PricingIllustration'
import { 
  ArrowRight, 
  Check, 
  Layers, 
  CreditCard, 
  BarChart3, 
  Settings,
  Shield,
  Wrench,
  HelpCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for custom web systems. See what most projects cost and understand our payment terms.',
}

const pricingSystems = [
  {
    icon: Layers,
    name: 'Creator Subscription Systems',
    startingPrice: '$500',
    bestFor: 'Best for creators, media platforms, and educators who want to monetize content.',
    includes: [
      'Creator profile and content management',
      'Free and premium content',
      'Subscription and one-time payments',
      'Mobile money and bank payment integration',
      'User login and access control',
      'Admin dashboard',
    ],
    dependsOn: [
      'Number of content types',
      'Payment logic',
      'Custom workflows',
    ],
  },
  {
    icon: CreditCard,
    name: 'Payment & Access Control Systems',
    startingPrice: '$1,000',
    bestFor: 'Best for digital businesses and software sellers who need to verify payments and control access.',
    includes: [
      'Secure user accounts',
      'Mobile money and bank payment tracking',
      'Automatic access control',
      'Admin dashboard and reports',
    ],
    dependsOn: [
      'Payment complexity',
      'User roles',
      'Automation rules',
    ],
  },
  {
    icon: BarChart3,
    name: 'Debt & Customer Tracking Systems',
    startingPrice: '$800',
    bestFor: 'Best for shops, landlords, schools, and service businesses.',
    includes: [
      'Customer management',
      'Partial payment tracking',
      'Outstanding balance calculation',
      'Cash, mobile money, and bank payment records',
      'Reports and history',
    ],
    dependsOn: [
      'Number of users',
      'Reporting requirements',
      'Custom business rules',
    ],
  },
  {
    icon: Settings,
    name: 'Internal Management Systems',
    startingPrice: '$1,500',
    bestFor: 'Best for companies, NGOs, and institutions with internal workflows.',
    includes: [
      'Staff accounts and roles',
      'Permission-based access',
      'Internal workflows',
      'Dashboards and reports',
      'Optional payment modules',
    ],
    dependsOn: [
      'Workflow complexity',
      'Integrations',
      'Security requirements',
    ],
  },
]

const paymentTerms = [
  '50% upfront before development starts',
  '50% on delivery before launch',
  'No work begins without the upfront payment',
]

const supportFeatures = [
  'Bug fixes and updates',
  'Small feature improvements',
  'System monitoring',
]

export default function PricingPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Jambi Systems',
            description: 'Custom web systems for creators and businesses in South Sudan',
            priceRange: '$500 - $1,500+',
            areaServed: {
              '@type': 'Country',
              name: 'South Sudan',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Custom Web Systems',
              itemListElement: pricingSystems.map((system) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: system.name,
                },
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: system.startingPrice.replace('$', ''),
                  priceCurrency: 'USD',
                  description: `Starting from ${system.startingPrice}`,
                },
              })),
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                  Pricing
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={0.1}>
                <p className="text-xl md:text-2xl text-foreground-secondary mb-6">
                  Transparent pricing for custom web systems
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <p className="text-foreground-secondary text-lg max-w-xl mx-auto lg:mx-0">
                  Jambi Systems builds custom web systems, not templates. Pricing depends on scope, features, and timeline, but the ranges below show what most projects cost.
                </p>
              </ScrollReveal>
            </div>

            {/* Right - Illustration */}
            <ScrollReveal delay={0.2}>
              <div className="mt-8 lg:mt-0">
                <PricingIllustration />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <Section size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              System Pricing
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pricingSystems.map((system, index) => (
            <ScrollReveal key={system.name} delay={index * 0.1}>
              <div className="group bg-card rounded-2xl border border-border hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full">
                {/* Header */}
                <div className="p-8 border-b border-border bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <system.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {system.name}
                      </h3>
                      <p className="text-sm text-foreground-secondary">
                        {system.bestFor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-foreground-secondary">Starting from</span>
                    <span className="text-3xl font-bold text-accent">{system.startingPrice}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Typically includes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                      Typically includes
                    </h4>
                    <ul className="space-y-3">
                      {system.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-foreground-secondary text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Final cost depends on */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
                      Final cost depends on
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {system.dependsOn.map((item) => (
                        <span 
                          key={item} 
                          className="px-3 py-1 bg-background-secondary text-foreground-secondary text-xs rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Payment Terms Section */}
      <Section className="bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Payment Terms */}
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Payment Terms
                  </h2>
                </div>
              </div>
              <ul className="space-y-4">
                {paymentTerms.map((term) => (
                  <li key={term} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-foreground">{term}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Ongoing Support */}
            <ScrollReveal delay={0.1}>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Ongoing Support
                  </h2>
                  <p className="text-foreground-secondary text-sm">Optional</p>
                </div>
              </div>
              <p className="text-foreground-secondary mb-4">
                After launch, we offer optional support and maintenance.
              </p>
              <ul className="space-y-3 mb-4">
                {supportFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground-muted text-sm">
                Support pricing is discussed after project delivery.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-on-dark mb-4">
              Not sure what you need?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              If you're unsure which system fits your business, we'll help you decide.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link href="/request">
              <Button variant="secondary" size="lg" className="group">
                Request a System
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </Section>
    </>
  )
}

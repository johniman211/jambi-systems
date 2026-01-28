import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { HomeHeroIllustration } from '@/components/illustrations/HeroIllustration'
import { 
  Zap, 
  Shield, 
  Users, 
  CreditCard, 
  Calendar,
  HeadphonesIcon,
  ArrowRight,
  Check,
  Layers,
  Lock,
  BarChart3,
  Settings
} from 'lucide-react'

const solutions = [
  {
    icon: Layers,
    title: 'Creator Subscription Systems',
    description: 'Monetize content with recurring payments',
    slug: 'creator-subscription-system',
  },
  {
    icon: CreditCard,
    title: 'Payment & Access Control Systems',
    description: 'Accept mobile money and bank payments',
    slug: 'payment-access-system',
  },
  {
    icon: BarChart3,
    title: 'Debt & Customer Tracking Systems',
    description: 'Track what customers owe and manage accounts',
    slug: 'debt-tracking-system',
  },
  {
    icon: Settings,
    title: 'Internal Management Systems',
    description: 'Streamline your business operations',
    slug: 'internal-management-system',
  },
  {
    icon: BarChart3,
    title: 'Custom Business Dashboards',
    description: 'All your business metrics in one view',
    slug: 'custom-business-dashboard',
  },
]

const reasons = [
  { icon: Users, text: 'Built for local businesses' },
  { icon: CreditCard, text: 'Mobile money & bank payment ready' },
  { icon: Shield, text: 'Secure and scalable' },
  { icon: Calendar, text: 'Clear pricing and timelines' },
  { icon: HeadphonesIcon, text: 'Long-term support' },
]

const steps = [
  { step: '01', title: 'Tell us your problem', description: 'Share what you need to solve' },
  { step: '02', title: 'We design the right system', description: 'Custom solution, not templates' },
  { step: '03', title: 'You pay, we build, you launch', description: 'Clear timeline, no surprises' },
]

export default function HomePage() {
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
            description: 'Jambi Systems builds custom web systems that help creators and businesses manage mobile money and bank payments, customers, subscriptions, and internal operations.',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jambisystems.com',
            areaServed: {
              '@type': 'Country',
              name: 'South Sudan',
            },
            serviceType: ['Web Development', 'Custom Software Development', 'Payment Systems'],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute inset-0 gradient-mesh" />
        
        <div className="container-wide relative">
          <div className="py-20 md:py-28 lg:py-36">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Content */}
              <div className="text-center lg:text-left">
                <ScrollReveal>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted text-accent text-sm font-medium mb-6">
                    <Zap className="w-4 h-4" />
                    <span>Systems that help businesses get paid and stay in control</span>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={0.1}>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6 text-balance">
                    Custom Web Systems for <span className="text-accent">Creators</span> & <span className="text-accent">Businesses</span> in South Sudan
                  </h1>
                </ScrollReveal>
                
                <ScrollReveal delay={0.2}>
                  <p className="text-lg md:text-xl text-foreground-secondary mb-8 max-w-xl mx-auto lg:mx-0">
                    Jambi Systems builds secure web systems for payments, customers, subscriptions, and internal operations — designed for real businesses.
                  </p>
                </ScrollReveal>
                
                <ScrollReveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                    <Link href="/request">
                      <Button size="lg" className="group">
                        Request a System
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/services">
                      <Button variant="outline" size="lg">
                        View Services
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
              
              {/* Right - Illustration */}
              <ScrollReveal delay={0.2}>
                <div className="mt-8 lg:mt-0">
                  <HomeHeroIllustration />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solutions */}
      <Section variant="secondary" size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Our Solutions
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Built to fit your business.
            </p>
          </div>
        </ScrollReveal>
        
        <div id="systems" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <ScrollReveal key={solution.title} delay={index * 0.1}>
              <Link href={`/work/${solution.slug}`} className="block h-full">
                <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <solution.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-foreground-secondary mb-4">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    <span>View system</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Why Jambi Systems - Dark Section */}
      <Section variant="dark" size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground-on-dark tracking-tight mb-4">
              Why Jambi Systems
            </h2>
            <p className="text-foreground-on-dark-secondary text-lg max-w-2xl mx-auto">
              We understand the unique challenges of building for South Sudanese businesses.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <ScrollReveal key={reason.text} delay={index * 0.1}>
              <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                  <reason.icon className="w-5 h-5" />
                </div>
                <span className="text-foreground-on-dark font-medium">{reason.text}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section size="lg">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-foreground-secondary text-lg">
              No templates. No guesswork.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connection line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-0.5 bg-border" />
            
            {steps.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.15}>
                <div className="relative text-center">
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-glow">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground-secondary">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <Lock className="w-12 h-12 text-accent mx-auto mb-6" />
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

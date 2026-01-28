import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { projects } from '@/lib/projects'
import { ArrowRight, Layers, CreditCard, BarChart3, Settings, PieChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Explore the custom web systems we build for creators and businesses in South Sudan.',
}

const categoryIcons: Record<string, React.ElementType> = {
  Subscriptions: Layers,
  Payments: CreditCard,
  Tracking: BarChart3,
  Operations: Settings,
  Analytics: PieChart,
}

export default function WorkPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                Systems We've Built
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-xl text-foreground-secondary mb-8">
                Real solutions for real businesses. Explore the types of custom web systems we design and build.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => {
            const IconComponent = categoryIcons[project.category] || Layers
            return (
              <ScrollReveal key={project.slug} delay={index * 0.1}>
                <Link href={`/work/${project.slug}`} className="block h-full">
                  <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-accent mb-2">{project.category}</div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {project.name}
                        </h3>
                        <p className="text-foreground-secondary text-sm">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-accent text-sm font-medium mt-6 group-hover:gap-2 transition-all">
                      <span>View system</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-on-dark mb-4">
              Need a Custom System?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and we'll help you design the right solution for your business.
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

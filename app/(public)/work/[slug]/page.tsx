import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projects'
import { WorkIllustration } from '@/components/illustrations/WorkIllustration'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  
  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.name,
    description: project.tagline,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          {/* Back Link */}
          <ScrollReveal>
            <Link 
              href="/#systems" 
              className="inline-flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to all systems</span>
            </Link>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted text-accent text-sm font-medium mb-6">
                  <span>{project.category}</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
                  {project.name}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl md:text-2xl text-foreground-secondary mb-8">
                  {project.tagline}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <Link href="/request">
                  <Button size="lg" className="group">
                    Request a Similar System
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </ScrollReveal>
            </div>

            {/* Right - Illustration */}
            <ScrollReveal delay={0.2}>
              <div className="mt-8 lg:mt-0">
                <WorkIllustration category={project.category} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <Section>
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Overview
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              {project.description}
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="bg-background-secondary">
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Key Features
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <ScrollReveal key={feature} delay={0.1 + index * 0.05}>
                <div className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Use Case Section */}
      <Section>
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {project.useCase.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-foreground-secondary mb-8">
              {project.useCase.description}
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap gap-3">
            {project.useCase.audiences.map((audience, index) => (
              <ScrollReveal key={audience} delay={0.15 + index * 0.05}>
                <span className="px-4 py-2 bg-accent-muted text-accent rounded-full text-sm font-medium">
                  {audience}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-foreground text-background">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Similar System?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and we'll help you design the right system for your business.
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

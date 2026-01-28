import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui'
import { RequestForm } from './request-form'
import { RequestHeroIllustration } from '@/components/illustrations/HeroIllustration'
import { Shield, Clock, MessageSquare, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request a System',
  description: 'Request a custom web system from Jambi Systems. Tell us about your project and we will review your request.',
  openGraph: {
    title: 'Request a System | Jambi Systems',
    description: 'Request a custom web system from Jambi Systems.',
  },
}

const reassurances = [
  { icon: Shield, text: 'Your information is secure and private' },
  { icon: Clock, text: 'We respond within 24-48 hours' },
  { icon: MessageSquare, text: 'No commitment required' },
]

const whatHappensNext = [
  'We review your request carefully',
  'If it\'s a good fit, we\'ll reach out to discuss',
  'We\'ll propose a solution, timeline, and pricing',
  'You decide if you want to proceed',
]

export default function RequestPage() {
  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 gradient-subtle" />
      
      <div className="container-wide relative py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                Request a System
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-lg text-foreground-secondary mb-8">
                Tell us about your project and we'll help you design the right system.
              </p>
            </ScrollReveal>
            
            {/* Illustration */}
            <ScrollReveal delay={0.15}>
              <div className="mb-8 flex justify-center lg:justify-start">
                <RequestHeroIllustration />
              </div>
            </ScrollReveal>
            
            {/* Reassurances */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-4 mb-10">
                {reassurances.map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-foreground-secondary">{item.text}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            
            {/* What Happens Next */}
            <ScrollReveal delay={0.3}>
              <div className="bg-background-secondary rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
                <ul className="space-y-3">
                  {whatHappensNext.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-2/10 text-accent-2 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground-secondary text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Right Column - Form */}
          <div>
            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 lg:p-10 shadow-card">
                <RequestForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

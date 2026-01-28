import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  container?: 'wide' | 'narrow' | 'none'
}

export function Section({
  children,
  className,
  variant = 'default',
  size = 'md',
  container = 'wide',
}: SectionProps) {
  const variants = {
    default: 'bg-background text-foreground',
    secondary: 'bg-background-secondary text-foreground',
    dark: 'bg-background-dark text-foreground-on-dark gradient-dark',
  }

  const sizes = {
    sm: 'section-padding-sm',
    md: 'section-padding',
    lg: 'py-24 md:py-32 lg:py-40',
  }

  const containers = {
    wide: 'container-wide',
    narrow: 'container-narrow',
    none: '',
  }

  return (
    <section className={cn(variants[variant], sizes[size], className)}>
      <div className={containers[container]}>{children}</div>
    </section>
  )
}

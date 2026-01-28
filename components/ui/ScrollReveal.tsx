'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once])

  const getInitialPosition = () => {
    if (prefersReducedMotion) return { opacity: 0 }
    
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 30 }
      case 'down':
        return { opacity: 0, y: -30 }
      case 'left':
        return { opacity: 0, x: 30 }
      case 'right':
        return { opacity: 0, x: -30 }
      case 'none':
        return { opacity: 0 }
      default:
        return { opacity: 0, y: 30 }
    }
  }

  const getFinalPosition = () => {
    return { opacity: 1, x: 0, y: 0 }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isVisible ? getFinalPosition() : getInitialPosition()}
      transition={{
        duration: prefersReducedMotion ? 0.01 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

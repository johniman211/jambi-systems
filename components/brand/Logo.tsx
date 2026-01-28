'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
}

export function Logo({ className, iconOnly = false, size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  const colors = {
    default: {
      primary: 'text-foreground',
      accent: 'text-accent',
      node: '#3b82f6',
      line: '#94a3b8',
    },
    light: {
      primary: 'text-foreground-on-dark',
      accent: 'text-accent',
      node: '#60a5fa',
      line: '#cbd5e1',
    },
  }

  const { primary, accent, node, line } = colors[variant]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* System/Flow Icon - Geometric nodes with connecting lines */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Connection lines */}
        <path
          d="M8 8L16 16M16 16L24 8M16 16L16 24"
          stroke={line}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Top left node */}
        <rect
          x="4"
          y="4"
          width="8"
          height="8"
          rx="2"
          fill={node}
          className="opacity-90"
        />
        
        {/* Top right node */}
        <rect
          x="20"
          y="4"
          width="8"
          height="8"
          rx="2"
          fill={node}
          className="opacity-70"
        />
        
        {/* Center node */}
        <rect
          x="12"
          y="12"
          width="8"
          height="8"
          rx="2"
          fill={node}
        />
        
        {/* Bottom node */}
        <rect
          x="12"
          y="22"
          width="8"
          height="8"
          rx="2"
          fill={node}
          className="opacity-80"
        />
      </svg>

      {!iconOnly && (
        <span className={cn('font-semibold tracking-tight', textSize, primary)}>
          Jambi<span className={accent}>Systems</span>
        </span>
      )}
    </div>
  )
}

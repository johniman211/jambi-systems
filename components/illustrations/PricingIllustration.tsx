'use client'

import { motion } from 'framer-motion'

function SharedDefs() {
  return (
    <defs>
      <linearGradient id="pricingLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="pricingNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="pricingCardStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <filter id="pricingCardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.08" />
      </filter>
    </defs>
  )
}

function FloatingCard({ label, x, y, delay }: { label: string; x: number; y: number; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, delay: delay * 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x={x}
          y={y}
          width="120"
          height="70"
          rx="12"
          fill="white"
          stroke="url(#pricingCardStroke)"
          strokeWidth="1"
          filter="url(#pricingCardShadow)"
        />
        <text
          x={x + 60}
          y={y + 40}
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="#64748b"
        >
          {label}
        </text>
      </motion.g>
    </motion.g>
  )
}

function ConnectionLine({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="url(#pricingLineGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
    />
  )
}

function PulsingNode({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.circle
        cx={cx}
        cy={cy}
        r="6"
        fill="url(#pricingNodeGradient)"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r="12"
        fill="url(#pricingNodeGradient)"
        opacity="0.3"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.g>
  )
}

export function PricingIllustration() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 500 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <SharedDefs />

        {/* Connection Lines */}
        <ConnectionLine x1={190} y1={75} x2={250} y2={175} delay={0.3} />
        <ConnectionLine x1={310} y1={75} x2={250} y2={175} delay={0.4} />
        <ConnectionLine x1={190} y1={275} x2={250} y2={175} delay={0.5} />
        <ConnectionLine x1={310} y1={275} x2={250} y2={175} delay={0.6} />

        {/* Central Node */}
        <PulsingNode cx={250} cy={175} delay={0.7} />

        {/* Floating Cards */}
        <FloatingCard label="Scope" x={70} y={40} delay={0.1} />
        <FloatingCard label="Features" x={310} y={40} delay={0.2} />
        <FloatingCard label="Timeline" x={70} y={240} delay={0.3} />
        <FloatingCard label="Your Price" x={310} y={240} delay={0.4} />

        {/* Corner Nodes */}
        <PulsingNode cx={130} cy={75} delay={0.8} />
        <PulsingNode cx={370} cy={75} delay={0.9} />
        <PulsingNode cx={130} cy={275} delay={1.0} />
        <PulsingNode cx={370} cy={275} delay={1.1} />
      </svg>
    </div>
  )
}

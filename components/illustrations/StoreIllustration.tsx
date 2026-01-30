'use client'

import { motion } from 'framer-motion'

function SharedDefs() {
  return (
    <defs>
      <linearGradient id="storeLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="storeNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="storeCardStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <filter id="storeCardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.08" />
      </filter>
    </defs>
  )
}

function FloatingCard({ label, x, y, delay, icon }: { label: string; x: number; y: number; delay: number; icon?: string }) {
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
          width="100"
          height="65"
          rx="10"
          fill="white"
          stroke="url(#storeCardStroke)"
          strokeWidth="1"
          filter="url(#storeCardShadow)"
        />
        {icon && (
          <text
            x={x + 50}
            y={y + 28}
            textAnchor="middle"
            fontSize="18"
          >
            {icon}
          </text>
        )}
        <text
          x={x + 50}
          y={y + 48}
          textAnchor="middle"
          fontSize="10"
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
      stroke="url(#storeLineGradient)"
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
        fill="url(#storeNodeGradient)"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r="12"
        fill="url(#storeNodeGradient)"
        opacity="0.3"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.g>
  )
}

export function StoreHeroIllustration() {
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
        <ConnectionLine x1={150} y1={90} x2={250} y2={175} delay={0.3} />
        <ConnectionLine x1={350} y1={90} x2={250} y2={175} delay={0.4} />
        <ConnectionLine x1={150} y1={260} x2={250} y2={175} delay={0.5} />
        <ConnectionLine x1={350} y1={260} x2={250} y2={175} delay={0.6} />

        {/* Central Node */}
        <PulsingNode cx={250} cy={175} delay={0.7} />

        {/* Floating Cards */}
        <FloatingCard label="Products" x={50} y={55} delay={0.1} icon="📦" />
        <FloatingCard label="Payments" x={350} y={55} delay={0.2} icon="💳" />
        <FloatingCard label="Download" x={50} y={225} delay={0.3} icon="⬇️" />
        <FloatingCard label="Deploy" x={350} y={225} delay={0.4} icon="🚀" />

        {/* Corner Nodes */}
        <PulsingNode cx={100} cy={90} delay={0.8} />
        <PulsingNode cx={400} cy={90} delay={0.9} />
        <PulsingNode cx={100} cy={260} delay={1.0} />
        <PulsingNode cx={400} cy={260} delay={1.1} />
      </svg>
    </div>
  )
}

export function ProductHeroIllustration({ category }: { category?: string }) {
  const getIcon = () => {
    switch (category) {
      case 'subscription': return '🔄'
      case 'payment': return '💰'
      case 'tracking': return '📊'
      case 'management': return '⚙️'
      case 'dashboard': return '📈'
      default: return '💻'
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <SharedDefs />

        {/* Main product card */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect
              x={100}
              y={80}
              width="200"
              height="140"
              rx="16"
              fill="white"
              stroke="url(#storeCardStroke)"
              strokeWidth="1.5"
              filter="url(#storeCardShadow)"
            />
            <text
              x={200}
              y={140}
              textAnchor="middle"
              fontSize="40"
            >
              {getIcon()}
            </text>
            <text
              x={200}
              y={180}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#1e293b"
            >
              System
            </text>
            <text
              x={200}
              y={200}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              Ready to deploy
            </text>
          </motion.g>
        </motion.g>

        {/* Decorative nodes */}
        <PulsingNode cx={80} cy={100} delay={0.3} />
        <PulsingNode cx={320} cy={100} delay={0.4} />
        <PulsingNode cx={80} cy={200} delay={0.5} />
        <PulsingNode cx={320} cy={200} delay={0.6} />

        {/* Connection lines */}
        <ConnectionLine x1={80} y1={100} x2={100} y2={120} delay={0.7} />
        <ConnectionLine x1={320} y1={100} x2={300} y2={120} delay={0.8} />
        <ConnectionLine x1={80} y1={200} x2={100} y2={180} delay={0.9} />
        <ConnectionLine x1={320} y1={200} x2={300} y2={180} delay={1.0} />
      </svg>
    </div>
  )
}

export function CheckoutIllustration() {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg
        viewBox="0 0 300 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <SharedDefs />

        {/* Cart card */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect
              x={75}
              y={60}
              width="150"
              height="130"
              rx="12"
              fill="white"
              stroke="url(#storeCardStroke)"
              strokeWidth="1"
              filter="url(#storeCardShadow)"
            />
            <text x={150} y={105} textAnchor="middle" fontSize="30">🛒</text>
            <text x={150} y={135} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e293b">Checkout</text>
            <rect x={100} y={150} width="100" height="24" rx="6" fill="#6366f1" />
            <text x={150} y={166} textAnchor="middle" fontSize="10" fontWeight="500" fill="white">Pay Now</text>
          </motion.g>
        </motion.g>

        {/* Decorative */}
        <PulsingNode cx={60} cy={80} delay={0.3} />
        <PulsingNode cx={240} cy={80} delay={0.4} />
        <PulsingNode cx={150} cy={220} delay={0.5} />
      </svg>
    </div>
  )
}

export function SuccessIllustration() {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg
        viewBox="0 0 300 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <SharedDefs />

        {/* Success circle */}
        <motion.circle
          cx={150}
          cy={125}
          r={60}
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth="3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Checkmark */}
        <motion.path
          d="M 120 125 L 140 145 L 180 105"
          stroke="#22c55e"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Decorative nodes */}
        <PulsingNode cx={70} cy={80} delay={0.5} />
        <PulsingNode cx={230} cy={80} delay={0.6} />
        <PulsingNode cx={70} cy={170} delay={0.7} />
        <PulsingNode cx={230} cy={170} delay={0.8} />
      </svg>
    </div>
  )
}

export function OrderIllustration() {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg
        viewBox="0 0 300 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <SharedDefs />

        {/* Order document */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect
              x={90}
              y={50}
              width="120"
              height="150"
              rx="8"
              fill="white"
              stroke="url(#storeCardStroke)"
              strokeWidth="1"
              filter="url(#storeCardShadow)"
            />
            <rect x={105} y={70} width="70" height="8" rx="2" fill="#e2e8f0" />
            <rect x={105} y={88} width="90" height="6" rx="2" fill="#e2e8f0" />
            <rect x={105} y={102} width="80" height="6" rx="2" fill="#e2e8f0" />
            <rect x={105} y={116} width="60" height="6" rx="2" fill="#e2e8f0" />
            <rect x={105} y={140} width="90" height="24" rx="6" fill="#6366f1" />
            <text x={150} y={156} textAnchor="middle" fontSize="10" fontWeight="500" fill="white">Download</text>
          </motion.g>
        </motion.g>

        {/* Decorative */}
        <PulsingNode cx={60} cy={100} delay={0.3} />
        <PulsingNode cx={240} cy={100} delay={0.4} />
      </svg>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    info: <AlertCircle className="w-5 h-5 text-info" />,
  }

  const styles = {
    success: 'border-success/20 bg-success/5',
    error: 'border-error/20 bg-error/5',
    info: 'border-info/20 bg-info/5',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border bg-card shadow-lg max-w-md',
        styles[type]
      )}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <p className="text-sm text-foreground flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([])

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}

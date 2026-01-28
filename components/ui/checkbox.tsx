'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const checkboxId = id || props.name

    return (
      <div className="w-full">
        <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              mt-1 h-4 w-4 rounded border-primary-300 text-primary-900
              focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${className}
            `}
            {...props}
          />
          <span className="text-sm text-primary-700">{label}</span>
        </label>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-primary-900 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 border rounded-lg text-primary-900 placeholder-primary-400
            transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-primary-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-primary-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

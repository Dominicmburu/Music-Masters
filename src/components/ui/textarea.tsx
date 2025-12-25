import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-charcoal-700 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/30 focus-visible:border-coral-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
            error && 'border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }

import { forwardRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className = '', ...props }, ref) => {
    const id = useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-medium ${error ? 'text-destructive' : 'text-foreground'
              }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors
              ${icon ? 'pl-9' : ''}
              ${suffix ? 'pr-10' : ''}
              ${error
                ? 'border-destructive focus-visible:ring-1 focus-visible:ring-destructive'
                : 'border-input focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary'
              }
              file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground
              focus-visible:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {suffix}
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

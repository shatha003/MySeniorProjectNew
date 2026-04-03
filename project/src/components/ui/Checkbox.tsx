import { forwardRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    const id = useId()

    return (
      <label
        htmlFor={id}
        className={`flex items-start gap-3 cursor-pointer group ${className}`}
      >
        <div className="relative mt-0.5 flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-4 h-4 rounded-sm border transition-all duration-200 flex items-center justify-center
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background
              group-hover:border-primary/50
              ${props.checked
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-input'
              }
            `}
          >
            <AnimatePresence>
              {props.checked && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

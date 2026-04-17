import { forwardRef, useState, useId } from 'react'
import { useTranslation } from 'react-i18next'
import Input from './Input'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
  error?: string
  showRequirements?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showRequirements = false, className = '', ...props }, ref) => {
    const id = useId()
    const [showPassword, setShowPassword] = useState(false)
    const { t } = useTranslation('components')

    return (
      <Input
        ref={ref}
        id={id}
        type={showPassword ? 'text' : 'password'}
        label={label}
        error={error}
        className={className}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-0.5"
            aria-label={showPassword ? t('components:passwordInput.hidePassword') : t('components:passwordInput.showPassword')}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput

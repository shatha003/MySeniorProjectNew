import { forwardRef } from 'react'

interface ButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'cyber'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    className = '', 
    disabled,
    type = 'button',
    onClick
  }) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.98]
      hover:scale-[1.02]
    `

    const variants = {
      primary: `
        bg-primary text-primary-foreground
        hover:bg-primary/90 active:bg-primary/80
        shadow-lg shadow-primary/25
      `,
      secondary: `
        bg-secondary text-secondary-foreground
        hover:bg-secondary/80 active:bg-secondary/70
      `,
      outline: `
        border-2 border-primary/30 text-primary
        hover:bg-primary/10 hover:border-primary/50
        active:bg-primary/20
      `,
      ghost: `
        text-muted-foreground
        hover:bg-secondary hover:text-foreground
      `,
      destructive: `
        bg-destructive text-destructive-foreground
        hover:bg-destructive/90
      `,
      cyber: `
        cyber-btn-glow text-white font-semibold tracking-wide
        hover:brightness-110
      `
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-11 px-5 text-sm',
      lg: 'h-12 px-8 text-base'
    }

    return (
      <button
        type={type}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading ? (
          <svg 
            className="h-4 w-4 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

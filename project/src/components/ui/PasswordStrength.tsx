import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PasswordStrengthProps {
  password: string
  showDetails?: boolean
}

const requirements = [
  { key: 'length', label: 'components:passwordStrength.minLength', test: (p: string) => p.length >= 12 },
  { key: 'uppercase', label: 'components:passwordStrength.uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'components:passwordStrength.lowercase', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'components:passwordStrength.number', test: (p: string) => /\d/.test(p) },
  { key: 'symbol', label: 'components:passwordStrength.special', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{}|;:',.<>?]/.test(p) },
]

const PasswordStrength = ({ password, showDetails = false }: PasswordStrengthProps) => {
  const { t } = useTranslation('components')
  const results = requirements.map(req => ({
    ...req,
    met: req.test(password)
  }))

  const metCount = results.filter(r => r.met).length
  const progress = (metCount / requirements.length) * 100

  const getStrengthColor = () => {
    if (progress <= 20) return 'bg-destructive'
    if (progress <= 40) return 'bg-orange-500'
    if (progress <= 60) return 'bg-yellow-500'
    if (progress <= 80) return 'bg-green-400'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    if (progress <= 20) return t('components:passwordStrength.weak')
    if (progress <= 40) return t('components:passwordStrength.fair')
    if (progress <= 60) return t('components:passwordStrength.good')
    if (progress <= 80) return t('components:passwordStrength.strong')
    return t('components:passwordStrength.veryStrong')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span 
          className="text-xs font-medium"
          style={{ 
            color: progress <= 20 ? 'hsl(0 84.2% 60.2%)' 
              : progress <= 40 ? 'hsl(24.6 95% 53.3%)'
              : progress <= 60 ? 'hsl(48 96% 53%)'
              : progress <= 80 ? 'hsl(142 71% 45%)'
              : 'hsl(142 71% 45%)'
          }}
        >
          {password ? getStrengthLabel() : ''}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-2 space-y-1"
        >
          {results.map((req, index) => (
            <motion.div
              key={req.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 500 }}
                className={`
                  w-4 h-4 rounded-full flex items-center justify-center
                  ${req.met 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {req.met && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </motion.div>
              <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                {t(req.label)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PasswordStrength

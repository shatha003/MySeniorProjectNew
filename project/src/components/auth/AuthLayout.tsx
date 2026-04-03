import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Left Pane - Themed Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden border-r border-border/50">
        {/* Light mode background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/Background.png')` }}
          initial={false}
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Dark mode background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/Background_dark_mode..png')` }}
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Subtle overlay for better text readability */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.35)'
              : 'rgba(255, 255, 255, 0.45)'
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 p-12">
          <img src="/icon.png" alt="HyperTool" className="w-10 h-10 object-contain" />
          <span className={`font-display text-xl font-bold tracking-tight drop-shadow-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>HyperTool</span>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 max-w-sm p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className={`text-3xl font-display font-semibold leading-tight mb-4 ${isDark ? 'text-white drop-shadow-lg' : 'text-gray-900'}`}>
              Your comprehensive security companion
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80 drop-shadow-md' : 'text-gray-700'}`}>
              Manage permissions, monitor activity, and enforce policies across your digital ecosystem from a single, unified interface.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="flex-1 flex flex-col pt-8 md:pt-0">
        <div className="flex-1 overflow-y-auto w-full flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-[400px]">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <img src="/icon.png" alt="HyperTool" className="w-10 h-10 object-contain" />
              <span className="font-display text-xl font-bold tracking-tight">HyperTool</span>
            </div>

            {children}
          </div>
        </div>

        <div className="p-6 text-center text-xs text-muted-foreground border-t border-border/40 bg-card/50">
          Secured with AES-256 encryption
        </div>
      </div>
    </div>
  )
}


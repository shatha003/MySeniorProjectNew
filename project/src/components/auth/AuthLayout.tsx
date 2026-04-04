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
    <div className="h-full flex overflow-hidden relative">
      {/* Scanline */}
      <div className="cyber-scanline" />

      {/* ===== LEFT PANEL: Form ===== */}
      <div className="auth-form-panel w-full lg:w-[45%] xl:w-[42%] flex flex-col relative z-10">
        <div className="auth-noise" />

        {/* Top bar: Logo - centered, bigger, no border */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2 py-4 relative z-10"
        >
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {/* Glow behind the icon */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(255,10,84,0.25) 0%, rgba(255,10,84,0.08) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(77,0,255,0.15) 0%, rgba(77,0,255,0.05) 50%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            {/* Secondary glow ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              style={{
                border: isDark
                  ? '1px solid rgba(255,10,84,0.15)'
                  : '1px solid rgba(77,0,255,0.1)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            />
            <img src="/icon.png" alt="CHEA" className="w-58 h-58 sm:w-[225px] sm:h-[225px] object-contain relative z-10" />
          </motion.div>
          <span
            className={`font-cyber text-lg font-bold tracking-[0.25em] uppercase ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            CHEA
          </span>
        </motion.div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-8 relative z-10 overflow-y-auto">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Bottom bar: encryption badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`px-6 sm:px-8 py-4 flex items-center gap-2 text-[0.65rem] relative z-10 ${
            isDark ? 'text-neon-blue/40' : 'text-gray-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="font-body tracking-wide">Secured with AES-256 encryption</span>
        </motion.div>
      </div>

      {/* ===== RIGHT PANEL: Background Image ===== */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] auth-image-panel relative">
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src="/Background.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src="/Background_dark_mode..png"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlay for depth */}
        {isDark ? (
          <div className="auth-image-overlay" />
        ) : (
          <div className="auth-image-overlay-light" />
        )}

        {/* Electric pulse line that sweeps across */}
        {isDark ? (
          <div className="auth-electric-pulse" />
        ) : (
          <div className="auth-electric-pulse-light" />
        )}

        {/* Soft edge glow at the junction */}
        {isDark ? (
          <div className="auth-edge-glow" />
        ) : (
          <div className="auth-edge-glow-light" />
        )}

        {/* Circuit grid overlay */}
        {isDark ? (
          <div className="auth-circuit-grid" />
        ) : (
          <div className="auth-circuit-grid-light" />
        )}

        {/* Electric flicker overlay */}
        {isDark ? (
          <div className="auth-electric-flicker" />
        ) : (
          <div className="auth-electric-flicker-light" />
        )}

        {/* Digital noise texture */}
        <div className="auth-image-noise" />

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {isDark ? (
            <div className="auth-status-badge">
              <div className="auth-status-dot" />
              System Active
            </div>
          ) : (
            <div className="auth-status-badge-light">
              <div className="auth-status-dot-light" />
              System Active
            </div>
          )}
        </motion.div>

        {/* Floating neon orb accents */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            filter: 'blur(80px)',
            top: '15%',
            right: '15%',
            background: isDark
              ? 'radial-gradient(circle, rgba(255,10,84,0.15), transparent 70%)'
              : 'radial-gradient(circle, rgba(77,0,255,0.08), transparent 70%)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            filter: 'blur(60px)',
            bottom: '20%',
            left: '10%',
            background: isDark
              ? 'radial-gradient(circle, rgba(77,0,255,0.12), transparent 70%)'
              : 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)',
          }}
          animate={{
            y: [0, 12, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>
    </div>
  )
}


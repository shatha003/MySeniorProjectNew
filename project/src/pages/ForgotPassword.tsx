import { useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 26 },
  },
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with that email 🤷')
      } else if (err.code === 'auth/invalid-email') {
        setError('Hmm, that does not look like a valid email 🤔')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Whoa, too many tries! Take a break and try again later ⏳')
      } else {
        setError('Oops! Something went wrong. Try again! 😅')
      }
    } finally {
      setLoading(false)
    }
  }

  const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500'
  const linkColor = isDark
    ? 'text-neon-crimson/80 hover:text-neon-crimson transition-colors'
    : 'text-neon-violet/80 hover:text-neon-violet transition-colors'
  const dividerColor = isDark ? 'bg-white/8' : 'bg-gray-200'
  const dividerTextColor = isDark ? 'text-white/20' : 'text-gray-300'

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-6"
          >
            {/* Success state */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  isDark
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-emerald-500/20 bg-emerald-50'
                }`}>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? '#22c55e' : '#16a34a'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </motion.svg>
                </div>
                <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <span className={`text-[0.6rem] font-cyber tracking-[0.25em] uppercase ${mutedText}`}>
                  Confirmation
                </span>
              </div>
              <h2 className={`font-cyber text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Check your inbox
              </h2>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                A password reset link has been sent to{' '}
                <span className={`font-medium ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{email}</span>.
                Follow the instructions to regain access.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 text-xs font-medium ${linkColor}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to login
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  isDark
                    ? 'border-neon-crimson/20 bg-neon-crimson/5'
                    : 'border-neon-violet/20 bg-neon-violet/5'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? '#FF0A54' : '#4D00FF'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <span className={`text-[0.6rem] font-cyber tracking-[0.25em] uppercase ${mutedText}`}>
                  Recovery
                </span>
              </div>
              <h2 className={`font-cyber text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reset password
              </h2>
              <p className={`text-sm ${mutedText}`}>
                Enter your email to receive a reset link
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  label={
                    <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Email
                    </span>
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cyber-input-glow"
                  placeholder="you@example.com"
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                    isDark
                      ? 'bg-red-500/5 border-red-500/20 text-red-400/90'
                      : 'bg-red-50 border-red-200/60 text-red-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  variant="cyber"
                  className="w-full font-cyber text-xs tracking-[0.15em] uppercase h-11 rounded-lg"
                  size="lg"
                  loading={loading}
                >
                  Send Reset Link
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className={`flex-1 h-px ${dividerColor}`} />
              <span className={`text-[0.6rem] uppercase tracking-[0.2em] ${dividerTextColor}`}>
                or
              </span>
              <div className={`flex-1 h-px ${dividerColor}`} />
            </motion.div>

            {/* Sign in link */}
            <motion.p
              variants={itemVariants}
              className={`text-center text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}
            >
              Remember your password?{' '}
              <Link
                to="/login"
                className={`font-semibold ${linkColor}`}
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

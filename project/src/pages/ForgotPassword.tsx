import { useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react'

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

  const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900'
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
            className="space-y-8"
          >
            {/* Success state */}
            <div className="space-y-4">
              <motion.div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto ${
                  isDark
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20'
                    : 'bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200'
                }`}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
              >
                <CheckCircle size={40} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              </motion.div>
              <h2 className={`font-display text-3xl font-black tracking-tight text-center ${headingColor}`}>
                Check Your Inbox! 📬
              </h2>
              <p className={`text-base font-medium text-center leading-relaxed ${mutedText}`}>
                We sent a password reset link to{' '}
                <span className={`font-bold ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{email}</span>.
                Follow the instructions to get back in!
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
                className={`inline-flex items-center gap-2 text-sm font-bold ${linkColor}`}
              >
                <ArrowLeft size={16} />
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
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              
              <h2 className={`font-display text-3xl font-black tracking-tight ${headingColor}`}>
                Forgot Password? 🔑
              </h2>
              <p className={`text-base font-medium ${mutedText}`}>
                No worries! Enter your email and we'll help you get back in.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  label={
                    <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      <Mail size={16} />
                      Email
                    </span>
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
                  placeholder="you@example.com"
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 border-2 ${
                    isDark
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  <span className="text-xl">🤔</span>
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 py-5 font-display text-lg font-black rounded-2xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-[1.03]'
                      : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-[1.03]'
                  }`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link! 
                      <Sparkles size={20} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className={`flex-1 h-px ${dividerColor}`} />
              <span className={`text-xs font-black uppercase tracking-wider ${dividerTextColor}`}>
                or
              </span>
              <div className={`flex-1 h-px ${dividerColor}`} />
            </motion.div>

            {/* Sign in link */}
            <motion.p
              variants={itemVariants}
              className={`text-center text-sm font-medium ${isDark ? 'text-white/40' : 'text-gray-400'}`}
            >
              Remember your password?{' '}
              <Link
                to="/login"
                className={`font-black ${linkColor}`}
              >
                Sign in! 👋
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

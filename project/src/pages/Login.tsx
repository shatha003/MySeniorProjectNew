import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, setAuthPersistence } from '../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await setAuthPersistence(rememberMe)
      localStorage.setItem('chea-remember-me', rememberMe ? 'true' : 'false')
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError('Hmm, that does not look right. Try again! 🤔')
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-7"
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`text-[0.6rem] font-cyber tracking-[0.25em] uppercase ${mutedText}`}>
              Authentication
            </span>
          </div>
          <h2 className={`font-cyber text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back! 👋
          </h2>
          <p className={`text-sm ${mutedText}`}>
            Sign in to your account and let's go!
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

          <motion.div variants={itemVariants}>
            <PasswordInput
              label={
                <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Password
                </span>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="cyber-input-glow"
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
            <Checkbox
              label={
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Remember me
                </span>
              }
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              to="/forgot-password"
              className={`text-xs font-medium ${linkColor}`}
            >
              Forgot password? 🔑
            </Link>
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
              Let's Go! 🚀
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

        {/* Sign up link */}
        <motion.p
          variants={itemVariants}
          className={`text-center text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className={`font-semibold ${linkColor}`}
          >
            Join us! ✨
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}

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
import { Mail, Lock, KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['auth', 'common'])

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
      setError(t('signInError'))
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-3">
           
          </div>
          <h2 className={`font-display text-3xl font-black tracking-tight ${headingColor}`}>
            {t('welcomeBack')}
          </h2>
          <p className={`text-base font-medium ${mutedText}`}>
            {t('signInSubtitle')}
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
                  {t('email')}
                </span>
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder={t('emailPlaceholder')}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PasswordInput
              label={
                <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  <Lock size={16} />
                  {t('password')}
                </span>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder={t('passwordPlaceholder')}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
            <Checkbox
              label={
                <span className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                   {t('rememberMe')}
                </span>
              }
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              to="/forgot-password"
              className={`text-sm font-bold flex items-center gap-1 ${linkColor}`}
            >
              <KeyRound size={14} />
               {t('forgotPassword')}
            </Link>
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
                   {t('signingIn')}
                </>
              ) : (
                <>
                   {t('letsGo')}
                  
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className={`flex-1 h-px ${dividerColor}`} />
          <span className={`text-xs font-black uppercase tracking-wider ${dividerTextColor}`}>
            {t('common:or')}
          </span>
          <div className={`flex-1 h-px ${dividerColor}`} />
        </motion.div>

        {/* Sign up link */}
        <motion.p
          variants={itemVariants}
          className={`text-center text-sm font-medium ${isDark ? 'text-white/40' : 'text-gray-400'}`}
        >
           {t('noAccount')}{' '}
           <Link
             to="/register"
             className={`font-black ${linkColor}`}
           >
             {t('joinTeam')}
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}

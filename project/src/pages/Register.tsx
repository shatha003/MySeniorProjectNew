import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firestoreSetDoc } from '../lib/firestore-rest'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import PasswordStrength from '@/components/ui/PasswordStrength'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
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

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Oops! We need your email 📧'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Hmm, that email does not look quite right 🤔'
    }

    if (!formData.password) {
      newErrors.password = 'Do not forget your password! 🔒'
    } else if (formData.password.length < 12) {
      newErrors.password = 'Make it longer — at least 12 characters! 💪'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Oops! Those passwords do not match 🔄'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the rules first! 📋'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      let userCredential
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
      } catch (err: any) {
        console.error("Error in createUserWithEmailAndPassword:", err)
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('That email is already taken! Try another one 🤷')
        }
        throw err
      }

      try {
        await updateProfile(userCredential.user, {
          displayName: formData.displayName
        })
      } catch (err: any) {
        console.error("Error in updateProfile:", err)
      }

      try {
        await firestoreSetDoc('users', userCredential.user.uid, {
          uid: userCredential.user.uid,
          email: formData.email,
          displayName: formData.displayName,
          createdAt: 'SERVER_TIMESTAMP',
          role: 'user'
        })
      } catch (err: any) {
        alert('FIRESTORE WRITE ERROR: ' + err.message)
        console.error("Error in firestoreSetDoc:", err)
      }

      navigate('/dashboard')
    } catch (err: any) {
      console.error("Final catch block:", err)
      let errorMessage = err.message || 'Oops! Something went wrong. Try again! 😅'
      setErrors({ email: errorMessage, submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword

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
        className="space-y-5"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`text-[0.6rem] font-cyber tracking-[0.25em] uppercase ${mutedText}`}>
              Registration
            </span>
          </div>
          <h2 className={`font-cyber text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Join the Team! 🚀
          </h2>
          <p className={`text-sm ${mutedText}`}>
            Create your account and start your adventure
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <motion.div variants={itemVariants}>
            <Input
              type="email"
              name="email"
              label={
                <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email
                </span>
              }
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="cyber-input-glow"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              type="text"
              name="displayName"
              label={
                <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Display name
                </span>
              }
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              className="cyber-input-glow"
              placeholder="Your display name"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PasswordInput
              name="password"
              label={
                <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Password
                </span>
              }
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              className="cyber-input-glow"
              placeholder="Create a password"
            />
          </motion.div>

          {formData.password && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <PasswordStrength password={formData.password} showDetails />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <PasswordInput
              name="confirmPassword"
              label={
                <span className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Confirm password
                </span>
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              className="cyber-input-glow"
              placeholder="Repeat your password"
            />
            {formData.confirmPassword && !passwordsMatch && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs mt-1.5 flex items-center gap-1 ${
                  isDark ? 'text-red-400/80' : 'text-red-500'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Passwords do not match
              </motion.p>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs mt-1.5 flex items-center gap-1 ${
                  isDark ? 'text-emerald-400/80' : 'text-emerald-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Passwords match
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Checkbox
              label={
                <span className="text-xs">
                  I agree to the{' '}
                  <Link to="/terms" className={linkColor}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className={linkColor}>Privacy Policy</Link>
                </span>
              }
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }))
              }}
            />
            {errors.terms && (
              <p className={`text-xs mt-1 ${isDark ? 'text-red-400/80' : 'text-red-500'}`}>{errors.terms}</p>
            )}
          </motion.div>

          {errors.submit && (
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
              {errors.submit}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-1">
            <Button
              type="submit"
              variant="cyber"
              className="w-full font-cyber text-xs tracking-[0.15em] uppercase h-11 rounded-lg"
              size="lg"
              loading={loading}
              disabled={!agreedToTerms}
            >
              Join Now! ✨
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
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-semibold ${linkColor}`}
          >
            Sign in! 👋
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}

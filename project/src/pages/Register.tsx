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
import { Mail, User, Lock, ShieldCheck, Sparkles } from 'lucide-react'

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
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-3">
           
          </div>
          <h2 className={`font-display text-3xl font-black tracking-tight ${headingColor}`}>
            Join the Team! 🚀
          </h2>
          <p className={`text-base font-medium ${mutedText}`}>
            Create your account and start your adventure!
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              type="email"
              name="email"
              label={
                <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  <Mail size={16} />
                  Email
                </span>
              }
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              type="text"
              name="displayName"
              label={
                <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  <User size={16} />
                  Your Name
                </span>
              }
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder="What should we call you?"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PasswordInput
              name="password"
              label={
                <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  <Lock size={16} />
                  Password
                </span>
              }
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder="Create a super secret password"
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
                <span className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  <ShieldCheck size={16} />
                  Confirm Password
                </span>
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              className="rounded-xl py-4 text-base font-medium placeholder:font-medium"
              placeholder="Type it one more time"
            />
            {formData.confirmPassword && !passwordsMatch && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm mt-2 flex items-center gap-2 font-bold ${
                  isDark ? 'text-red-400/80' : 'text-red-500'
                }`}
              >
                <span>🔄</span>
                Passwords do not match
              </motion.p>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm mt-2 flex items-center gap-2 font-bold ${
                  isDark ? 'text-emerald-400/80' : 'text-emerald-600'
                }`}
              >
                <span>✅</span>
                Passwords match!
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Checkbox
              label={
                <span className="text-sm font-medium">
                  I agree to the{' '}
                  <Link to="/terms" className={`font-bold ${linkColor}`}>Rules</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className={`font-bold ${linkColor}`}>Privacy Stuff</Link>
                </span>
              }
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }))
              }}
            />
            {errors.terms && (
              <p className={`text-sm mt-2 font-bold ${isDark ? 'text-red-400/80' : 'text-red-500'}`}>{errors.terms}</p>
            )}
          </motion.div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 border-2 ${
                isDark
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
            >
              <span className="text-xl">😅</span>
              {errors.submit}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={loading || !agreedToTerms}
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
                  Creating account...
                </>
              ) : (
                <>
                  Join Now! ✨
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
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-black ${linkColor}`}
          >
            Sign in! 👋
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}

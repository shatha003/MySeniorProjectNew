import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firestoreSetDoc } from '../lib/firestore-rest'
import { motion } from 'framer-motion'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import PasswordStrength from '@/components/ui/PasswordStrength'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

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
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 12) {
      newErrors.password = 'Password must be at least 12 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms'
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
          throw new Error('This email is already registered.')
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
      let errorMessage = err.message || 'Failed to create an account.'
      setErrors({ email: errorMessage, submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-display text-xl font-semibold">
            Create your account
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Start your journey to better security
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input
              type="email"
              name="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Input
              type="text"
              name="displayName"
              label="Display name"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PasswordInput
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <PasswordStrength password={formData.password} showDetails />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PasswordInput
              name="confirmPassword"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            {formData.confirmPassword && !passwordsMatch && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive mt-1.5"
              >
                Passwords do not match
              </motion.p>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Passwords match
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Checkbox
              label={
                <span className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              }
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }))
              }}
            />
            {errors.terms && (
              <p className="text-xs text-destructive mt-1">{errors.terms}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {errors.submit && (
              <p className="text-xs text-destructive mt-1">{errors.submit}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={!agreedToTerms}
            >
              Create account
            </Button>
          </motion.div>
        </form>

        {/* Sign in link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  )
}

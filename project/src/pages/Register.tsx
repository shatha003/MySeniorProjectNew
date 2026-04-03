import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { firestoreGetDoc, firestoreSetDoc } from '../lib/firestore-rest'
import { motion } from 'framer-motion'
import { signIn } from '@choochmeque/tauri-plugin-google-auth-api'
import { OAUTH_CONFIG } from '../lib/oauth-config'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import PasswordStrength from '@/components/ui/PasswordStrength'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

// Plain serializable Google user info (from navigate state or from signIn result)
interface GoogleUserInfo {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isCompletingGoogleProfile, setIsCompletingGoogleProfile] = useState(false)
  const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserInfo | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // If the user came from the login page via Google Sign In but didn't have an account
    if (location.state?.googleUser) {
      const gUser = location.state.googleUser as GoogleUserInfo
      setGoogleUserInfo(gUser)
      setIsCompletingGoogleProfile(true)
      setFormData(prev => ({
        ...prev,
        displayName: gUser.displayName || ''
      }))

      // Clear the state so refreshing doesn't keep triggering it
      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!isCompletingGoogleProfile) {
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
      let uid = ''
      let finalEmail = ''

      if (isCompletingGoogleProfile && googleUserInfo) {
        try {
          // Use auth.currentUser for Firebase operations (googleUserInfo is just plain data)
          const currentUser = auth.currentUser
          if (currentUser) {
            await updateProfile(currentUser, {
              displayName: formData.displayName
            })
          }
          uid = googleUserInfo.uid
          finalEmail = googleUserInfo.email || ''
        } catch (err: any) {
          console.error("Error in updateProfile (Google fallback):", err)
          throw new Error("updateProfile_failed")
        }
      } else {
        // Normal email/password flow
        let userCredential;
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
          throw err;
        }

        try {
          await updateProfile(userCredential.user, {
            displayName: formData.displayName
          })
        } catch (err: any) {
          console.error("Error in updateProfile (Email flow):", err)
          // Continue even if profile update fails to save data to Firestore
        }

        uid = userCredential.user.uid
        finalEmail = formData.email
      }

      try {
        // Save user to Firestore via REST API (SDK is blocked in WebView2)
        console.log('[Register] Attempting firestoreSetDoc for uid:', uid)
        await firestoreSetDoc('users', uid, {
          uid: uid,
          email: finalEmail,
          displayName: formData.displayName,
          createdAt: 'SERVER_TIMESTAMP',
          role: 'user'
        })
        console.log('[Register] firestoreSetDoc succeeded!')
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

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)
      setErrors({})

      console.log('[Google Auth] Starting signIn from Register...')
      const response = await signIn(OAUTH_CONFIG);
      const idToken = response.idToken;

      if (!idToken) throw new Error("No idToken returned from Google");
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      console.log('[Google Auth] Firebase signInWithCredential succeeded:', result.user.uid)

      if (result && result.user) {
        // Check Firestore via REST API if user already exists
        let userExists = false
        try {
          const userDoc = await firestoreGetDoc('users', result.user.uid)
          userExists = userDoc !== null
        } catch (firestoreErr: any) {
          console.warn('[Google Auth] Firestore check failed:', firestoreErr.message)
          userExists = false
        }

        if (userExists) {
          navigate('/dashboard')
        } else {
          setGoogleUserInfo({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          })
          setIsCompletingGoogleProfile(true)
          setFormData(prev => ({
            ...prev,
            displayName: result.user.displayName || ''
          }))
        }
      }
    } catch (err: any) {
      console.error(err)
      setErrors({ submit: err.message || 'Failed to initialize Google sign in.' })
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
          {!isCompletingGoogleProfile && (
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
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Input
              type="text"
              name="displayName"
              label={isCompletingGoogleProfile ? "Account name" : "Display name"}
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
            />
          </motion.div>

          {!isCompletingGoogleProfile && (
            <>
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
            </>
          )}

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
              {isCompletingGoogleProfile ? 'Complete Registration' : 'Create account'}
            </Button>
          </motion.div>
        </form>

        {!isCompletingGoogleProfile && (
          <>
            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </motion.div>

            {/* Social Registration */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={loading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                }
              >
                Continue with Google
              </Button>
            </motion.div>
          </>
        )}

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

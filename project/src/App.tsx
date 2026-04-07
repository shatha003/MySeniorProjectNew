import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useAuthStore } from './store/useAuthStore'
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import PlaceholderPage from './pages/PlaceholderPage';

// Dashboard Features
import LinkScanner from './pages/LinkScanner';
import FileScanner from './pages/FileScanner';
import ImagePrivacy from './pages/ImagePrivacy';
import PasswordGenerator from './pages/PasswordGenerator';
import PasswordChecker from './pages/PasswordChecker';
import Encryption from './pages/Encryption';
import CredentialVault from './pages/CredentialVault';
import Settings from './pages/Settings';
import AIAgent from './pages/AIAgent';
import Calculator from './pages/Calculator';
import QuizArena from './pages/QuizArena';
import PhishingDojo from './pages/PhishingDojo';

import TitleBar from './components/ui/TitleBar';

/**
 * Route guard – only allows authenticated users through.
 * Redirects to /login otherwise.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/**
 * Route guard – redirects already-authenticated users to dashboard.
 * Used for login / register / forgot-password pages.
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function App() {
  const { loading, setUser, setLoading } = useAuthStore()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [setUser, setLoading])

  // Show loading state while Firebase resolves auth
  if (loading) {
    return (
      <div className="app-shell">
        <TitleBar />
        <div className="app-content flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading CHEA…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {!isLandingPage && <TitleBar />}
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="link-scanner" element={<LinkScanner />} />
            <Route path="file-scanner" element={<FileScanner />} />
            <Route path="metadata" element={<ImagePrivacy />} />
            <Route path="password-gen" element={<PasswordGenerator />} />
            <Route path="password-check" element={<PasswordChecker />} />
            <Route path="encryption" element={<Encryption />} />
            <Route path="vault" element={<CredentialVault />} />
            <Route path="ai-agent" element={<AIAgent />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="quiz-arena" element={<QuizArena />} />
            <Route path="phishing-dojo" element={<PhishingDojo />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Route>

          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

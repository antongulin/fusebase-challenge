import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import OnboardingPage from './pages/OnboardingPage'
import AdminPage from './pages/AdminPage'
import AdminDetailPage from './pages/AdminDetailPage'
import AuthExpiredModal from './components/AuthExpiredModal'

export default function App() {
  const [authExpired, setAuthExpired] = useState(false)

  useEffect(() => {
    const handler = () => setAuthExpired(true)
    window.addEventListener('auth-expired', handler)
    return () => window.removeEventListener('auth-expired', handler)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:id" element={<AdminDetailPage />} />
      </Routes>
      {authExpired && <AuthExpiredModal />}
    </>
  )
}

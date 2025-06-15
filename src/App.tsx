import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Layout } from './components/layout/Layout'

// Pages - these will be created by each team member
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { DashboardPage } from './pages/DashboardPage'
import { CreateTripPage } from './pages/CreateTripPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { TestPage } from './pages/TestPage'
import { DiagnosticsPage } from './pages/DiagnosticsPage'

function App() {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <SignInPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUpPage />} />
      
      {/* Diagnostic routes - accessible without auth */}
      <Route path="/test" element={<TestPage />} />
      <Route path="/diagnostics" element={<DiagnosticsPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/" />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create-trip" element={<CreateTripPage />} />
        <Route path="trip/:tripId" element={<TripDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute = ({ children, requireAuth = true, requireRole = null, redirectTo = '/login' }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role requirement
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />
  }

  // If route doesn't require auth but user is authenticated, might want to redirect
  if (!requireAuth && isAuthenticated && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute
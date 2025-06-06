import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'
import authService from '@/services/api/authService'

// Auth context
const AuthContext = createContext()

// Auth state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Auth actions
const AUTH_ACTIONS = {
  LOADING: 'LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        sessionId: action.payload.sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      }
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const sessionId = localStorage.getItem('sessionId')

        if (accessToken) {
          // Verify token and get user
          const user = await authService.getCurrentUser(accessToken)
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user,
              accessToken,
              refreshToken,
              sessionId
            }
          })
        } else {
          dispatch({ type: AUTH_ACTIONS.LOADING, payload: false })
        }
      } catch (error) {
        // Token might be expired, try refresh
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (refreshToken) {
          try {
            const response = await authService.refreshToken(refreshToken)
            const user = await authService.getCurrentUser(response.accessToken)
            
            // Update tokens in localStorage
            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)
            
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                sessionId: localStorage.getItem('sessionId')
              }
            })
          } catch (refreshError) {
            // Refresh failed, logout
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('sessionId')
            dispatch({ type: AUTH_ACTIONS.LOGOUT })
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT })
        }
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.login(email, password, rememberMe)

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('sessionId', response.sessionId)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response
      })

      toast.success('Login successful!')
      return response
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.register(userData)

      toast.success(response.message)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Registration failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: false })
    }
  }

  // OAuth login function
  const oauthLogin = async (provider, oauthData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.oauthLogin(provider, oauthData)

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('sessionId', response.sessionId)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response
      })

      toast.success('Login successful!')
      return response
    } catch (error) {
      const errorMessage = error.message || 'OAuth login failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout function
  const logout = async (logoutAllDevices = false) => {
    try {
      if (logoutAllDevices) {
        await authService.logoutAllDevices(state.user?.id)
      } else {
        await authService.logout(state.sessionId, state.refreshToken)
      }

      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('sessionId')

      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      
      toast.success(logoutAllDevices ? 'Logged out from all devices' : 'Logged out successfully')
    } catch (error) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('sessionId')
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.error('Logout failed, but you have been logged out locally')
    }
  }

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.requestPasswordReset(email)
      
      toast.success(response.message)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Password reset request failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: false })
    }
  }

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.resetPassword(token, newPassword)
      
      toast.success(response.message)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: false })
    }
  }

  // Verify email
  const verifyEmail = async (token) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authService.verifyEmail(token)
      
      // Update user's email verification status
      if (state.user) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: { isEmailVerified: true }
        })
      }
      
      toast.success(response.message)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Email verification failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: false })
    }
  }

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    })
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user) return false
    
    // Add permission logic here
    return true
  }

  // Refresh token function
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      
      // Update tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // Update state
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }
      })

      return response.accessToken
    } catch (error) {
      // Refresh failed, logout user
      logout()
      throw error
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    oauthLogin,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    updateUser,
    clearError,
    hasPermission,
    refreshAccessToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

const LoginPage = () => {
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, data.rememberMe)
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by auth context
    }
  }

  const handleOAuthLogin = (provider) => {
    // In real app, would initiate OAuth flow
    console.log(`OAuth login with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Wrench" className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-surface-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Sign in to your FixIt Now account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ApperIcon name="AlertCircle" className="text-red-500" size={20} />
                <span className="ml-2 text-red-700 dark:text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => handleOAuthLogin('google')}
              className="w-full bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center justify-center space-x-3"
            >
              <ApperIcon name="Chrome" size={20} />
              <span>Continue with Google</span>
            </Button>
            
            <Button
              onClick={() => handleOAuthLogin('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-3"
            >
              <ApperIcon name="Facebook" size={20} />
              <span>Continue with Facebook</span>
            </Button>
            
            <Button
              onClick={() => handleOAuthLogin('github')}
              className="w-full bg-surface-900 hover:bg-surface-800 text-white flex items-center justify-center space-x-3"
            >
              <ApperIcon name="Github" size={20} />
              <span>Continue with GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-300 dark:border-surface-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary"
                  {...register('rememberMe')}
                />
                <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center space-x-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="LogIn" size={20} />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { validatePassword } from '@/services/utils'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const RegisterPage = () => {
  const { register: registerUser, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false
    }
  })

  const password = watch('password')

  // Update password validation as user types
  React.useEffect(() => {
    if (password) {
      setPasswordValidation(validatePassword(password))
    }
  }, [password])

  const onSubmit = async (data) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone
      })
      navigate('/verify-email', { 
        state: { 
          email: data.email,
          message: 'Registration successful! Please check your email to verify your account.'
        }
      })
    } catch (error) {
      // Error is handled by auth context
    }
  }

  const handleOAuthRegister = (provider) => {
    // In real app, would initiate OAuth flow
    console.log(`OAuth register with ${provider}`)
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
              Create Account
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Join FixIt Now and find reliable handymen
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
              onClick={() => handleOAuthRegister('google')}
              className="w-full bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center justify-center space-x-3"
            >
              <ApperIcon name="Chrome" size={20} />
              <span>Sign up with Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-300 dark:border-surface-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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

              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={passwordValidation.requirements?.minLength ? 'Check' : 'X'} 
                      size={14} 
                      className={passwordValidation.requirements?.minLength ? 'text-green-500' : 'text-red-500'} 
                    />
                    <span className={`text-xs ${passwordValidation.requirements?.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={passwordValidation.requirements?.hasUppercase ? 'Check' : 'X'} 
                      size={14} 
                      className={passwordValidation.requirements?.hasUppercase ? 'text-green-500' : 'text-red-500'} 
                    />
                    <span className={`text-xs ${passwordValidation.requirements?.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={passwordValidation.requirements?.hasLowercase ? 'Check' : 'X'} 
                      size={14} 
                      className={passwordValidation.requirements?.hasLowercase ? 'text-green-500' : 'text-red-500'} 
                    />
                    <span className={`text-xs ${passwordValidation.requirements?.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={passwordValidation.requirements?.hasNumber ? 'Check' : 'X'} 
                      size={14} 
                      className={passwordValidation.requirements?.hasNumber ? 'text-green-500' : 'text-red-500'} 
                    />
                    <span className={`text-xs ${passwordValidation.requirements?.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={passwordValidation.requirements?.hasSpecial ? 'Check' : 'X'} 
                      size={14} 
                      className={passwordValidation.requirements?.hasSpecial ? 'text-green-500' : 'text-red-500'} 
                    />
                    <span className={`text-xs ${passwordValidation.requirements?.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                      One special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary"
                  {...register('agreeToTerms')}
                />
                <span className="text-sm text-surface-700 dark:text-surface-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center space-x-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="UserPlus" size={20} />
                  <span>Create Account</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
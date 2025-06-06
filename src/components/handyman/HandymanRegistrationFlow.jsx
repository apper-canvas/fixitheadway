import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import ProfileTypeToggle from './ProfileTypeToggle'
import SkillSelector from './SkillSelector'
import ServiceAreaSelector from './ServiceAreaSelector'
import AvailabilityCalendar from './AvailabilityCalendar'
import { useAuth } from '@/contexts/AuthContext'
import handymanProfileService from '@/services/api/handymanProfileService'

// Validation schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must be less than 500 characters'),
  businessName: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal(''))
})

const professionalInfoSchema = z.object({
  licenseNumber: z.string().optional(),
  insuranceNumber: z.string().optional(),
  yearsOfExperience: z.number().min(0, 'Years of experience must be 0 or more').max(50, 'Years of experience must be 50 or less')
})

const pricingSchema = z.object({
  hourlyRate: z.number().min(20, 'Hourly rate must be at least $20').max(500, 'Hourly rate must be less than $500'),
  minimumCharge: z.number().min(50, 'Minimum charge must be at least $50').max(1000, 'Minimum charge must be less than $1000'),
  emergencyRate: z.number().min(25, 'Emergency rate must be at least $25').max(750, 'Emergency rate must be less than $750'),
  travelFee: z.number().min(0, 'Travel fee must be 0 or more').max(100, 'Travel fee must be less than $100')
})

const HandymanRegistrationFlow = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    personalInfo: {},
    professionalInfo: {},
    skills: [],
    serviceArea: {
      type: 'radius',
      center: { lat: 0, lng: 0, address: '' },
      radius: 10,
      zipcodes: [],
      cities: []
    },
    availability: {
      schedule: {
        monday: { available: false, hours: [] },
        tuesday: { available: false, hours: [] },
        wednesday: { available: false, hours: [] },
        thursday: { available: false, hours: [] },
        friday: { available: false, hours: [] },
        saturday: { available: false, hours: [] },
        sunday: { available: false, hours: [] }
      },
      emergencyAvailability: false,
      bookingBuffer: 60,
      maxAdvanceBooking: 30,
      blackoutDates: []
    },
    pricing: {
      hourlyRate: 50,
      minimumCharge: 100,
      emergencyRate: 75,
      travelFee: 15
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    {
      number: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: 'User'
    },
    {
      number: 2,
      title: 'Professional Details',
      description: 'Your experience and credentials',
      icon: 'Briefcase'
    },
    {
      number: 3,
      title: 'Skills & Services',
      description: 'What services do you offer?',
      icon: 'Tool'
    },
    {
      number: 4,
      title: 'Service Area',
      description: 'Where do you work?',
      icon: 'Map'
    },
    {
      number: 5,
      title: 'Availability',
      description: 'When are you available?',
      icon: 'Calendar'
    },
    {
      number: 6,
      title: 'Pricing',
      description: 'Set your rates',
      icon: 'DollarSign'
    }
  ]

  // Form for current step
  const getSchemaForStep = (step) => {
    switch (step) {
      case 1: return personalInfoSchema
      case 2: return professionalInfoSchema
      case 6: return pricingSchema
      default: return z.object({})
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep)),
    defaultValues: currentStep === 1 ? profileData.personalInfo :
                   currentStep === 2 ? profileData.professionalInfo :
                   currentStep === 6 ? profileData.pricing : {}
  })

  // Update form when step changes
  React.useEffect(() => {
    const stepData = currentStep === 1 ? profileData.personalInfo :
                     currentStep === 2 ? profileData.professionalInfo :
                     currentStep === 6 ? profileData.pricing : {}
    
    reset(stepData)
  }, [currentStep, reset])

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepSubmit = (data) => {
    if (currentStep === 1) {
      setProfileData({
        ...profileData,
        personalInfo: { ...profileData.personalInfo, ...data }
      })
    } else if (currentStep === 2) {
      setProfileData({
        ...profileData,
        professionalInfo: { ...profileData.professionalInfo, ...data }
      })
    } else if (currentStep === 6) {
      setProfileData({
        ...profileData,
        pricing: { ...profileData.pricing, ...data }
      })
    }
    
    nextStep()
  }

  const handleSkillsChange = (skills) => {
    setProfileData({
      ...profileData,
      skills
    })
  }

  const handleServiceAreaChange = (serviceArea) => {
    setProfileData({
      ...profileData,
      serviceArea
    })
  }

  const handleAvailabilityChange = (availability) => {
    setProfileData({
      ...profileData,
      availability
    })
  }

  const handleFinalSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a handyman profile')
      return
    }

    setIsSubmitting(true)
    try {
      // Create handyman profile
      await handymanProfileService.createProfile(user.id, {
        ...profileData.personalInfo,
        ...profileData.professionalInfo,
        skills: profileData.skills,
        serviceArea: profileData.serviceArea,
        availability: profileData.availability,
        pricing: profileData.pricing
      })

      toast.success('Handyman profile created successfully!')
      navigate('/handyman/profile')
    } catch (error) {
      console.error('Failed to create handyman profile:', error)
      toast.error(error.message || 'Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Professional Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white resize-none"
                placeholder="Tell potential customers about your experience, specialties, and what makes you unique..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <Input
              label="Business Name (Optional)"
              placeholder="John's Handyman Services"
              error={errors.businessName?.message}
              {...register('businessName')}
            />

            <Input
              label="Website (Optional)"
              type="url"
              placeholder="https://yourwebsite.com"
              error={errors.website?.message}
              {...register('website')}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary-dark"
            >
              Continue
            </Button>
          </form>
        )

      case 2:
        return (
          <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
            <Input
              label="License Number (Optional)"
              placeholder="Enter your professional license number"
              error={errors.licenseNumber?.message}
              {...register('licenseNumber')}
            />

            <Input
              label="Insurance Number (Optional)"
              placeholder="Enter your insurance policy number"
              error={errors.insuranceNumber?.message}
              {...register('insuranceNumber')}
            />

            <Input
              label="Years of Experience"
              type="number"
              min="0"
              max="50"
              placeholder="0"
              error={errors.yearsOfExperience?.message}
              {...register('yearsOfExperience', { valueAsNumber: true })}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Continue
              </Button>
            </div>
          </form>
        )

      case 3:
        return (
          <div className="space-y-6">
            <SkillSelector
              skills={profileData.skills}
              onSkillsChange={handleSkillsChange}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={profileData.skills.length === 0}
                className="bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <ServiceAreaSelector
              serviceArea={profileData.serviceArea}
              onServiceAreaChange={handleServiceAreaChange}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <AvailabilityCalendar
              availability={profileData.availability}
              onAvailabilityChange={handleAvailabilityChange}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Hourly Rate ($)"
                type="number"
                min="20"
                max="500"
                placeholder="50"
                error={errors.hourlyRate?.message}
                {...register('hourlyRate', { valueAsNumber: true })}
              />
              <Input
                label="Minimum Charge ($)"
                type="number"
                min="50"
                max="1000"
                placeholder="100"
                error={errors.minimumCharge?.message}
                {...register('minimumCharge', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Emergency Rate ($)"
                type="number"
                min="25"
                max="750"
                placeholder="75"
                error={errors.emergencyRate?.message}
                {...register('emergencyRate', { valueAsNumber: true })}
              />
              <Input
                label="Travel Fee ($)"
                type="number"
                min="0"
                max="100"
                placeholder="15"
                error={errors.travelFee?.message}
                {...register('travelFee', { valueAsNumber: true })}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Review & Submit
              </Button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  // If we've completed all steps, show review
  if (currentStep > steps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-heading font-bold text-surface-900 dark:text-white mb-2">
                Review Your Profile
              </h1>
              <p className="text-surface-600 dark:text-surface-400">
                Please review your information before submitting
              </p>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6 mb-8">
              <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-surface-600 dark:text-surface-400">Name:</span>
                    <span className="ml-2 text-surface-900 dark:text-white">
                      {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-surface-600 dark:text-surface-400">Email:</span>
                    <span className="ml-2 text-surface-900 dark:text-white">
                      {profileData.personalInfo.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                  Skills ({profileData.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-surface-600 dark:text-surface-400">Hourly Rate:</span>
                    <span className="ml-2 text-surface-900 dark:text-white">
                      ${profileData.pricing.hourlyRate}/hour
                    </span>
                  </div>
                  <div>
                    <span className="text-surface-600 dark:text-surface-400">Minimum Charge:</span>
                    <span className="ml-2 text-surface-900 dark:text-white">
                      ${profileData.pricing.minimumCharge}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentStep(steps.length)}
                className="bg-surface-200 text-surface-700 hover:bg-surface-300"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={16} />
                    <span>Create Profile</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${currentStep >= step.number
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-surface-400'
                  }
                `}>
                  {currentStep > step.number ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    <ApperIcon name={step.icon} size={20} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    hidden md:block w-20 h-0.5 ml-4 transition-all
                    ${currentStep > step.number ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-surface-600 dark:text-surface-400">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

export default HandymanRegistrationFlow
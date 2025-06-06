import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ProfileTypeToggle = ({ 
  profileType, 
  onTypeChange, 
  className = '',
  disabled = false 
}) => {
  const options = [
    {
      type: 'user',
      label: 'Customer',
      icon: 'User',
      description: 'Find and book services'
    },
    {
      type: 'handyman',
      label: 'Handyman',
      icon: 'Wrench',
      description: 'Offer your services'
    }
  ]

  return (
    <div className={`profile-type-toggle ${className}`}>
      <div className="flex">
        {options.map((option) => (
          <motion.button
            key={option.type}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onTypeChange(option.type)}
            className={`
              profile-type-option flex-1 px-6 py-4 text-center transition-all duration-300
              ${profileType === option.type ? 'active text-surface-900' : 'text-white hover:text-surface-100'}
              ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex flex-col items-center space-y-2">
              <ApperIcon 
                name={option.icon} 
                size={24}
                className={profileType === option.type ? 'text-primary' : ''} 
              />
              <div>
                <div className="font-semibold text-sm">{option.label}</div>
                <div className={`text-xs ${
                  profileType === option.type 
                    ? 'text-surface-600' 
                    : 'text-white/80'
                }`}>
                  {option.description}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ProfileTypeToggle
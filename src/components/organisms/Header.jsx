import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import CurrencySelector from '@/components/atoms/CurrencySelector'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Wrench" className="text-white" size={20} />
            </div>
            <Text type="h1" className="text-xl font-heading font-bold text-surface-900 dark:text-white">
              FixIt Now
            </Text>
          </div>
          <div className="flex items-center space-x-4">
            <CurrencySelector />
            <Button className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary font-medium">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
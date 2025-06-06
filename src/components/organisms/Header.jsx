import React from 'react'
      import ApperIcon from '@/components/ApperIcon'
      import ToggleButton from '@/components/atoms/ToggleButton'
      import Text from '@/components/atoms/Text'

      const Header = ({ darkMode, onToggleDarkMode }) => {
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
                
                <ToggleButton
                  iconName={darkMode ? 'Sun' : 'Moon'}
                  onClick={onToggleDarkMode}
                />
              </div>
            </div>
          </header>
        )
      }

      export default Header
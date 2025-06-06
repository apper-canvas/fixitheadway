import React from 'react'
      import Text from '@/components/atoms/Text'
      import IconWrapper from '@/components/atoms/IconWrapper'

      const SectionHeader = ({ title, subtitle, showLiveUpdates = false, children }) => {
        return (
          <div className="flex items-center justify-between mb-8">
            <div>
              <Text type="h2" className="text-3xl font-heading font-bold text-surface-900 dark:text-white mb-2">
                {title}
              </Text>
              {subtitle && <Text className="text-surface-600 dark:text-surface-400">{subtitle}</Text>}
            </div>
            {showLiveUpdates && (
              <IconWrapper iconName="" wrapperClassName="flex items-center space-x-2 text-secondary">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse-slow"></div>
                <Text type="span" className="text-sm font-medium">Live Updates</Text>
              </IconWrapper>
            )}
            {children}
          </div>
        )
      }

      export default SectionHeader
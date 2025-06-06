import React from 'react'
      import ApperIcon from '@/components/ApperIcon'

      const IconWrapper = ({ iconName, iconSize = 24, iconClassName = '', wrapperClassName = '', children }) => {
        return (
          <div className={`flex items-center justify-center ${wrapperClassName}`}>
            <ApperIcon name={iconName} size={iconSize} className={iconClassName} />
            {children}
          </div>
        )
      }

      export default IconWrapper
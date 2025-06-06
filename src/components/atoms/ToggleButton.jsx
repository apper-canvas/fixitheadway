import React from 'react'
      import ApperIcon from '@/components/ApperIcon'
      import Button from './Button'

      const ToggleButton = ({ iconName, onClick, className = '' }) => {
        return (
          <Button
            onClick={onClick}
            className={`p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 ${className}`}
          >
            <ApperIcon name={iconName} className="text-surface-600 dark:text-surface-400" size={20} />
          </Button>
        )
      }

      export default ToggleButton
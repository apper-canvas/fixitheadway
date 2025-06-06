import React from 'react'

      const Label = ({ children, className = '', htmlFor }) => {
        return (
          <label htmlFor={htmlFor} className={`block text-sm font-medium text-surface-700 dark:text-surface-300 ${className}`}>
            {children}
          </label>
        )
      }

      export default Label
import React from 'react'

      const Badge = ({ children, className = '' }) => {
        return (
          <span className={`px-3 py-1 text-sm rounded-full font-medium ${className}`}>
            {children}
          </span>
        )
      }

      export default Badge
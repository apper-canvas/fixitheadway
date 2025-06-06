import React from 'react'

      const Input = ({ type = 'text', value, onChange, placeholder, className = '', min, rows, ...props }) => {
        const Component = rows ? 'textarea' : 'input'
        return (
          <Component
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            rows={rows}
            className={`w-full p-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...props}
          />
        )
      }

      export default Input
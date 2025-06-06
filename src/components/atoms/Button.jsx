import React from 'react'
      import { motion } from 'framer-motion'

      const Button = ({ children, className = '', onClick, type = 'button', whileHover = { scale: 1.02 }, whileTap = { scale: 0.98 }, ...props }) => {
        return (
          <motion.button
            type={type}
            onClick={onClick}
            className={`transition-colors ${className}`}
            whileHover={whileHover}
            whileTap={whileTap}
            {...props}
          >
            {children}
          </motion.button>
        )
      }

      export default Button
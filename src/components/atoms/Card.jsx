import React from 'react'
      import { motion } from 'framer-motion'

      const Card = ({ children, className = '', whileHover, whileTap, initial, animate, transition, ...props }) => {
        const motionProps = { whileHover, whileTap, initial, animate, transition }
        const isMotion = whileHover || whileTap || initial || animate || transition

        const CardComponent = isMotion ? motion.div : 'div'

        return (
          <CardComponent
            className={`rounded-2xl shadow-card transition-all border border-surface-200 dark:border-surface-700 ${className}`}
            {...motionProps}
            {...props}
          >
            {children}
          </CardComponent>
        )
      }

      export default Card
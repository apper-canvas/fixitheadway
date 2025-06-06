import React from 'react'
      import ApperIcon from '@/components/ApperIcon'

      const RatingStars = ({ rating, reviewCount, iconSize = 16, iconClassName = '' }) => {
        return (
          <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                size={iconSize}
                className={`${iconClassName} ${i < Math.floor(rating) ? 'text-accent fill-current' : 'text-surface-300'}`}
              />
            ))}
            <span className="text-sm text-surface-600 dark:text-surface-400 ml-2">
              {rating} ({reviewCount})
            </span>
          </div>
        )
      }

      export default RatingStars
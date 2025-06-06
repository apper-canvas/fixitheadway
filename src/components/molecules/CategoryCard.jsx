import React from 'react'
      import ApperIcon from '@/components/ApperIcon'
      import Card from '@/components/atoms/Card'
      import Text from '@/components/atoms/Text'

      const CategoryCard = ({ category }) => {
        return (
          <Card
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white dark:bg-surface-800 hover:shadow-lg cursor-pointer"
          >
            <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
              <ApperIcon name={category.icon} className="text-white" size={24} />
            </div>
            <Text type="h3" className="font-heading font-semibold text-surface-900 dark:text-white">
              {category.name}
            </Text>
          </Card>
        )
      }

      export default CategoryCard
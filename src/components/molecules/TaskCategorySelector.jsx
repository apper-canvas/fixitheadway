import React from 'react'
      import ApperIcon from '@/components/ApperIcon'
      import Button from '@/components/atoms/Button'
      import Text from '@/components/atoms/Text'

      const TaskCategorySelector = ({ categories, selectedCategory, onSelectCategory }) => {
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                type="button"
                onClick={() => onSelectCategory(category.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === category.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
              >
                <ApperIcon name={category.icon} size={24} className="mx-auto mb-2" />
                <Text type="div" className="text-sm font-medium">{category.label}</Text>
              </Button>
            ))}
          </div>
        )
      }

      export default TaskCategorySelector
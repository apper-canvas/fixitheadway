import React from 'react'
      import Button from '@/components/atoms/Button'
      import Text from '@/components/atoms/Text'

      const TaskUrgencySelector = ({ urgencyLevels, selectedUrgency, onSelectUrgency }) => {
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {urgencyLevels.map((level) => (
              <Button
                key={level.value}
                type="button"
                onClick={() => onSelectUrgency(level.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedUrgency === level.value
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                }`}
              >
                <Text type="div" className={`text-sm font-medium ${level.color}`}>
                  {level.label}
                </Text>
              </Button>
            ))}
          </div>
        )
      }

      export default TaskUrgencySelector
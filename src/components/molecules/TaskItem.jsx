import React, { useState } from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import Badge from '@/components/atoms/Badge'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'
      import PriceBreakdownModal from '@/components/organisms/PriceBreakdownModal'

      const TaskItem = ({ task, urgencyLevels, onDeleteTask }) => {
        const [showBreakdown, setShowBreakdown] = useState(false)
        const urgencyLabel = urgencyLevels.find(l => l.value === task.urgency)?.label || 'Normal'
        const urgencyColor = urgencyLevels.find(l => l.value === task.urgency)?.color || 'text-surface-600'
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className="bg-primary/10 text-primary">
                    {task.category}
                  </Badge>
                  <Text type="span" className={`text-sm font-medium ${urgencyColor}`}>
                    {urgencyLabel}
                  </Text>
                </div>
                <Text className="text-surface-900 dark:text-white font-medium mb-2">
                  {task.description}
</Text>
                <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400 mb-3">
                  <Text type="span">Estimated: ${task.estimatedPrice}</Text>
                  <Text type="span">{task.location?.address}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowBreakdown(true)}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1"
                  >
                    <ApperIcon name="Receipt" size={14} />
                    <Text type="span">View Price Breakdown</Text>
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => onDeleteTask(task.id)}
                className="text-surface-400 hover:text-red-500"
              >
                <ApperIcon name="Trash2" size={18} />
              </Button>
            </div>
            
            <PriceBreakdownModal
              isOpen={showBreakdown}
              onClose={() => setShowBreakdown(false)}
              taskId={task.id}
            />
          </motion.div>
        )
      }

      export default TaskItem
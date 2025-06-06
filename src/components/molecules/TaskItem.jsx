import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import PriceBreakdownModal from '@/components/organisms/PriceBreakdownModal'
import { useCurrency } from '@/contexts/CurrencyContext'

const TaskItem = ({ task, onClick, onDeleteTask }) => {
  const { formatCurrency, convertAmount } = useCurrency()
  const [showPriceModal, setShowPriceModal] = useState(false)
  
  const urgencyLevels = [
    { value: 'low', color: 'text-green-600', label: 'Low Priority' },
    { value: 'medium', color: 'text-yellow-600', label: 'Medium Priority' },
    { value: 'high', color: 'text-red-600', label: 'High Priority' },
    { value: 'urgent', color: 'text-red-700', label: 'Urgent' }
  ]
  
  const urgencyLevel = urgencyLevels.find(l => l.value === task.urgency) || urgencyLevels[0]
  const urgencyColor = urgencyLevel.color
  const urgencyLabel = urgencyLevel.label
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700"
      onClick={onClick}
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
            <Text type="span">Estimated: {formatCurrency(convertAmount(task.estimatedPrice, 'USD'))}</Text>
            <Text type="span">{task.location?.address}</Text>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowPriceModal(true)}
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1"
            >
              <ApperIcon name="Receipt" size={14} />
              <Text type="span">View Price Breakdown</Text>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Text className="text-2xl font-bold text-primary">
            {formatCurrency(convertAmount(task.estimatedPrice, 'USD'))}
          </Text>
          {onDeleteTask && (
            <Button
              onClick={() => onDeleteTask(task.id)}
              className="text-surface-400 hover:text-red-500"
            >
              <ApperIcon name="Trash" size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <PriceBreakdownModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        taskId={task.id}
      />
    </motion.div>
  )
}

export default TaskItem
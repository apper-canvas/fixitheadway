import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import { useCurrency } from '@/contexts/CurrencyContext'
import taskService from '@/services/api/taskService'

const PriceBreakdownModal = ({ isOpen, onClose, taskId }) => {
  const { formatCurrency, convertAmount, currency } = useCurrency()
  const [breakdown, setBreakdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (isOpen && taskId) {
      loadPriceBreakdown()
    }
  }, [isOpen, taskId])

  const loadPriceBreakdown = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await taskService.getPriceBreakdown(taskId)
      setBreakdown(data)
    } catch (err) {
      setError('Failed to load price breakdown')
    } finally {
      setLoading(false)
    }
  }

const formatAmount = (amount) => {
    const convertedAmount = convertAmount(amount, 'USD')
    return formatCurrency(convertedAmount)
  }
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <Text type="h2" className="text-xl font-heading font-semibold text-surface-900 dark:text-white">
              Price Breakdown
            </Text>
            <Button
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
                <Text className="text-red-500 dark:text-red-400">{error}</Text>
                <Button
                  onClick={loadPriceBreakdown}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Try Again
                </Button>
              </div>
            )}

            {breakdown && (
              <div className="space-y-6">
                {/* Labor Costs */}
                <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Clock" size={20} className="text-primary" />
                    <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white">
                      Labor Costs
                    </Text>
                  </div>
                  <div className="space-y-3">
                    {breakdown.labor.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700 last:border-b-0">
                        <div className="flex-1">
                          <Text className="font-medium text-surface-900 dark:text-white">
                            {item.task}
                          </Text>
<Text className="text-sm text-surface-600 dark:text-surface-400">
                            {item.hours} hours × {formatAmount(item.hourlyRate)}/hour
                          </Text>
                        </div>
                        <Text className="font-semibold text-surface-900 dark:text-white">
                          {formatAmount(item.total)}
                        </Text>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-surface-300 dark:border-surface-600">
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        Labor Subtotal
                      </Text>
<Text className="font-bold text-lg text-primary">
                        {formatAmount(breakdown.laborTotal)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Material Costs */}
                <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Package" size={20} className="text-secondary" />
                    <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white">
                      Material Costs
                    </Text>
                  </div>
                  <div className="space-y-3">
                    {breakdown.materials.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700 last:border-b-0">
                        <div className="flex-1">
                          <Text className="font-medium text-surface-900 dark:text-white">
                            {item.name}
                          </Text>
<Text className="text-sm text-surface-600 dark:text-surface-400">
                            {item.quantity} {item.unit} × {formatAmount(item.unitPrice)}/{item.unit}
                          </Text>
                        </div>
                        <Text className="font-semibold text-surface-900 dark:text-white">
                          {formatAmount(item.total)}
                        </Text>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-surface-300 dark:border-surface-600">
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        Materials Subtotal
                      </Text>
<Text className="font-bold text-lg text-secondary">
                        {formatAmount(breakdown.materialsTotal)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Other Fees */}
                <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="FileText" size={20} className="text-accent" />
                    <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white">
                      Other Fees
                    </Text>
                  </div>
                  <div className="space-y-3">
                    {breakdown.fees.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700 last:border-b-0">
                        <div className="flex-1">
                          <Text className="font-medium text-surface-900 dark:text-white">
                            {item.name}
                          </Text>
                          <Text className="text-sm text-surface-600 dark:text-surface-400">
                            {item.description}
                          </Text>
                        </div>
<Text className="font-semibold text-surface-900 dark:text-white">
                          {formatAmount(item.amount)}
                        </Text>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-surface-300 dark:border-surface-600">
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        Fees Subtotal
                      </Text>
<Text className="font-bold text-lg text-accent">
                        {formatAmount(breakdown.feesTotal)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                  <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                    Cost Summary
                  </Text>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
<Text className="text-surface-700 dark:text-surface-300">Labor</Text>
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        {formatAmount(breakdown.laborTotal)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text className="text-surface-700 dark:text-surface-300">Materials</Text>
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        {formatAmount(breakdown.materialsTotal)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text className="text-surface-700 dark:text-surface-300">Other Fees</Text>
                      <Text className="font-semibold text-surface-900 dark:text-white">
                        {formatAmount(breakdown.feesTotal)}
                      </Text>
                    </div>
                    <div className="border-t border-surface-300 dark:border-surface-600 pt-2 mt-3">
                      <div className="flex justify-between items-center">
                        <Text className="text-xl font-bold text-surface-900 dark:text-white">
                          Total Estimate
                        </Text>
<Text className="text-2xl font-bold text-primary">
                          {formatAmount(breakdown.totalEstimate)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <ApperIcon name="Info" size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <Text className="text-sm text-yellow-800 dark:text-yellow-200">
                      This is an estimated breakdown. Final costs may vary based on actual work performed, 
                      material availability, and unforeseen complications. The handyman will provide a 
                      final quote before starting work.
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-surface-200 dark:border-surface-700">
            <Button
              onClick={onClose}
              className="px-6 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PriceBreakdownModal
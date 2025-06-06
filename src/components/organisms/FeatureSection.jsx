import React, { useState, useEffect } from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import { toast } from 'react-toastify'
      import ApperIcon from '@/components/ApperIcon'
      import taskService from '@/services/api/taskService'
      import Button from '@/components/atoms/Button'
      import Text from '@/components/atoms/Text'
      import Label from '@/components/atoms/Label'
      import Input from '@/components/atoms/Input'
      import SectionHeader from '@/components/molecules/SectionHeader'
      import TaskFormFields from '@/components/molecules/TaskFormFields'
      import TaskItem from '@/components/molecules/TaskItem'

      const FeatureSection = () => {
        const [tasks, setTasks] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [newTask, setNewTask] = useState({
          category: '',
          description: '',
          urgency: 'normal',
          location: { address: '123 Main St, City' }
        })
        const [showTaskForm, setShowTaskForm] = useState(false)
        const [searchRadius, setSearchRadius] = useState(5)

        useEffect(() => {
          loadTasks()
        }, [])

        const loadTasks = async () => {
          setLoading(true)
          try {
            const result = await taskService.getAll()
            setTasks(result || [])
          } catch (err) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }

        const handleSubmitTask = async (e) => {
          e.preventDefault()
          
          if (!newTask.category || !newTask.description.trim()) {
            toast.error('Please fill in all required fields')
            return
          }

          try {
            const taskData = {
              ...newTask,
              estimatedPrice: Math.floor(Math.random() * 200) + 50,
              images: []
            }
            
            const createdTask = await taskService.create(taskData)
            setTasks(prev => [createdTask, ...prev])
            setNewTask({
              category: '',
              description: '',
              urgency: 'normal',
              location: { address: '123 Main St, City' }
            })
            setShowTaskForm(false)
            toast.success('Task posted successfully! Finding handymen...')
          } catch (err) {
            toast.error('Failed to post task')
          }
        }

        const handleDeleteTask = async (taskId) => {
          try {
            await taskService.delete(taskId)
            setTasks(prev => prev.filter(task => task.id !== taskId))
            toast.success('Task removed')
          } catch (err) {
            toast.error('Failed to remove task')
          }
        }

        const categories = [
          { value: 'plumbing', label: 'Plumbing', icon: 'Wrench' },
          { value: 'electrical', label: 'Electrical', icon: 'Zap' },
          { value: 'carpentry', label: 'Carpentry', icon: 'Hammer' },
          { value: 'appliance', label: 'Appliance Repair', icon: 'Settings' }
        ]

        const urgencyLevels = [
          { value: 'low', label: 'Within a week', color: 'text-green-600' },
          { value: 'normal', label: 'Within 2-3 days', color: 'text-yellow-600' },
          { value: 'high', label: 'Today', color: 'text-orange-600' },
          { value: 'urgent', label: 'Emergency', color: 'text-red-600' }
        ]

        return (
          <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-card p-8 border border-surface-200 dark:border-surface-700">
            {/* Header */}
            <SectionHeader
              title="Post Your Task"
              subtitle="Get instant quotes from nearby handymen"
            >
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={20} />
                <Text type="span">New Task</Text>
              </Button>
            </SectionHeader>

            {/* Search Radius Control */}
            <div className="mb-8 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <Label>Search Radius: {searchRadius} miles</Label>
                <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <Text type="span">Live tracking</Text>
                </div>
              </div>
              <Input
                type="range"
                min="1"
                max="25"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-surface-500 dark:text-surface-500 mt-1">
                <Text type="span">1 mile</Text>
                <Text type="span">25 miles</Text>
              </div>
            </div>

            {/* Task Form */}
            <AnimatePresence>
              {showTaskForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-6 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
                >
                  <form onSubmit={handleSubmitTask} className="space-y-6">
                    <TaskFormFields
                      newTask={newTask}
                      setNewTask={setNewTask}
                      categories={categories}
                      urgencyLevels={urgencyLevels}
                    />

                    <div className="flex space-x-3">
                      <Button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-xl"
                      >
                        Get Instant Quotes
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="px-6 py-3 border border-surface-300 dark:border-surface-600 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Tasks */}
            <div>
              <Text type="h3" className="text-lg font-heading font-semibold text-surface-900 dark:text-white mb-4">
                Your Tasks ({tasks.length})
              </Text>
              
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <Text className="text-red-500 dark:text-red-400">{error}</Text>
                </div>
              )}

              {!loading && tasks.length === 0 && (
                <div className="text-center py-12">
                  <ApperIcon name="Clipboard" size={48} className="text-surface-400 mx-auto mb-4" />
                  <Text className="text-surface-600 dark:text-surface-400">
                    No tasks yet. Create your first task to get started!
                  </Text>
                </div>
              )}

              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    urgencyLevels={urgencyLevels}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }

      export default FeatureSection
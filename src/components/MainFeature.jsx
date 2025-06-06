import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import taskService from '../services/api/taskService'

const MainFeature = () => {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white mb-2">
            Post Your Task
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Get instant quotes from nearby handymen
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>New Task</span>
        </motion.button>
      </div>

      {/* Search Radius Control */}
      <div className="mb-8 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Search Radius: {searchRadius} miles
          </label>
          <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span>Live tracking</span>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="25"
          value={searchRadius}
          onChange={(e) => setSearchRadius(Number(e.target.value))}
          className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-surface-500 dark:text-surface-500 mt-1">
          <span>1 mile</span>
          <span>25 miles</span>
        </div>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700"
        >
          <form onSubmit={handleSubmitTask} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setNewTask({ ...newTask, category: category.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    newTask.category === category.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                  }`}
                >
                  <ApperIcon name={category.icon} size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Task Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe what needs to be done..."
                rows="4"
                className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setNewTask({ ...newTask, urgency: level.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      newTask.urgency === level.value
                        ? 'border-primary bg-primary/10'
                        : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                    }`}
                  >
                    <div className={`text-sm font-medium ${level.color}`}>
                      {level.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Get Instant Quotes
              </motion.button>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="px-6 py-3 border border-surface-300 dark:border-surface-600 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Active Tasks */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white mb-4">
          Your Tasks ({tasks.length})
        </h3>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Clipboard" size={48} className="text-surface-400 mx-auto mb-4" />
            <p className="text-surface-600 dark:text-surface-400">
              No tasks yet. Create your first task to get started!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                      {task.category}
                    </span>
                    <span className={`text-sm font-medium ${
                      urgencyLevels.find(l => l.value === task.urgency)?.color || 'text-surface-600'
                    }`}>
                      {urgencyLevels.find(l => l.value === task.urgency)?.label}
                    </span>
                  </div>
                  <p className="text-surface-900 dark:text-white font-medium mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                    <span>Estimated: ${task.estimatedPrice}</span>
                    <span>{task.location?.address}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-surface-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainFeature
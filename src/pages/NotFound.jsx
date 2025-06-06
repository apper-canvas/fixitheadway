import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="AlertTriangle" className="text-primary" size={48} />
        </div>
        
        <h1 className="text-6xl font-heading font-bold text-surface-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-heading font-semibold text-surface-700 dark:text-surface-300 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ApperIcon name="Home" size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
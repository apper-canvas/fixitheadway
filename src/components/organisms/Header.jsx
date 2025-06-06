import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import CurrencySelector from '@/components/atoms/CurrencySelector'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Wrench" className="text-white" size={20} />
            </div>
            <Text type="h1" className="text-xl font-heading font-bold text-surface-900 dark:text-white">
              FixIt Now
            </Text>
          </Link>

          <div className="flex items-center space-x-4">
            <CurrencySelector />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-surface-700 dark:text-surface-300 font-medium">
                    {user?.firstName}
                  </span>
                  <ApperIcon name="ChevronDown" size={16} className="text-surface-500" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-1"
                    >
                      <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                        <p className="text-sm font-medium text-surface-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <ApperIcon name="User" size={16} />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <ApperIcon name="Calendar" size={16} />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <ApperIcon name="Settings" size={16} />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-surface-200 dark:border-surface-700 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <ApperIcon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
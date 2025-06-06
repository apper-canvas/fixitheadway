import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import handymanService from '../services/api/handymanService'
import taskService from '../services/api/taskService'
import bookingService from '../services/api/bookingService'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [handymen, setHandymen] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedHandyman, setSelectedHandyman] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    loadHandymen()
  }, [])

  const loadHandymen = async () => {
    setLoading(true)
    try {
      const result = await handymanService.getAll()
      setHandymen(result || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load handymen')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (handyman) => {
    setSelectedHandyman(handyman)
    setShowBookingModal(true)
  }

  const handleBookingConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time')
      return
    }

    try {
      const scheduledTime = new Date(`${selectedDate}T${selectedTime}`)
      const booking = await bookingService.create({
        handymanId: selectedHandyman.id,
        scheduledTime,
        status: 'confirmed',
        finalPrice: selectedHandyman.hourlyRate
      })
      
      toast.success(`Booking confirmed with ${selectedHandyman.name}!`)
      setShowBookingModal(false)
      setSelectedDate('')
      setSelectedTime('')
    } catch (err) {
      toast.error('Failed to create booking')
    }
  }

  const categories = [
    { name: 'Plumbing', icon: 'Wrench', color: 'bg-blue-500' },
    { name: 'Electrical', icon: 'Zap', color: 'bg-yellow-500' },
    { name: 'Carpentry', icon: 'Hammer', color: 'bg-amber-600' },
    { name: 'Appliance', icon: 'Settings', color: 'bg-green-500' }
  ]

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ApperIcon name="Wrench" className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                FixIt Now
              </h1>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? 'Sun' : 'Moon'} 
                className="text-surface-600 dark:text-surface-400" 
                size={20} 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white mb-6">
              Find Trusted
              <span className="text-primary block">Handymen Instantly</span>
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Connect with vetted professionals for plumbing, electrical, carpentry, and appliance repair with AI-powered price estimates
            </p>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 bg-white dark:bg-surface-800 rounded-2xl shadow-card hover:shadow-lg transition-all cursor-pointer border border-surface-200 dark:border-surface-700"
              >
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                  <ApperIcon name={category.icon} className="text-white" size={24} />
                </div>
                <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Main Feature */}
          <MainFeature />
        </div>
      </section>

      {/* Available Handymen */}
      <section className="py-16 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold text-surface-900 dark:text-white">
              Available Handymen
            </h2>
            <div className="flex items-center space-x-2 text-secondary">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse-slow"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {handymen.map((handyman, index) => (
                <motion.div
                  key={handyman.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-50 dark:bg-surface-900 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all border border-surface-200 dark:border-surface-700"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={handyman.photo}
                      alt={handyman.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                        {handyman.name}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <ApperIcon
                            key={i}
                            name="Star"
                            size={16}
                            className={i < Math.floor(handyman.rating) ? 'text-accent fill-current' : 'text-surface-300'}
                          />
                        ))}
                        <span className="text-sm text-surface-600 dark:text-surface-400 ml-2">
                          {handyman.rating} ({handyman.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {handyman.skills?.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                      ${handyman.hourlyRate}/hr
                    </div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Clock" size={16} className="inline mr-1" />
                      Available now
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookNow(handyman)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Book Now
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md glass-effect"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                  Book {selectedHandyman?.name}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-900 text-surface-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex justify-between text-lg font-semibold text-surface-900 dark:text-white">
                    <span>Total</span>
                    <span>${selectedHandyman?.hourlyRate}/hr</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookingConfirm}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
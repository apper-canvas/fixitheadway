import React, { useState, useEffect } from 'react'
      import { toast } from 'react-toastify'
      import handymanService from '@/services/api/handymanService'
      import bookingService from '@/services/api/bookingService'
      import Header from '@/components/organisms/Header'
      import HeroSection from '@/components/organisms/HeroSection'
      import AvailableHandymenSection from '@/components/organisms/AvailableHandymenSection'
      import BookingModal from '@/components/organisms/BookingModal'

      const HomePage = () => {
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
            // eslint-disable-next-line no-unused-vars
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

        return (
          <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
            <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
            <HeroSection categories={categories} />
            <AvailableHandymenSection handymen={handymen} loading={loading} error={error} onBookNow={handleBookNow} />
            
            <BookingModal
              showBookingModal={showBookingModal}
              onClose={() => setShowBookingModal(false)}
              selectedHandyman={selectedHandyman}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onConfirmBooking={handleBookingConfirm}
            />
          </div>
        )
      }

      export default HomePage
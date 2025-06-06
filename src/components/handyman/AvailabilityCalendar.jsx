import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Calendar from 'react-calendar'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const AvailabilityCalendar = ({ 
  availability, 
  onAvailabilityChange,
  className = '' 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('weekly') // 'weekly' or 'calendar'
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
  const [editingDay, setEditingDay] = useState(null)
  const [tempTimeSlots, setTempTimeSlots] = useState([])

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleDayToggle = (day) => {
    const updatedSchedule = {
      ...availability.schedule,
      [day]: {
        ...availability.schedule[day],
        available: !availability.schedule[day]?.available
      }
    }
    
    onAvailabilityChange({
      ...availability,
      schedule: updatedSchedule
    })
  }

  const handleEditTimeSlots = (day) => {
    setEditingDay(day)
    setTempTimeSlots(availability.schedule[day]?.hours || [{ start: '09:00', end: '17:00' }])
    setShowTimeSlotModal(true)
  }

  const addTimeSlot = () => {
    setTempTimeSlots([...tempTimeSlots, { start: '09:00', end: '17:00' }])
  }

  const removeTimeSlot = (index) => {
    setTempTimeSlots(tempTimeSlots.filter((_, i) => i !== index))
  }

  const updateTimeSlot = (index, field, value) => {
    const updated = tempTimeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    setTempTimeSlots(updated)
  }

  const saveTimeSlots = () => {
    if (!editingDay) return

    const updatedSchedule = {
      ...availability.schedule,
      [editingDay]: {
        available: true,
        hours: tempTimeSlots.filter(slot => slot.start && slot.end)
      }
    }
    
    onAvailabilityChange({
      ...availability,
      schedule: updatedSchedule
    })
    
    setShowTimeSlotModal(false)
    setEditingDay(null)
    setTempTimeSlots([])
  }

  const handleEmergencyAvailabilityToggle = () => {
    onAvailabilityChange({
      ...availability,
      emergencyAvailability: !availability.emergencyAvailability
    })
  }

  const handleBookingBufferChange = (value) => {
    onAvailabilityChange({
      ...availability,
      bookingBuffer: parseInt(value) || 60
    })
  }

  const handleMaxAdvanceBookingChange = (value) => {
    onAvailabilityChange({
      ...availability,
      maxAdvanceBooking: parseInt(value) || 30
    })
  }

  const addBlackoutDate = () => {
    const newBlackout = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      reason: 'Unavailable'
    }
    
    const updatedBlackoutDates = [
      ...(availability.blackoutDates || []),
      newBlackout
    ]
    
    onAvailabilityChange({
      ...availability,
      blackoutDates: updatedBlackoutDates
    })
  }

  const removeBlackoutDate = (dateStr) => {
    const updatedBlackoutDates = availability.blackoutDates?.filter(
      blackout => blackout.date !== dateStr
    ) || []
    
    onAvailabilityChange({
      ...availability,
      blackoutDates: updatedBlackoutDates
    })
  }

  const isBlackoutDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return availability.blackoutDates?.some(blackout => blackout.date === dateStr)
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (isBlackoutDate(date)) {
        return 'react-calendar__tile--unavailable'
      }
      
      const dayName = format(date, 'EEEE').toLowerCase()
      if (availability.schedule[dayName]?.available) {
        return 'react-calendar__tile--available'
      }
    }
    return ''
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
          Availability Schedule
        </h3>
        <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
          <Button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              viewMode === 'weekly'
                ? 'bg-white dark:bg-surface-800 shadow-sm text-primary'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
            }`}
          >
            Weekly View
          </Button>
          <Button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-surface-800 shadow-sm text-primary'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
            }`}
          >
            Calendar View
          </Button>
        </div>
      </div>

      {/* Weekly Schedule View */}
      {viewMode === 'weekly' && (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-600">
          <div className="p-6">
            <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
              Weekly Schedule
            </h4>
            
            <div className="space-y-3">
              {daysOfWeek.map((day, index) => {
                const daySchedule = availability.schedule[day] || { available: false, hours: [] }
                
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between py-3 px-4 bg-surface-50 dark:bg-surface-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={daySchedule.available}
                        onChange={() => handleDayToggle(day)}
                        className="w-5 h-5 text-primary border-surface-300 rounded focus:ring-primary"
                      />
                      <span className="font-medium text-surface-900 dark:text-white min-w-24">
                        {dayLabels[index]}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {daySchedule.available && daySchedule.hours?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {daySchedule.hours.map((slot, slotIndex) => (
                            <span
                              key={slotIndex}
                              className="text-sm bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {slot.start} - {slot.end}
                            </span>
                          ))}
                        </div>
                      ) : daySchedule.available ? (
                        <span className="text-sm text-surface-500 italic">
                          No time slots set
                        </span>
                      ) : (
                        <span className="text-sm text-surface-400">
                          Unavailable
                        </span>
                      )}
                      
                      {daySchedule.available && (
                        <Button
                          onClick={() => handleEditTimeSlots(day)}
                          className="text-primary hover:text-primary-dark bg-transparent p-1"
                        >
                          <ApperIcon name="Clock" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-600 p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-surface-900 dark:text-white mb-2">
              Calendar Overview
            </h4>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-surface-600 dark:text-surface-400">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-surface-600 dark:text-surface-400">Unavailable</span>
              </div>
            </div>
          </div>
          
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={tileClassName}
            className="react-calendar"
          />
          
          {/* Selected Date Actions */}
          <div className="mt-4 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
            <p className="text-sm font-medium text-surface-900 dark:text-white mb-3">
              Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            
            {!isBlackoutDate(selectedDate) ? (
              <Button
                onClick={addBlackoutDate}
                className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
              >
                <ApperIcon name="X" size={16} />
                Mark as Unavailable
              </Button>
            ) : (
              <Button
                onClick={() => removeBlackoutDate(format(selectedDate, 'yyyy-MM-dd'))}
                className="text-green-600 bg-green-50 hover:bg-green-100 border border-green-200"
              >
                <ApperIcon name="Check" size={16} />
                Mark as Available
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Availability */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-600 p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Emergency Services
          </h4>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={availability.emergencyAvailability}
              onChange={handleEmergencyAvailabilityToggle}
              className="w-5 h-5 text-primary border-surface-300 rounded focus:ring-primary"
            />
            <div>
              <span className="font-medium text-surface-900 dark:text-white">
                Available for emergencies
              </span>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Receive emergency booking requests outside normal hours
              </p>
            </div>
          </label>
        </div>

        {/* Booking Settings */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-600 p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Booking Settings
          </h4>
          
          <div className="space-y-4">
            <Input
              label="Booking Buffer (minutes)"
              type="number"
              value={availability.bookingBuffer}
              onChange={(e) => handleBookingBufferChange(e.target.value)}
              helperText="Minimum time between bookings"
              min="15"
              max="180"
            />
            
            <Input
              label="Max Advance Booking (days)"
              type="number"
              value={availability.maxAdvanceBooking}
              onChange={(e) => handleMaxAdvanceBookingChange(e.target.value)}
              helperText="How far in advance customers can book"
              min="1"
              max="365"
            />
          </div>
        </div>
      </div>

      {/* Blackout Dates */}
      {availability.blackoutDates && availability.blackoutDates.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-600 p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Blackout Dates
          </h4>
          
          <div className="space-y-2">
            {availability.blackoutDates.map((blackout, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-surface-50 dark:bg-surface-700 rounded-lg"
              >
                <span className="text-surface-900 dark:text-white">
                  {format(new Date(blackout.date), 'EEEE, MMMM d, yyyy')} - {blackout.reason}
                </span>
                <Button
                  onClick={() => removeBlackoutDate(blackout.date)}
                  className="text-red-500 hover:text-red-700 bg-transparent p-1"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Edit {editingDay && dayLabels[daysOfWeek.indexOf(editingDay)]} Schedule
                </h3>
                <Button
                  onClick={() => setShowTimeSlotModal(false)}
                  className="text-surface-400 hover:text-surface-600 bg-transparent p-1"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                {tempTimeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                      className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800"
                    />
                    <span className="text-surface-500">to</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                      className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800"
                    />
                    <Button
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-500 hover:text-red-700 bg-transparent p-1"
                      disabled={tempTimeSlots.length === 1}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={addTimeSlot}
                  className="w-full text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30"
                >
                  <ApperIcon name="Plus" size={16} />
                  Add Time Slot
                </Button>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowTimeSlotModal(false)}
                  className="bg-surface-200 text-surface-700 hover:bg-surface-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveTimeSlots}
                  className="bg-primary text-white hover:bg-primary-dark"
                >
                  Save Schedule
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AvailabilityCalendar
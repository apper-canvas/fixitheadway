import React from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import { format } from 'date-fns'
      import ApperIcon from '@/components/ApperIcon'
      import Button from '@/components/atoms/Button'
      import Input from '@/components/atoms/Input'
      import Label from '@/components/atoms/Label'
      import Text from '@/components/atoms/Text'
      import TimeSlotSelector from '@/components/molecules/TimeSlotSelector'

      const BookingModal = ({
        showBookingModal,
        onClose,
        selectedHandyman,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        onConfirmBooking
      }) => {
        const timeSlots = [
          '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
        ]

        return (
          <AnimatePresence>
            {showBookingModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={onClose}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md glass-effect"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Text type="h3" className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                      Book {selectedHandyman?.name}
                    </Text>
                    <Button onClick={onClose} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
                      <ApperIcon name="X" size={24} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2">Date</Label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Time</Label>
                      <TimeSlotSelector
                        timeSlots={timeSlots}
                        selectedTime={selectedTime}
                        onSelectTime={setSelectedTime}
                      />
                    </div>

                    <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                      <div className="flex justify-between text-lg font-semibold text-surface-900 dark:text-white">
                        <Text type="span">Total</Text>
                        <Text type="span">${selectedHandyman?.hourlyRate}/hr</Text>
                      </div>
                    </div>

                    <Button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onConfirmBooking}
                      className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-xl"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }

      export default BookingModal
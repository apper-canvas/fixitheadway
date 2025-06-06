import React from 'react'
      import Button from '@/components/atoms/Button'

      const TimeSlotSelector = ({ timeSlots, selectedTime, onSelectTime }) => {
        return (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                onClick={() => onSelectTime(time)}
                className={`p-2 rounded-lg text-sm font-medium ${
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {time}
              </Button>
            ))}
          </div>
        )
      }

      export default TimeSlotSelector
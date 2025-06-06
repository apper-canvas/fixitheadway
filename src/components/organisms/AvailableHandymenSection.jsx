import React from 'react'
      import { AnimatePresence } from 'framer-motion'
      import SectionHeader from '@/components/molecules/SectionHeader'
      import HandymanCard from '@/components/molecules/HandymanCard'
      import Text from '@/components/atoms/Text'

      const AvailableHandymenSection = ({ handymen, loading, error, onBookNow }) => {
        return (
          <section className="py-16 bg-white dark:bg-surface-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Available Handymen" showLiveUpdates />

              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <Text className="text-red-500">{error}</Text>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {handymen.map((handyman, index) => (
                    <HandymanCard key={handyman.id} handyman={handyman} onBookNow={onBookNow} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>
        )
      }

      export default AvailableHandymenSection
import React from 'react'
      import Text from '@/components/atoms/Text'
      import CategoryCard from '@/components/molecules/CategoryCard'
      import FeatureSection from '@/components/organisms/FeatureSection'

      const HeroSection = ({ categories }) => {
        return (
          <section className="py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Text type="h1" className="text-4xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white mb-6">
                  Find Trusted
                  <Text type="span" className="text-primary block">Handymen Instantly</Text>
                </Text>
                <Text className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                  Connect with vetted professionals for plumbing, electrical, carpentry, and appliance repair with AI-powered price estimates
                </Text>
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {categories.map((category) => (
                  <CategoryCard key={category.name} category={category} />
                ))}
              </div>

              {/* Main Feature */}
              <FeatureSection />
            </div>
          </section>
        )
      }

      export default HeroSection
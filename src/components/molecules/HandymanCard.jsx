import React from 'react'
      import Card from '@/components/atoms/Card'
      import Button from '@/components/atoms/Button'
      import Text from '@/components/atoms/Text'
      import Badge from '@/components/atoms/Badge'
      import RatingStars from '@/components/atoms/RatingStars'
      import ApperIcon from '@/components/ApperIcon'

      const HandymanCard = ({ handyman, onBookNow, index }) => {
        return (
          <Card
            key={handyman.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-lg"
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={handyman.photo}
                alt={handyman.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <Text type="h3" className="font-heading font-semibold text-surface-900 dark:text-white">
                  {handyman.name}
                </Text>
                <RatingStars rating={handyman.rating} reviewCount={handyman.reviewCount} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {handyman.skills?.slice(0, 3).map((skill) => (
                <Badge key={skill} className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <Text type="div" className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                ${handyman.hourlyRate}/hr
              </Text>
              <Text type="div" className="text-sm text-surface-600 dark:text-surface-400">
                <ApperIcon name="Clock" size={16} className="inline mr-1" />
                Available now
              </Text>
            </div>

            <Button
              onClick={() => onBookNow(handyman)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl"
            >
              Book Now
            </Button>
          </Card>
        )
      }

      export default HandymanCard
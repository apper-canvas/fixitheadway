import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const ServiceAreaSelector = ({ 
  serviceArea, 
  onServiceAreaChange,
  className = '' 
}) => {
  const [areaType, setAreaType] = useState(serviceArea?.type || 'radius')
  const [address, setAddress] = useState(serviceArea?.center?.address || '')
  const [radius, setRadius] = useState(serviceArea?.radius || 10)
  const [zipCodes, setZipCodes] = useState(serviceArea?.zipcodes?.join(', ') || '')
  const [cities, setCities] = useState(serviceArea?.cities?.join(', ') || '')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock geocoding function (in real app, would use Mapbox/Google Geocoding API)
  const mockGeocode = async (query) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock results based on query
    const mockResults = [
      {
        address: 'Downtown District, New York, NY',
        lat: 40.7589,
        lng: -73.9851,
        city: 'New York',
        state: 'NY',
        zipcode: '10001'
      },
      {
        address: 'Midtown Area, New York, NY',
        lat: 40.7549,
        lng: -73.9840,
        city: 'New York',
        state: 'NY',
        zipcode: '10018'
      },
      {
        address: 'Upper East Side, New York, NY',
        lat: 40.7736,
        lng: -73.9566,
        city: 'New York',
        state: 'NY',
        zipcode: '10021'
      }
    ].filter(result => 
      result.address.toLowerCase().includes(query.toLowerCase()) ||
      result.city.toLowerCase().includes(query.toLowerCase())
    )

    return mockResults
  }

  const handleAddressSearch = async (query) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await mockGeocode(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Geocoding error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectAddress = (result) => {
    setAddress(result.address)
    setSearchResults([])
    
    const updatedServiceArea = {
      ...serviceArea,
      type: areaType,
      center: {
        lat: result.lat,
        lng: result.lng,
        address: result.address
      }
    }
    
    onServiceAreaChange(updatedServiceArea)
  }

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius)
    const updatedServiceArea = {
      ...serviceArea,
      radius: parseInt(newRadius),
      type: 'radius'
    }
    onServiceAreaChange(updatedServiceArea)
  }

  const handleZipCodesChange = (value) => {
    setZipCodes(value)
    const zipArray = value.split(',').map(zip => zip.trim()).filter(zip => zip)
    
    const updatedServiceArea = {
      ...serviceArea,
      type: 'zipcodes',
      zipcodes: zipArray
    }
    onServiceAreaChange(updatedServiceArea)
  }

  const handleCitiesChange = (value) => {
    setCities(value)
    const citiesArray = value.split(',').map(city => city.trim()).filter(city => city)
    
    const updatedServiceArea = {
      ...serviceArea,
      type: 'cities',
      cities: citiesArray
    }
    onServiceAreaChange(updatedServiceArea)
  }

  const areaTypes = [
    { 
      type: 'radius', 
      label: 'Radius from Location', 
      icon: 'Target',
      description: 'Service within a specific radius from your location'
    },
    { 
      type: 'zipcodes', 
      label: 'Specific ZIP Codes', 
      icon: 'MapPin',
      description: 'Service only in specific ZIP codes'
    },
    { 
      type: 'cities', 
      label: 'Specific Cities', 
      icon: 'Building',
      description: 'Service in specific cities or areas'
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Service Area Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          Service Area Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areaTypes.map((type) => (
            <motion.button
              key={type.type}
              type="button"
              onClick={() => setAreaType(type.type)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all duration-200
                ${areaType === type.type
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-primary/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <ApperIcon 
                  name={type.icon} 
                  size={24} 
                  className={areaType === type.type ? 'text-primary' : 'text-surface-400'} 
                />
                <div>
                  <h4 className="font-semibold text-sm">{type.label}</h4>
                  <p className="text-xs mt-1 opacity-80">{type.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Base Location (for radius type) */}
      {(areaType === 'radius') && (
        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Base Location
          </h4>
          
          <div className="relative">
            <Input
              label="Search for your address or location"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                handleAddressSearch(e.target.value)
              }}
              placeholder="Enter your business address..."
              rightIcon={isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : (
                <ApperIcon name="Search" size={20} />
              )}
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectAddress(result)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700 border-b border-surface-100 dark:border-surface-600 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="MapPin" size={16} className="text-surface-400" />
                      <span className="text-surface-900 dark:text-white">{result.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Radius Selector */}
          {address && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Service Radius: {radius} miles
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={radius}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  className="flex-1 h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer"
                />
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={radius}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between text-xs text-surface-500 mt-1">
                <span>5 miles</span>
                <span>50 miles</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ZIP Codes Input */}
      {areaType === 'zipcodes' && (
        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Service ZIP Codes
          </h4>
          <Input
            label="ZIP Codes (comma-separated)"
            value={zipCodes}
            onChange={(e) => handleZipCodesChange(e.target.value)}
            placeholder="10001, 10002, 10003..."
            helperText="Enter the ZIP codes where you provide services, separated by commas"
          />
        </div>
      )}

      {/* Cities Input */}
      {areaType === 'cities' && (
        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
          <h4 className="font-semibold text-surface-900 dark:text-white mb-4">
            Service Cities/Areas
          </h4>
          <Input
            label="Cities or Areas (comma-separated)"
            value={cities}
            onChange={(e) => handleCitiesChange(e.target.value)}
            placeholder="New York, Brooklyn, Queens..."
            helperText="Enter the cities or areas where you provide services, separated by commas"
          />
        </div>
      )}

      {/* Service Area Preview */}
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl p-6">
        <h4 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
          <ApperIcon name="Map" size={20} className="mr-2" />
          Service Area Preview
        </h4>
        
        <div className="space-y-3">
          {areaType === 'radius' && address && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Type:</strong> Radius-based service
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Center:</strong> {address}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Radius:</strong> {radius} miles
              </p>
            </div>
          )}
          
          {areaType === 'zipcodes' && zipCodes && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Type:</strong> Specific ZIP codes
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>ZIP Codes:</strong> {zipCodes}
              </p>
            </div>
          )}
          
          {areaType === 'cities' && cities && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Type:</strong> Specific cities/areas
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <strong>Areas:</strong> {cities}
              </p>
            </div>
          )}

          {!address && areaType === 'radius' && (
            <p className="text-sm text-surface-500 italic">
              Please select a base location to see preview
            </p>
          )}
          
          {!zipCodes && areaType === 'zipcodes' && (
            <p className="text-sm text-surface-500 italic">
              Please enter ZIP codes to see preview
            </p>
          )}
          
          {!cities && areaType === 'cities' && (
            <p className="text-sm text-surface-500 italic">
              Please enter cities/areas to see preview
            </p>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="mt-4 h-48 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="Map" size={48} className="text-surface-400 mx-auto mb-2" />
            <p className="text-sm text-surface-500">
              Interactive map will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceAreaSelector
import handymenData from '../mockData/handymen.json'

class HandymanService {
  constructor() {
    this.handymen = [...handymenData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.handymen]
  }

  async getById(id) {
    await this.delay(200)
    const handyman = this.handymen.find(h => h.id === id)
    return handyman ? { ...handyman } : null
  }

  async create(handymanData) {
    await this.delay(400)
    const newHandyman = {
      ...handymanData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.handymen.unshift(newHandyman)
    return { ...newHandyman }
  }

  async update(id, updateData) {
    await this.delay(350)
    const index = this.handymen.findIndex(h => h.id === id)
    if (index === -1) {
      throw new Error('Handyman not found')
    }
    
    this.handymen[index] = { ...this.handymen[index], ...updateData }
    return { ...this.handymen[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.handymen.findIndex(h => h.id === id)
    if (index === -1) {
      throw new Error('Handyman not found')
    }
    
    this.handymen.splice(index, 1)
    return true
}

  // Search handymen with filters
  async search(filters = {}) {
    await this.delay(400)
    
    let results = [...this.handymen]

    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(handyman => 
        handyman.skills.some(skill => 
          filters.skills.includes(skill)
        )
      )
    }

    // Filter by location/radius (simplified)
    if (filters.location && filters.radius) {
      results = results.filter(handyman => {
        if (!handyman.location) return false
        
        // Simple distance check (would use proper geocoding in real app)
        const distance = this.calculateDistance(
          filters.location.lat,
          filters.location.lng,
          handyman.location.lat,
          handyman.location.lng
        )
        
        return distance <= filters.radius
      })
    }

    // Filter by hourly rate range
    if (filters.minRate || filters.maxRate) {
      results = results.filter(handyman => {
        const rate = handyman.hourlyRate
        if (filters.minRate && rate < filters.minRate) return false
        if (filters.maxRate && rate > filters.maxRate) return false
        return true
      })
    }

    // Filter by rating
    if (filters.minRating) {
      results = results.filter(handyman => handyman.rating >= filters.minRating)
    }

    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      results = results.filter(handyman => 
        handyman.availability.some(slot => 
          filters.availability.includes(slot)
        )
      )
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.rating - a.rating
          case 'price':
            return a.hourlyRate - b.hourlyRate
          case 'reviews':
            return b.reviewCount - a.reviewCount
          default:
            return 0
        }
      })
    }

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      handymen: results.slice(startIndex, endIndex),
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
      hasMore: endIndex < results.length
    }
  }

  // Get available skills for filtering
  async getAvailableSkills() {
    await this.delay(200)
    const skills = new Set()
    
    this.handymen.forEach(handyman => {
      handyman.skills.forEach(skill => skills.add(skill))
    })
    
    return Array.from(skills).sort()
  }

  // Calculate distance between two points (simplified)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new HandymanService()
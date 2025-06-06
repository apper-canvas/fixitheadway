import { delay } from '../utils'

// Mock handyman profiles data
let handymanProfiles = [
  {
    id: 'hp1',
    userId: 'user1',
    profileType: 'handyman',
    personalInfo: {
      firstName: 'Mike',
      lastName: 'Rodriguez',
      email: 'mike@example.com',
      phone: '+1-555-0123',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      bio: 'Experienced plumber and electrician with over 10 years in the field. Specialized in emergency repairs and installations.',
      dateOfBirth: '1985-03-15',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    professionalInfo: {
      businessName: 'Rodriguez Plumbing & Electric',
      licenseNumber: 'PL12345',
      insuranceNumber: 'INS98765',
      yearsOfExperience: 10,
      website: 'https://rodriguezplumbing.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/mikerodriguez',
        facebook: 'https://facebook.com/rodriguezplumbing'
      }
    },
    skills: [
      { 
        id: 'skill1', 
        name: 'Plumbing', 
        category: 'Main Trade', 
        level: 'Expert',
        yearsOfExperience: 10,
        certifications: ['Master Plumber License', 'Backflow Prevention']
      },
      { 
        id: 'skill2', 
        name: 'Electrical', 
        category: 'Secondary Trade', 
        level: 'Advanced',
        yearsOfExperience: 7,
        certifications: ['Electrical License Class A']
      },
      { 
        id: 'skill3', 
        name: 'General Repair', 
        category: 'Additional Services', 
        level: 'Intermediate',
        yearsOfExperience: 5,
        certifications: []
      }
    ],
    services: [
      {
        id: 'service1',
        name: 'Emergency Plumbing',
        category: 'Plumbing',
        description: 'Fast response emergency plumbing services 24/7',
        basePrice: 150,
        hourlyRate: 85,
        estimatedDuration: '1-3 hours',
        isEmergencyService: true,
        materials: ['Basic plumbing supplies', 'Emergency repair kit']
      },
      {
        id: 'service2',
        name: 'Electrical Installation',
        category: 'Electrical',
        description: 'Professional electrical installations and repairs',
        basePrice: 200,
        hourlyRate: 90,
        estimatedDuration: '2-4 hours',
        isEmergencyService: false,
        materials: ['Electrical components', 'Safety equipment']
      }
    ],
    serviceArea: {
      type: 'radius',
      center: {
        lat: 40.7589,
        lng: -73.9851,
        address: 'Downtown District, New York, NY'
      },
      radius: 25, // miles
      zipcodes: ['10001', '10002', '10003', '10004', '10005'],
      cities: ['New York', 'Brooklyn', 'Queens']
    },
    availability: {
      schedule: {
        monday: { available: true, hours: [{ start: '08:00', end: '18:00' }] },
        tuesday: { available: true, hours: [{ start: '08:00', end: '18:00' }] },
        wednesday: { available: true, hours: [{ start: '08:00', end: '18:00' }] },
        thursday: { available: true, hours: [{ start: '08:00', end: '18:00' }] },
        friday: { available: true, hours: [{ start: '08:00', end: '18:00' }] },
        saturday: { available: true, hours: [{ start: '09:00', end: '15:00' }] },
        sunday: { available: false, hours: [] }
      },
      emergencyAvailability: true,
      bookingBuffer: 60, // minutes
      maxAdvanceBooking: 30, // days
      blackoutDates: [
        { date: '2024-12-25', reason: 'Holiday' },
        { date: '2024-01-01', reason: 'Holiday' }
      ]
    },
    pricing: {
      hourlyRate: 85,
      minimumCharge: 150,
      emergencyRate: 125,
      travelFee: 25,
      cancellationPolicy: {
        freeUntil: 24, // hours
        partialRefundUntil: 12, // hours
        noRefundAfter: 2 // hours
      }
    },
    portfolio: [
      {
        id: 'portfolio1',
        title: 'Kitchen Sink Installation',
        description: 'Complete kitchen sink and disposal installation',
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400',
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400'
        ],
        completedDate: '2024-01-15',
        serviceType: 'Plumbing',
        customerReview: {
          rating: 5,
          comment: 'Excellent work, very professional and clean.'
        }
      },
      {
        id: 'portfolio2',
        title: 'Bathroom Lighting Upgrade',
        description: 'LED lighting installation in master bathroom',
        images: [
          'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400'
        ],
        completedDate: '2024-01-10',
        serviceType: 'Electrical',
        customerReview: {
          rating: 5,
          comment: 'Beautiful lighting, exactly what we wanted.'
        }
      }
    ],
    certifications: [
      {
        id: 'cert1',
        name: 'Master Plumber License',
        issuingAuthority: 'New York State',
        issueDate: '2018-06-15',
        expiryDate: '2025-06-15',
        certificateNumber: 'MP-12345',
        document: 'master-plumber-cert.pdf',
        verified: true
      },
      {
        id: 'cert2',
        name: 'Electrical License Class A',
        issuingAuthority: 'New York State',
        issueDate: '2019-03-20',
        expiryDate: '2024-03-20',
        certificateNumber: 'EL-A-67890',
        document: 'electrical-cert.pdf',
        verified: true
      }
    ],
    verification: {
      status: 'verified',
      verifiedAt: '2024-01-01T00:00:00Z',
      backgroundCheck: {
        status: 'passed',
        completedAt: '2024-01-01T00:00:00Z',
        provider: 'SecureCheck Inc.'
      },
      identityCheck: {
        status: 'passed',
        completedAt: '2024-01-01T00:00:00Z'
      },
      licenseVerification: {
        status: 'verified',
        completedAt: '2024-01-01T00:00:00Z'
      },
      insuranceVerification: {
        status: 'verified',
        completedAt: '2024-01-01T00:00:00Z'
      }
    },
    rating: 4.8,
    totalReviews: 127,
    totalJobs: 342,
    joinDate: '2022-03-15',
    lastActive: '2024-01-20T10:30:00Z',
    isActive: true,
    subscriptionTier: 'premium'
  }
]

const handymanProfileService = {
  // Get handyman profile by user ID
  async getProfile(userId) {
    await delay(300)
    const profile = handymanProfiles.find(p => p.userId === userId)
    return profile ? { ...profile } : null
  },

  // Get handyman profile by profile ID
  async getProfileById(profileId) {
    await delay(300)
    const profile = handymanProfiles.find(p => p.id === profileId)
    return profile ? { ...profile } : null
  },

  // Create new handyman profile
  async createProfile(userId, profileData) {
    await delay(500)
    
    // Check if profile already exists
    const existingProfile = handymanProfiles.find(p => p.userId === userId)
    if (existingProfile) {
      throw new Error('Handyman profile already exists for this user')
    }

    const newProfile = {
      id: `hp${Date.now()}`,
      userId,
      profileType: 'handyman',
      personalInfo: {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        avatar: profileData.avatar || '',
        bio: profileData.bio || '',
        dateOfBirth: profileData.dateOfBirth || '',
        address: profileData.address || {}
      },
      professionalInfo: {
        businessName: profileData.businessName || '',
        licenseNumber: profileData.licenseNumber || '',
        insuranceNumber: profileData.insuranceNumber || '',
        yearsOfExperience: profileData.yearsOfExperience || 0,
        website: profileData.website || '',
        socialMedia: profileData.socialMedia || {}
      },
      skills: profileData.skills || [],
      services: profileData.services || [],
      serviceArea: profileData.serviceArea || {
        type: 'radius',
        center: { lat: 0, lng: 0, address: '' },
        radius: 10,
        zipcodes: [],
        cities: []
      },
      availability: profileData.availability || {
        schedule: {
          monday: { available: false, hours: [] },
          tuesday: { available: false, hours: [] },
          wednesday: { available: false, hours: [] },
          thursday: { available: false, hours: [] },
          friday: { available: false, hours: [] },
          saturday: { available: false, hours: [] },
          sunday: { available: false, hours: [] }
        },
        emergencyAvailability: false,
        bookingBuffer: 60,
        maxAdvanceBooking: 30,
        blackoutDates: []
      },
      pricing: profileData.pricing || {
        hourlyRate: 50,
        minimumCharge: 100,
        emergencyRate: 75,
        travelFee: 15,
        cancellationPolicy: {
          freeUntil: 24,
          partialRefundUntil: 12,
          noRefundAfter: 2
        }
      },
      portfolio: [],
      certifications: profileData.certifications || [],
      verification: {
        status: 'pending',
        verifiedAt: null,
        backgroundCheck: { status: 'pending' },
        identityCheck: { status: 'pending' },
        licenseVerification: { status: 'pending' },
        insuranceVerification: { status: 'pending' }
      },
      rating: 0,
      totalReviews: 0,
      totalJobs: 0,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isActive: false,
      subscriptionTier: 'basic'
    }

    handymanProfiles.unshift(newProfile)
    return { ...newProfile }
  },

  // Update handyman profile
  async updateProfile(profileId, updates) {
    await delay(400)
    
    const index = handymanProfiles.findIndex(p => p.id === profileId)
    if (index === -1) {
      throw new Error('Handyman profile not found')
    }

    // Deep merge updates
    const profile = handymanProfiles[index]
    const updatedProfile = {
      ...profile,
      ...updates,
      personalInfo: { ...profile.personalInfo, ...updates.personalInfo },
      professionalInfo: { ...profile.professionalInfo, ...updates.professionalInfo },
      serviceArea: { ...profile.serviceArea, ...updates.serviceArea },
      availability: { ...profile.availability, ...updates.availability },
      pricing: { ...profile.pricing, ...updates.pricing },
      verification: { ...profile.verification, ...updates.verification }
    }

    handymanProfiles[index] = updatedProfile
    return { ...updatedProfile }
  },

  // Add skill to profile
  async addSkill(profileId, skill) {
    await delay(300)
    
    const profile = await this.getProfileById(profileId)
    if (!profile) {
      throw new Error('Handyman profile not found')
    }

    const newSkill = {
      id: `skill${Date.now()}`,
      name: skill.name,
      category: skill.category,
      level: skill.level || 'Beginner',
      yearsOfExperience: skill.yearsOfExperience || 0,
      certifications: skill.certifications || []
    }

    const index = handymanProfiles.findIndex(p => p.id === profileId)
    handymanProfiles[index].skills.push(newSkill)
    
    return newSkill
  },

  // Update skill
  async updateSkill(profileId, skillId, updates) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const skillIndex = handymanProfiles[profileIndex].skills.findIndex(s => s.id === skillId)
    if (skillIndex === -1) {
      throw new Error('Skill not found')
    }

    handymanProfiles[profileIndex].skills[skillIndex] = {
      ...handymanProfiles[profileIndex].skills[skillIndex],
      ...updates
    }

    return handymanProfiles[profileIndex].skills[skillIndex]
  },

  // Remove skill
  async removeSkill(profileId, skillId) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const skillIndex = handymanProfiles[profileIndex].skills.findIndex(s => s.id === skillId)
    if (skillIndex === -1) {
      throw new Error('Skill not found')
    }

    handymanProfiles[profileIndex].skills.splice(skillIndex, 1)
    return true
  },

  // Add service to profile
  async addService(profileId, service) {
    await delay(300)
    
    const profile = await this.getProfileById(profileId)
    if (!profile) {
      throw new Error('Handyman profile not found')
    }

    const newService = {
      id: `service${Date.now()}`,
      name: service.name,
      category: service.category,
      description: service.description || '',
      basePrice: service.basePrice || 0,
      hourlyRate: service.hourlyRate || 50,
      estimatedDuration: service.estimatedDuration || '1-2 hours',
      isEmergencyService: service.isEmergencyService || false,
      materials: service.materials || []
    }

    const index = handymanProfiles.findIndex(p => p.id === profileId)
    handymanProfiles[index].services.push(newService)
    
    return newService
  },

  // Update service
  async updateService(profileId, serviceId, updates) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const serviceIndex = handymanProfiles[profileIndex].services.findIndex(s => s.id === serviceId)
    if (serviceIndex === -1) {
      throw new Error('Service not found')
    }

    handymanProfiles[profileIndex].services[serviceIndex] = {
      ...handymanProfiles[profileIndex].services[serviceIndex],
      ...updates
    }

    return handymanProfiles[profileIndex].services[serviceIndex]
  },

  // Remove service
  async removeService(profileId, serviceId) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const serviceIndex = handymanProfiles[profileIndex].services.findIndex(s => s.id === serviceId)
    if (serviceIndex === -1) {
      throw new Error('Service not found')
    }

    handymanProfiles[profileIndex].services.splice(serviceIndex, 1)
    return true
  },

  // Update availability
  async updateAvailability(profileId, availability) {
    await delay(300)
    
    const index = handymanProfiles.findIndex(p => p.id === profileId)
    if (index === -1) {
      throw new Error('Handyman profile not found')
    }

    handymanProfiles[index].availability = {
      ...handymanProfiles[index].availability,
      ...availability
    }

    return handymanProfiles[index].availability
  },

  // Add portfolio item
  async addPortfolioItem(profileId, portfolioItem) {
    await delay(300)
    
    const profile = await this.getProfileById(profileId)
    if (!profile) {
      throw new Error('Handyman profile not found')
    }

    const newItem = {
      id: `portfolio${Date.now()}`,
      title: portfolioItem.title,
      description: portfolioItem.description || '',
      images: portfolioItem.images || [],
      completedDate: portfolioItem.completedDate || new Date().toISOString(),
      serviceType: portfolioItem.serviceType,
      customerReview: portfolioItem.customerReview || null
    }

    const index = handymanProfiles.findIndex(p => p.id === profileId)
    handymanProfiles[index].portfolio.push(newItem)
    
    return newItem
  },

  // Update portfolio item
  async updatePortfolioItem(profileId, itemId, updates) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const itemIndex = handymanProfiles[profileIndex].portfolio.findIndex(item => item.id === itemId)
    if (itemIndex === -1) {
      throw new Error('Portfolio item not found')
    }

    handymanProfiles[profileIndex].portfolio[itemIndex] = {
      ...handymanProfiles[profileIndex].portfolio[itemIndex],
      ...updates
    }

    return handymanProfiles[profileIndex].portfolio[itemIndex]
  },

  // Remove portfolio item
  async removePortfolioItem(profileId, itemId) {
    await delay(300)
    
    const profileIndex = handymanProfiles.findIndex(p => p.id === profileId)
    if (profileIndex === -1) {
      throw new Error('Handyman profile not found')
    }

    const itemIndex = handymanProfiles[profileIndex].portfolio.findIndex(item => item.id === itemId)
    if (itemIndex === -1) {
      throw new Error('Portfolio item not found')
    }

    handymanProfiles[profileIndex].portfolio.splice(itemIndex, 1)
    return true
  },

  // Add certification
  async addCertification(profileId, certification) {
    await delay(300)
    
    const profile = await this.getProfileById(profileId)
    if (!profile) {
      throw new Error('Handyman profile not found')
    }

    const newCert = {
      id: `cert${Date.now()}`,
      name: certification.name,
      issuingAuthority: certification.issuingAuthority,
      issueDate: certification.issueDate,
      expiryDate: certification.expiryDate,
      certificateNumber: certification.certificateNumber || '',
      document: certification.document || null,
      verified: false
    }

    const index = handymanProfiles.findIndex(p => p.id === profileId)
    handymanProfiles[index].certifications.push(newCert)
    
    return newCert
  },

  // Search handymen
  async searchHandymen(filters = {}) {
    await delay(400)
    
    let results = [...handymanProfiles]

    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(profile => 
        profile.skills.some(skill => 
          filters.skills.includes(skill.name)
        )
      )
    }

    // Filter by services
    if (filters.services && filters.services.length > 0) {
      results = results.filter(profile => 
        profile.services.some(service => 
          filters.services.includes(service.category) || 
          filters.services.includes(service.name)
        )
      )
    }

    // Filter by location/radius
    if (filters.location && filters.radius) {
      results = results.filter(profile => {
        if (!profile.serviceArea.center) return false
        
        // Simple distance calculation (would use proper geocoding in real app)
        const distance = this.calculateDistance(
          filters.location.lat,
          filters.location.lng,
          profile.serviceArea.center.lat,
          profile.serviceArea.center.lng
        )
        
        return distance <= (filters.radius || profile.serviceArea.radius)
      })
    }

    // Filter by hourly rate range
    if (filters.minRate || filters.maxRate) {
      results = results.filter(profile => {
        const rate = profile.pricing.hourlyRate
        if (filters.minRate && rate < filters.minRate) return false
        if (filters.maxRate && rate > filters.maxRate) return false
        return true
      })
    }

    // Filter by rating
    if (filters.minRating) {
      results = results.filter(profile => profile.rating >= filters.minRating)
    }

    // Filter by availability
    if (filters.availability) {
      results = results.filter(profile => {
        if (filters.availability === 'emergency') {
          return profile.availability.emergencyAvailability
        }
        return profile.isActive
      })
    }

    // Filter by verification status
    if (filters.verified) {
      results = results.filter(profile => profile.verification.status === 'verified')
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.rating - a.rating
          case 'price':
            return a.pricing.hourlyRate - b.pricing.hourlyRate
          case 'experience':
            return b.professionalInfo.yearsOfExperience - a.professionalInfo.yearsOfExperience
          case 'reviews':
            return b.totalReviews - a.totalReviews
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
  },

  // Get available skills/services for autocomplete
  async getSkillsAndServices() {
    await delay(200)
    
    const allSkills = new Set()
    const allServices = new Set()
    const skillCategories = new Set()
    const serviceCategories = new Set()

    handymanProfiles.forEach(profile => {
      profile.skills.forEach(skill => {
        allSkills.add(skill.name)
        skillCategories.add(skill.category)
      })
      
      profile.services.forEach(service => {
        allServices.add(service.name)
        serviceCategories.add(service.category)
      })
    })

    return {
      skills: Array.from(allSkills).sort(),
      services: Array.from(allServices).sort(),
      skillCategories: Array.from(skillCategories).sort(),
      serviceCategories: Array.from(serviceCategories).sort(),
      predefinedSkills: [
        { name: 'Plumbing', category: 'Main Trade' },
        { name: 'Electrical', category: 'Main Trade' },
        { name: 'Carpentry', category: 'Main Trade' },
        { name: 'HVAC', category: 'Main Trade' },
        { name: 'Appliance Repair', category: 'Main Trade' },
        { name: 'Painting', category: 'Home Improvement' },
        { name: 'Drywall', category: 'Home Improvement' },
        { name: 'Flooring', category: 'Home Improvement' },
        { name: 'Roofing', category: 'Exterior' },
        { name: 'Landscaping', category: 'Exterior' },
        { name: 'General Repair', category: 'Additional Services' },
        { name: 'Assembly', category: 'Additional Services' }
      ],
      predefinedServices: [
        { name: 'Emergency Plumbing', category: 'Plumbing' },
        { name: 'Pipe Repair', category: 'Plumbing' },
        { name: 'Drain Cleaning', category: 'Plumbing' },
        { name: 'Electrical Installation', category: 'Electrical' },
        { name: 'Outlet Repair', category: 'Electrical' },
        { name: 'Light Installation', category: 'Electrical' },
        { name: 'Furniture Assembly', category: 'Carpentry' },
        { name: 'Cabinet Installation', category: 'Carpentry' },
        { name: 'Appliance Installation', category: 'Appliance Repair' },
        { name: 'AC Repair', category: 'HVAC' },
        { name: 'Heating Repair', category: 'HVAC' }
      ]
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(profileId, file) {
    await delay(500)
    
    // In real app, would upload to cloud storage
    const mockUrl = `https://api.example.com/uploads/profiles/${profileId}/${Date.now()}.jpg`
    
    const index = handymanProfiles.findIndex(p => p.id === profileId)
    if (index === -1) {
      throw new Error('Handyman profile not found')
    }

    handymanProfiles[index].personalInfo.avatar = mockUrl
    
    return { url: mockUrl }
  },

  // Upload portfolio images
  async uploadPortfolioImages(profileId, files) {
    await delay(700)
    
    // In real app, would upload to cloud storage
    const urls = files.map((file, index) => 
      `https://api.example.com/uploads/portfolio/${profileId}/${Date.now()}_${index}.jpg`
    )
    
    return { urls }
  },

  // Upload certification document
  async uploadCertificationDocument(profileId, file) {
    await delay(600)
    
    // In real app, would upload to cloud storage
    const url = `https://api.example.com/uploads/certifications/${profileId}/${Date.now()}.pdf`
    
    return { url }
  },

  // Helper function to calculate distance between two points
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
}

export default handymanProfileService
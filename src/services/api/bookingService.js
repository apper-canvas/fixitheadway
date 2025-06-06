import bookingsData from '../mockData/bookings.json'

class BookingService {
  constructor() {
    this.bookings = [...bookingsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.bookings]
  }

  async getById(id) {
    await this.delay(200)
    const booking = this.bookings.find(b => b.id === id)
    return booking ? { ...booking } : null
  }

  async create(bookingData) {
    await this.delay(450)
    const newBooking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      messages: []
    }
    this.bookings.unshift(newBooking)
    return { ...newBooking }
  }

  async update(id, updateData) {
    await this.delay(350)
    const index = this.bookings.findIndex(b => b.id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    
    this.bookings[index] = { ...this.bookings[index], ...updateData }
    return { ...this.bookings[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.bookings.findIndex(b => b.id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    
    this.bookings.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new BookingService()
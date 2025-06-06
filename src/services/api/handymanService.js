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

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new HandymanService()
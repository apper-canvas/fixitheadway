import tasksData from '../mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay(200)
    const task = this.tasks.find(t => t.id === id)
    return task ? { ...task } : null
  }

  async create(taskData) {
    await this.delay(400)
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await this.delay(350)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
return true
  }

  async getPriceBreakdown(taskId) {
    await this.delay(350)
    const task = this.tasks.find(t => t.id === taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    // Generate realistic price breakdown based on task category
    const breakdowns = {
      plumbing: {
        labor: [
          { task: 'Diagnostic & Assessment', hours: 1, hourlyRate: 85, total: 85 },
          { task: 'Pipe Repair/Replacement', hours: 2.5, hourlyRate: 85, total: 212.50 },
          { task: 'Testing & Cleanup', hours: 0.5, hourlyRate: 85, total: 42.50 }
        ],
        materials: [
          { name: 'PVC Pipe (6ft)', quantity: 3, unit: 'piece', unitPrice: 12.99, total: 38.97 },
          { name: 'Pipe Fittings', quantity: 5, unit: 'piece', unitPrice: 4.50, total: 22.50 },
          { name: 'Pipe Cement', quantity: 1, unit: 'tube', unitPrice: 8.99, total: 8.99 }
        ],
        fees: [
          { name: 'Service Call Fee', description: 'Initial consultation and travel', amount: 50 },
          { name: 'Disposal Fee', description: 'Proper disposal of old materials', amount: 25 }
        ]
      },
      electrical: {
        labor: [
          { task: 'Safety Assessment', hours: 0.5, hourlyRate: 95, total: 47.50 },
          { task: 'Wiring Installation', hours: 3, hourlyRate: 95, total: 285 },
          { task: 'Testing & Code Compliance', hours: 1, hourlyRate: 95, total: 95 }
        ],
        materials: [
          { name: '12 AWG Wire', quantity: 50, unit: 'ft', unitPrice: 1.25, total: 62.50 },
          { name: 'Circuit Breaker', quantity: 1, unit: 'piece', unitPrice: 35.99, total: 35.99 },
          { name: 'Electrical Box', quantity: 2, unit: 'piece', unitPrice: 12.50, total: 25.00 }
        ],
        fees: [
          { name: 'Permit Fee', description: 'Electrical work permit (if required)', amount: 75 },
          { name: 'Inspection Fee', description: 'Professional safety inspection', amount: 40 }
        ]
      },
      carpentry: {
        labor: [
          { task: 'Measurement & Planning', hours: 1, hourlyRate: 75, total: 75 },
          { task: 'Cutting & Assembly', hours: 4, hourlyRate: 75, total: 300 },
          { task: 'Finishing & Installation', hours: 2, hourlyRate: 75, total: 150 }
        ],
        materials: [
          { name: 'Premium Wood Boards', quantity: 8, unit: 'piece', unitPrice: 25.99, total: 207.92 },
          { name: 'Wood Screws', quantity: 1, unit: 'box', unitPrice: 12.99, total: 12.99 },
          { name: 'Wood Stain', quantity: 1, unit: 'quart', unitPrice: 18.99, total: 18.99 }
        ],
        fees: [
          { name: 'Tool Usage Fee', description: 'Specialized carpentry tools', amount: 30 },
          { name: 'Waste Removal', description: 'Cleanup and debris removal', amount: 45 }
        ]
      },
      appliance: {
        labor: [
          { task: 'Diagnostic Testing', hours: 1, hourlyRate: 80, total: 80 },
          { task: 'Component Replacement', hours: 2, hourlyRate: 80, total: 160 },
          { task: 'Calibration & Testing', hours: 0.5, hourlyRate: 80, total: 40 }
        ],
        materials: [
          { name: 'Replacement Parts', quantity: 1, unit: 'set', unitPrice: 85.99, total: 85.99 },
          { name: 'Gaskets & Seals', quantity: 3, unit: 'piece', unitPrice: 8.99, total: 26.97 },
          { name: 'Lubricant', quantity: 1, unit: 'bottle', unitPrice: 12.99, total: 12.99 }
        ],
        fees: [
          { name: 'Diagnostic Fee', description: 'Comprehensive appliance assessment', amount: 65 },
          { name: 'Warranty Registration', description: 'Parts and labor warranty setup', amount: 15 }
        ]
      }
    }

    const categoryBreakdown = breakdowns[task.category] || breakdowns.plumbing
    
    const laborTotal = categoryBreakdown.labor.reduce((sum, item) => sum + item.total, 0)
    const materialsTotal = categoryBreakdown.materials.reduce((sum, item) => sum + item.total, 0)
    const feesTotal = categoryBreakdown.fees.reduce((sum, item) => sum + item.amount, 0)
    const totalEstimate = laborTotal + materialsTotal + feesTotal

    return {
      taskId,
      taskDescription: task.description,
      category: task.category,
      ...categoryBreakdown,
      laborTotal,
      materialsTotal,
      feesTotal,
      totalEstimate,
      generatedAt: new Date().toISOString()
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TaskService()
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
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TaskService()
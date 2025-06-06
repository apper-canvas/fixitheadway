import React from 'react'
      import Label from '@/components/atoms/Label'
      import Input from '@/components/atoms/Input'
      import TaskCategorySelector from './TaskCategorySelector'
      import TaskUrgencySelector from './TaskUrgencySelector'

      const TaskFormFields = ({ newTask, setNewTask, categories, urgencyLevels }) => {
        return (
          <>
            <TaskCategorySelector
              categories={categories}
              selectedCategory={newTask.category}
              onSelectCategory={(value) => setNewTask({ ...newTask, category: value })}
            />

            <div>
              <Label className="mb-2">Task Description</Label>
              <Input
                rows="4"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe what needs to be done..."
              />
            </div>

            <div>
              <Label className="mb-3">Urgency Level</Label>
              <TaskUrgencySelector
                urgencyLevels={urgencyLevels}
                selectedUrgency={newTask.urgency}
                onSelectUrgency={(value) => setNewTask({ ...newTask, urgency: value })}
              />
            </div>
          </>
        )
      }

      export default TaskFormFields
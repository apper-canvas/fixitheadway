import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Select from 'react-select'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import handymanProfileService from '@/services/api/handymanProfileService'

const SkillSelector = ({ 
  skills = [], 
  onSkillsChange, 
  className = '',
  maxSkills = 10 
}) => {
  const [availableSkills, setAvailableSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [customSkill, setCustomSkill] = useState({
    name: '',
    category: '',
    level: 'Beginner',
    yearsOfExperience: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableSkills()
  }, [])

  const loadAvailableSkills = async () => {
    try {
      const data = await handymanProfileService.getSkillsAndServices()
      const skillOptions = data.predefinedSkills.map(skill => ({
        value: skill.name,
        label: skill.name,
        category: skill.category
      }))
      setAvailableSkills(skillOptions)
    } catch (error) {
      console.error('Failed to load skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = (skillOption) => {
    if (skills.length >= maxSkills) {
      alert(`Maximum ${maxSkills} skills allowed`)
      return
    }

    if (skills.some(skill => skill.name === skillOption.value)) {
      alert('Skill already added')
      return
    }

    const newSkill = {
      id: `skill_${Date.now()}`,
      name: skillOption.value,
      category: skillOption.category,
      level: 'Beginner',
      yearsOfExperience: 0,
      certifications: []
    }

    onSkillsChange([...skills, newSkill])
    setSelectedSkill(null)
  }

  const handleAddCustomSkill = () => {
    if (!customSkill.name.trim() || !customSkill.category.trim()) {
      alert('Please fill in skill name and category')
      return
    }

    if (skills.some(skill => skill.name === customSkill.name)) {
      alert('Skill already added')
      return
    }

    if (skills.length >= maxSkills) {
      alert(`Maximum ${maxSkills} skills allowed`)
      return
    }

    const newSkill = {
      id: `skill_${Date.now()}`,
      name: customSkill.name,
      category: customSkill.category,
      level: customSkill.level,
      yearsOfExperience: parseInt(customSkill.yearsOfExperience) || 0,
      certifications: []
    }

    onSkillsChange([...skills, newSkill])
    setCustomSkill({
      name: '',
      category: '',
      level: 'Beginner',
      yearsOfExperience: 0
    })
    setShowAddCustom(false)
  }

  const handleUpdateSkill = (skillId, updates) => {
    const updatedSkills = skills.map(skill =>
      skill.id === skillId ? { ...skill, ...updates } : skill
    )
    onSkillsChange(updatedSkills)
  }

  const handleRemoveSkill = (skillId) => {
    onSkillsChange(skills.filter(skill => skill.id !== skillId))
  }

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#e2e8f0',
      borderRadius: '0.75rem',
      minHeight: '48px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#cbd5e1'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      '&:active': {
        backgroundColor: '#2563eb'
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Add Skills Section */}
      <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          Add Skills
        </h3>
        
        <div className="space-y-4">
          {/* Predefined Skills Selector */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Select from common skills
            </label>
            <Select
              value={selectedSkill}
              onChange={handleAddSkill}
              options={availableSkills}
              placeholder="Search and select skills..."
              isClearable
              isSearchable
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Custom Skill Toggle */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="text-primary bg-transparent border border-primary hover:bg-primary hover:text-white"
            >
              <ApperIcon name="Plus" size={16} />
              Add Custom Skill
            </Button>
          </div>

          {/* Custom Skill Form */}
          <AnimatePresence>
            {showAddCustom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border border-surface-200 dark:border-surface-600 rounded-lg p-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Skill Name"
                    value={customSkill.name}
                    onChange={(e) => setCustomSkill({ ...customSkill, name: e.target.value })}
                    placeholder="e.g., Advanced Plumbing"
                  />
                  <Input
                    label="Category"
                    value={customSkill.category}
                    onChange={(e) => setCustomSkill({ ...customSkill, category: e.target.value })}
                    placeholder="e.g., Main Trade"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Skill Level
                    </label>
                    <select
                      value={customSkill.level}
                      onChange={(e) => setCustomSkill({ ...customSkill, level: e.target.value })}
                      className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    label="Years of Experience"
                    type="number"
                    min="0"
                    max="50"
                    value={customSkill.yearsOfExperience}
                    onChange={(e) => setCustomSkill({ ...customSkill, yearsOfExperience: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="bg-surface-200 text-surface-700 hover:bg-surface-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="bg-primary text-white hover:bg-primary-dark"
                  >
                    Add Skill
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Skills List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            Your Skills ({skills.length}/{maxSkills})
          </h3>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-8 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <ApperIcon name="Tool" size={48} className="text-surface-400 mx-auto mb-4" />
            <p className="text-surface-600 dark:text-surface-400">
              No skills added yet. Add your first skill above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {skill.category}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 bg-transparent p-1"
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Skill Level
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) => handleUpdateSkill(skill.id, { level: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800"
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={skill.yearsOfExperience}
                        onChange={(e) => handleUpdateSkill(skill.id, { 
                          yearsOfExperience: parseInt(e.target.value) || 0 
                        })}
                        className="w-full px-3 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillSelector
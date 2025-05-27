import React, { createContext, useState, useEffect, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { UserContext } from './UserContext'
import { addDays } from 'date-fns'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const { users, currentUser } = useContext(UserContext)
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) return JSON.parse(savedTasks)
    
    
    const sampleTasks = []
    
  
    users.forEach(user => {
      
      const numTasks = Math.floor(Math.random() * 3) + 3
      
      for (let i = 0; i < numTasks; i++) {
        const dueDate = addDays(new Date(), Math.floor(Math.random() * 7))
        dueDate.setHours(Math.floor(Math.random() * 24))
        dueDate.setMinutes(Math.floor(Math.random() * 60))
        
        const priorities = ['low', 'medium', 'high']
        const categories = ['work', 'personal', 'shopping', 'health', 'education']
        
        sampleTasks.push({
          id: uuidv4(),
          userId: user.id,
          title: `Sample Task ${i + 1} for ${user.name}`,
          description: `This is a sample task description for ${user.name}`,
          completed: Math.random() > 0.7,
          dueDate: dueDate.toISOString(),
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          createdAt: new Date().toISOString(),
          reminderSent: false
        })
      }
    })
    
    return sampleTasks
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData) => {
    if (!currentUser) return null
    
    const newTask = {
      id: uuidv4(),
      userId: currentUser.id,
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'medaium',
      category: taskData.category || 'personal',
      createdAt: new Date().toISOString(),
      reminderSent: false
    }
    
    setTasks([...tasks, newTask])
    return newTask
  }

  const updateTask = (taskId, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updatedData } 
        : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const getUserTasks = (userId) => {
    return tasks.filter(task => task.userId === userId)
  }

  const getTaskById = (taskId) => {
    return tasks.find(task => task.id === taskId)
  }

  const markTaskComplete = (taskId) => {
    updateTask(taskId, { completed: true })
  }

  const markTaskIncomplete = (taskId) => {
    updateTask(taskId, { completed: false })
  }

  const getUpcomingTasks = (userId, days = 7) => {
    const now = new Date()
    const future = addDays(now, days)
    
    return tasks.filter(task => {
      if (task.userId !== userId || task.completed) return false
      
      const dueDate = new Date(task.dueDate)
      return dueDate >= now && dueDate <= future
    })
  }

  const getOverdueTasks = (userId) => {
    const now = new Date()
    
    return tasks.filter(task => {
      if (task.userId !== userId || task.completed) return false
      
      const dueDate = new Date(task.dueDate)
      return dueDate < now
    })
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      getUserTasks,
      getTaskById,
      markTaskComplete,
      markTaskIncomplete,
      getUpcomingTasks,
      getOverdueTasks
    }}>
      {children}
    </TaskContext.Provider>
  )
}
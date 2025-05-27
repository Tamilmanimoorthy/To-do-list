import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TaskContext } from '../context/TaskContext'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import {
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaSort,
  FaSearch,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const TaskList = () => {
  const { currentUser } = useContext(UserContext)
  const { getUserTasks, markTaskComplete, markTaskIncomplete, deleteTask } = useContext(TaskContext)

  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
  const fetchTasks = async () => {
    if (currentUser) {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks')
        const userTasks = response.data.filter(task => task.userId === currentUser.id)
        setTasks(userTasks)
        setFilteredTasks(userTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
  }

  fetchTasks()
}, [currentUser])

  useEffect(() => {
    let result = [...tasks]

    // Filter
    if (filter === 'completed') {
      result = result.filter(task => task.completed)
    } else if (filter === 'active') {
      result = result.filter(task => !task.completed)
    } else if (filter === 'overdue') {
      result = result.filter(task => {
        const dueDate = new Date(task.dueDate)
        return !task.completed && dueDate < new Date()
      })
    } else if (filter === 'upcoming') {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      result = result.filter(task => {
        const dueDate = new Date(task.dueDate)
        return !task.completed && dueDate >= now && dueDate <= tomorrow
      })
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      )
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate) - new Date(b.dueDate)
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === 'priority') {
        const priorityValues = { low: 1, medium: 2, high: 3 }
        comparison = priorityValues[a.priority] - priorityValues[b.priority]
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredTasks(result)
  }, [tasks, filter, searchTerm, sortBy, sortOrder])

  const handleComplete = (taskId) => {
    markTaskComplete(taskId)
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: true } : task))
    toast.success('Task marked as complete')
  }

  const handleIncomplete = (taskId) => {
    markTaskIncomplete(taskId)
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: false } : task))
    toast.info('Task marked as incomplete')
  }

  const handleDelete = async (taskId) => {
    console.log(taskId)
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`)

      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      toast.success('Task deleted successfully')
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }
}

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return ''
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <Link to="/dashboard/tasks/new" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      <div className="task-list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-sort-controls">
          <div className="filter-dropdown">
            <button className="filter-btn">
              <FaFilter />
              <span>Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            </button>
            <div className="filter-dropdown-menu">
              {['all', 'active', 'completed', 'overdue', 'upcoming'].map(type => (
                <button
                  key={type}
                  className={filter === type ? 'active' : ''}
                  onClick={() => setFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-dropdown">
            <button className="sort-btn">
              <FaSort />
              <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
            </button>
            <div className="sort-dropdown-menu">
              {['dueDate', 'title', 'priority'].map(key => (
                <button
                  key={key}
                  className={sortBy === key ? 'active' : ''}
                  onClick={() => setSortBy(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found. {searchTerm ? 'Try another search.' : 'Create a new task to get started.'}</p>
          <Link to="/dashboard/tasks/new" className="btn btn-primary">
            Add New Task
          </Link>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task,index) => (
            <div
              key={index}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <p className="task-description">
                {task.description.length > 100
                  ? task.description.slice(0, 100) + '...'
                  : task.description || 'No description'}
              </p>

              <div className="task-meta">
                <div className="task-due-date">
                  <FaCalendarAlt />
                  <span className={isOverdue(task.dueDate) && !task.completed ? 'overdue' : ''}>
                    {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                    {isOverdue(task.dueDate) && !task.completed && (
                      <span className="overdue-badge">
                        <FaExclamationTriangle /> Overdue
                      </span>
                    )}
                  </span>
                </div>
                <div className="task-category">{task.category}</div>
              </div>

              <div className="task-actions">
                {task.completed ? (
                  <button
                    className="action-btn incomplete-btn"
                    onClick={() => handleIncomplete(task.id)}
                    title="Mark as Incomplete"
                  >
                    <FaTimes />
                  </button>
                ) : (
                  <button
                    className="action-btn complete-btn"
                    onClick={() => handleComplete(task.id)}
                    title="Mark as Complete"
                  >
                    <FaCheck />
                  </button>
                )}

                <Link to={`/dashboard/tasks/${task._id}`} className="action-btn view-btn" title="View Task">
                  <FaEye />
                </Link>

                <Link to={`/dashboard/tasks/${task._id}/edit`} className="action-btn edit-btn" title="Edit Task">
                  <FaEdit />
                </Link>

                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(task._id)}
                  title="Delete Task"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList

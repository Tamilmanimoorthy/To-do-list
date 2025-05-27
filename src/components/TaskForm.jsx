import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import { FaSave, FaTimes, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'
import { UserContext } from '../context/UserContext' // ✅ adjust this path based on your project structure

const TaskForm = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useContext(UserContext)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(new Date())
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please log in to access tasks.')
      navigate('/login')
      return
    }

    if (taskId) {
      setIsEditing(true)
      axios.get(`http://localhost:5000/api/tasks/${taskId}`)
        .then((res) => {
          const task = res.data
          setTitle(task.title)
          setDescription(task.description)
          setDueDate(new Date(task.dueDate))
          setPriority(task.priority)
          setCategory(task.category)
        })
        .catch(() => {
          toast.error('Task not found')
          navigate('/dashboard/tasks')
        })
    }
  }, [taskId, navigate, currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const taskData = {
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      category,
      userId: currentUser?.id,
    }

    try {
      if (isEditing) {
        await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, taskData)
        toast.success('Task updated successfully')
      } else {
        await axios.post('http://localhost:5000/api/tasks', taskData)
        toast.success('Task created successfully')
      }
      navigate('/dashboard/tasks')
    } catch (error) {
      toast.error('Something went wrong!')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard/tasks')
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <div className="date-picker-container">
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="date-picker"
              />
              <FaCalendarAlt className="date-picker-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            <FaTimes className="btn-icon" />
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Saving...</span>
              </>
            ) : (
              <>
                <FaSave className="btn-icon" />
                {isEditing ? 'Update Task' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaExclamationTriangle,
} from 'react-icons/fa';
import axios from 'axios';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { markTaskComplete, markTaskIncomplete, deleteTask } = useContext(TaskContext);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
          if (response.data) {
            setTask(response.data);
          } else {
            toast.error('Task not found');
            navigate('/dashboard/tasks');
          }
        } catch (error) {
          console.error('Error fetching task:', error);
          toast.error('Task not found');
          navigate('/dashboard/tasks');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [taskId, navigate]);

  const handleComplete = () => {
    markTaskComplete(taskId);
    setTask({ ...task, completed: true });
    toast.success('Task marked as complete');
  };

  const handleIncomplete = () => {
    markTaskIncomplete(taskId);
    setTask({ ...task, completed: false });
    toast.info('Task marked as incomplete');
  };


   const handleDelete = async (taskId) => {
      console.log(taskId)
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
  
       
  
        toast.success('Task deleted successfully')
        navigate('/dashboard/tasks');
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error('Failed to delete task')
      }
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-not-found">
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard/tasks" className="btn btn-primary">
          <FaArrowLeft className="me-2" />
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      <div className="task-details-header">
        <Link to="/dashboard/tasks" className="back-link">
          <FaArrowLeft /> Back to Tasks
        </Link>
        <div className="task-details-actions">
          {task.completed ? (
            <button className="btn btn-outline-warning" onClick={handleIncomplete}>
              <FaTimes className="me-2" />
              Mark Incomplete
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleComplete}>
              <FaCheck className="me-2" />
              Mark Complete
            </button>
          )}

          <Link to={`/dashboard/tasks/${taskId}/edit`} className="btn btn-primary">
            <FaEdit className="me-2" />
            Edit
          </Link>

          <button className="btn btn-danger" onClick={() => handleDelete(taskId)}>
            <FaTrash className="me-2" />
            Delete
          </button>
        </div>
      </div>

      <div className={`task-details-card ${task.completed ? 'completed' : ''}`}>
        <div className="task-details-status">
          <span className={`status-badge ${task.completed ? 'completed' : 'active'}`}>
            {task.completed ? 'Completed' : 'Active'}
          </span>
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          <span className="category-badge">
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
        </div>

        <h2 className="task-details-title">{task.title}</h2>

        <div className="task-details-dates">
          <div className="task-date">
            <FaCalendarAlt className="date-icon" />
            <div>
              <span className="date-label">Due Date:</span>
              <span className={`date-value ${isOverdue(task.dueDate) && !task.completed ? 'overdue' : ''}`}>
                {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                {isOverdue(task.dueDate) && !task.completed && (
                  <span className="overdue-badge">
                    <FaExclamationTriangle /> Overdue
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="task-time">
            <FaClock className="time-icon" />
            <div>
              <span className="time-label">Due Time:</span>
              <span className="time-value">
                {format(new Date(task.dueDate), 'h:mm a')}
              </span>
            </div>
          </div>
        </div>

        <div className="task-details-description">
          <h3>Description</h3>
          <p>{task.description || 'No description provided.'}</p>
        </div>

        <div className="task-details-meta">
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">
              {format(new Date(task.createdAt), 'MMMM d, yyyy h:mm a')}
            </span>
          </div>

          {task.completed && (
            <div className="meta-item">
              <span className="meta-label">Completed:</span>
              <span className="meta-value">Yes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

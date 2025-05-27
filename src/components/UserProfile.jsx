import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { TaskContext } from '../context/TaskContext'
import { format } from 'date-fns'
import { FaUser, FaTasks, FaCalendarAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from 'react-toastify'

const UserProfile = () => {
  const { currentUser } = useContext(UserContext)
  const { getUserTasks, getUpcomingTasks, getOverdueTasks } = useContext(TaskContext)
  
  const [name, setName] = useState(currentUser?.name || '')
  const [isEditing, setIsEditing] = useState(false)
  
  if (!currentUser) return null
  
  const userTasks = getUserTasks(currentUser.id)
  const completedTasks = userTasks.filter(task => task.completed).length
  const activeTasks = userTasks.length - completedTasks
  const upcomingTasks = getUpcomingTasks(currentUser.id, 3)
  const overdueTasks = getOverdueTasks(currentUser.id)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, we would update the user's name in the database
    // For this demo, we'll just show a toast
    toast.success('Profile updated successfully')
    setIsEditing(false)
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-container">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="profile-avatar"
            />
            <button className="change-avatar-btn">
              <FaUser />
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={currentUser.email}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <h3 className="profile-name">
                {currentUser.name}
                {currentUser.isAdmin && <span className="admin-badge">Admin</span>}
              </h3>
              <p className="profile-email">{currentUser.email}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <FaTasks className="stat-icon" />
                  <div className="stat-text">
                    <span className="stat-value">{userTasks.length}</span>
                    <span className="stat-label">Total Tasks</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon active-tasks"></div>
                  <div className="stat-text">
                    <span className="stat-value">{activeTasks}</span>
                    <span className="stat-label">Active</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon completed-tasks"></div>
                  <div className="stat-text">
                    <span className="stat-value">{completedTasks}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-last-login">
                <FaCalendarAlt className="last-login-icon" />
                <span>
                  {currentUser.lastLogin 
                    ? `Last login: ${format(new Date(currentUser.lastLogin), 'MMM d, yyyy h:mm a')}` 
                    : 'Never logged in'}
                </span>
              </div>
              
              <button 
                className="btn btn-primary edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-task-summary">
          <div className="task-summary-section">
            <h3>
              <FaExclamationTriangle className="section-icon overdue" />
              Overdue Tasks ({overdueTasks.length})
            </h3>
            
            {overdueTasks.length === 0 ? (
              <p className="no-tasks">No overdue tasks. Great job!</p>
            ) : (
              <ul className="task-summary-list">
                {overdueTasks.slice(0, 3).map(task => (
                  <li key={task.id} className="task-summary-item overdue">
                    <span className="task-title">{task.title}</span>
                    <span className="task-due-date">
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                    </span>
                  </li>
                ))}
                {overdueTasks.length > 3 && (
                  <li className="task-summary-more">
                    +{overdueTasks.length - 3} more overdue tasks
                  </li>
                )}
              </ul>
            )}
          </div>
          
          <div className="task-summary-section">
            <h3>
              <FaCalendarAlt className="section-icon upcoming" />
              Upcoming Tasks ({upcomingTasks.length})
            </h3>
            
            {upcomingTasks.length === 0 ? (
              <p className="no-tasks">No upcoming tasks in the next 3 days.</p>
            ) : (
              <ul className="task-summary-list">
                {upcomingTasks.map(task => (
                  <li key={task.id} className="task-summary-item">
                    <span className="task-title">{task.title}</span>
                    <span className="task-due-date">
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="task-summary-section">
            <h3>
              <FaCheck className="section-icon completed" />
              Recently Completed
            </h3>
            
            {completedTasks === 0 ? (
              <p className="no-tasks">No completed tasks yet.</p>
            ) : (
              <ul className="task-summary-list">
                {userTasks
                  .filter(task => task.completed)
                  .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                  .slice(0, 3)
                  .map(task => (
                    <li key={task.id} className="task-summary-item completed">
                      <span className="task-title">{task.title}</span>
                      <span className="task-due-date">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                      </span>
                    </li>
                  ))}
                {completedTasks > 3 && (
                  <li className="task-summary-more">
                    +{completedTasks - 3} more completed tasks
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
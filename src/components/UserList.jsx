import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { TaskContext } from '../context/TaskContext'
import { format } from 'date-fns'
import { FaCircle, FaUser, FaTasks, FaCalendarAlt } from 'react-icons/fa'

const UserList = () => {
  const { users, currentUser } = useContext(UserContext)
  const { getUserTasks } = useContext(TaskContext)
  
  // Only admin can access this page
  if (!currentUser?.isAdmin) {
    return (
      <div className="unauthorized-container">
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }
  
  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Management</h2>
        <p>View and manage all registered users</p>
      </div>
      
      <div className="user-list">
        {users.map(user => {
          const userTasks = getUserTasks(user.id)
          const completedTasks = userTasks.filter(task => task.completed).length
          const activeTasks = userTasks.length - completedTasks
          
          return (
            <div key={user.id} className="user-card">
              <div className="user-avatar-container">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="user-avatar"
                />
                <span className={`user-status ${user.isOnline ? 'online' : 'offline'}`}>
                  <FaCircle />
                </span>
              </div>
              
              <div className="user-info">
                <h3 className="user-name">
                  {user.name}
                  {user.isAdmin && <span className="admin-badge">Admin</span>}
                </h3>
                <p className="user-email">{user.email}</p>
                
                <div className="user-stats">
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
                
                <div className="user-last-login">
                  <FaCalendarAlt className="last-login-icon" />
                  <span>
                    {user.lastLogin 
                      ? `Last login: ${format(new Date(user.lastLogin), 'MMM d, yyyy h:mm a')}` 
                      : 'Never logged in'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserList
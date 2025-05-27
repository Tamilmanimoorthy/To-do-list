import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { FaBars, FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa'

const Header = ({ toggleSidebar, toggleNotifications, notificationCount }) => {
  const { currentUser, logout } = useContext(UserContext)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="app-title">To-Do Advanced Dashboard</h1>
      </div>
      
      <div className="header-right">
        <button 
          className="notification-btn" 
          onClick={toggleNotifications}
        >
          <FaBell />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>
        
        <div className="user-dropdown">
          <button className="user-dropdown-toggle">
            <img 
              src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={currentUser?.name || 'User'} 
              className="user-avatar"
            />
            <span className="user-name">{currentUser?.name || 'User'}</span>
          </button>
          
          <div className="user-dropdown-menu">
            <Link to="/dashboard/profile" className="dropdown-item">
              <FaUser className="dropdown-icon" />
              Profile
            </Link>
            <button onClick={handleLogout} className="dropdown-item">
              <FaSignOutAlt className="dropdown-icon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
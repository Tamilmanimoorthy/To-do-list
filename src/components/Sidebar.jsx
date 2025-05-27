import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { 
  FaTasks, 
  FaUsers, 
  FaPlus, 
  FaUser, 
  FaCalendarAlt,
  FaChartLine
} from 'react-icons/fa'

const Sidebar = ({ isOpen }) => {
  const { currentUser } = useContext(UserContext)
  
  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FaTasks className="logo-icon" />
          {isOpen && <span className="logo-text">To-Do Dashboard</span>}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" end>
              <FaChartLine className="nav-icon" />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/tasks">
              <FaTasks className="nav-icon" />
              {isOpen && <span>Tasks</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/tasks/new">
              <FaPlus className="nav-icon" />
              {isOpen && <span>New Task</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">
              <FaUser className="nav-icon" />
              {isOpen && <span>Profile</span>}
            </NavLink>
          </li>
          {currentUser?.isAdmin && (
            <li>
              <NavLink to="/dashboard/users">
                <FaUsers className="nav-icon" />
                {isOpen && <span>Users</span>}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <img 
              src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={currentUser?.name || 'User'} 
              className="user-avatar"
            />
            <div className="user-details">
              <p className="user-name">{currentUser?.name || 'User'}</p>
              <p className="user-role">{currentUser?.isAdmin ? 'Administrator' : 'User'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
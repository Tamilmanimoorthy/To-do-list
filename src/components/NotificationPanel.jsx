import React from 'react'
import { format } from 'date-fns'
import { FaBell, FaTimes, FaCheck, FaTrash } from 'react-icons/fa'

const NotificationPanel = ({ 
  isOpen, 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onClearAll 
}) => {
  if (!isOpen) return null
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
      <div className="notification-header">
        <h3>
          <FaBell className="notification-icon" />
          Notifications
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </h3>
        <div className="notification-actions">
          {notifications.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={onClearAll}
            >
              <FaTrash />
              <span>Clear All</span>
            </button>
          )}
          <button 
            className="close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="notification-body">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {format(new Date(notification.time), 'MMM d, h:mm a')}
                  </span>
                </div>
                
                {!notification.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <FaCheck />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
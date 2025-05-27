import React, { useState, useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { TaskContext } from '../context/TaskContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import UserList from '../components/UserList'
import UserProfile from '../components/UserProfile'
import TaskDetails from '../components/TaskDetails'
import NotificationPanel from '../components/NotificationPanel'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { currentUser, users } = useContext(UserContext)
  const { tasks, getUpcomingTasks, updateTask } = useContext(TaskContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  
  useEffect(() => {
    if (!currentUser) return

  
    const upcomingTasks = getUpcomingTasks(currentUser.id, 1)
    
    const newNotifications = upcomingTasks
      .filter(task => !task.reminderSent)
      .map(task => ({
        id: task.id,
        title: 'Upcoming Task',
        message: `"${task.title}" is due soon`,
        time: new Date().toISOString(),
        read: false,
        type: 'reminder',
        taskId: task.id
      }))
    
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev])
      
      // Mark tasks as reminded
      newNotifications.forEach(notification => {
        updateTask(notification.taskId, { reminderSent: true })
        
        // Show toast for new notifications
        toast.info(`Reminder: "${upcomingTasks.find(t => t.id === notification.taskId).title}" is due soon`)
      })
    }
  }, [currentUser, getUpcomingTasks, updateTask])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  if (!currentUser) return null

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="dashboard-content">
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleNotifications={toggleNotifications}
          notificationCount={notifications.filter(n => !n.read).length}
        />
        
        <main className="dashboard-main">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/tasks/:taskId/edit" element={<TaskForm />} />
            <Route path="/users" element={<UserList users={users} />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
      
      <NotificationPanel 
        isOpen={notificationsOpen}
        notifications={notifications}
        onClose={toggleNotifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearNotifications}
      />
    </div>
  )
}

export default Dashboard
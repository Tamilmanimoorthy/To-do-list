import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { UserProvider } from './context/UserContext'
import { TaskProvider } from './context/TaskContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading TaskMaster...</p>
      </div>
    )
  }

  return (
    <UserProvider>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard\" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TaskProvider>
    </UserProvider>
  )
}

export default App
import React, { createContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : [
      { 
        id: '1', 
        name: 'Admin User', 
        email: 'admin@example.com', 
        password: 'password123', 
        isAdmin: true,
        isOnline: false,
        lastLogin: null,
        avatar: `https://randomuser.me/api/portraits/men/1.jpg`
      },
      { 
        id: '2', 
        name: 'John Doe', 
        email: 'john@example.com', 
        password: 'password123', 
        isAdmin: false,
        isOnline: false,
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        avatar: `https://randomuser.me/api/portraits/men/32.jpg`
      },
      { 
        id: '3', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        password: 'password123', 
        isAdmin: false,
        isOnline: false,
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        avatar: `https://randomuser.me/api/portraits/women/44.jpg`
      }
    ]
  })
  
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }, [currentUser])

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const updatedUser = { 
        ...user, 
        isOnline: true, 
        lastLogin: new Date().toISOString() 
      }
      
      setUsers(users.map(u => u.id === user.id ? updatedUser : u))
      setCurrentUser(updatedUser)
      return true
    }
    
    return false
  }

  const logout = () => {
    if (currentUser) {
      setUsers(users.map(u => 
        u.id === currentUser.id 
          ? { ...u, isOnline: false } 
          : u
      ))
      setCurrentUser(null)
    }
  }

  const register = (name, email, password) => {
    if (users.some(u => u.email === email)) {
      return false
    }
    
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password,
      isAdmin: false,
      isOnline: true,
      lastLogin: new Date().toISOString(),
      avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`
    }
    
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    return true
  }

  return (
    <UserContext.Provider value={{ 
      users, 
      currentUser, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </UserContext.Provider>
  )
}
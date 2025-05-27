import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, currentUser } = useContext(UserContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      const success = login(email, password)
      
      if (success) {
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        toast.error('Invalid email or password')
      }
      
      setIsLoading(false)
    }, 1000)
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>To-Do App</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2\" role="status\" aria-hidden="true"></span>
            ) : (
              <FaSignInAlt className="me-2" />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p className="demo-credentials">
            <small>Demo credentials: tamil@gmail.com / Tamil07</small>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
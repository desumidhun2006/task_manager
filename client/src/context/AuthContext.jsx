import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const signup = async (name, email) => {
    const res = await api.post('/api/auth/signup', { name, email })
    return res.data
  }

  const verifySignup = async (email, code) => {
    const res = await api.post('/api/auth/verify-signup', { email, code })
    return res.data
  }

  const setPassword = async (tempToken, password) => {
    const res = await api.post('/api/auth/set-password', { tempToken, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, verifySignup, setPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

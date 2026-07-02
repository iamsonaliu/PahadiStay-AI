import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService, setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ps-token') || null)
  const [loading, setLoading] = useState(true)

  // hydrate session from stored token
  useEffect(() => {
    let active = true
    async function hydrate() {
      if (!token) { setLoading(false); return }
      setAuthToken(token)
      try {
        const res = await authService.me()
        if (active) setUser(res.data)
      } catch {
        if (active) { setToken(null); localStorage.removeItem('ps-token'); setAuthToken(null) }
      } finally {
        if (active) setLoading(false)
      }
    }
    hydrate()
    return () => { active = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback((tok, usr) => {
    setToken(tok); setUser(usr)
    localStorage.setItem('ps-token', tok)
    setAuthToken(tok)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password })
    persist(res.data.token, res.data.user)
    return res.data.user
  }, [persist])

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload)
    persist(res.data.token, res.data.user)
    return res.data.user
  }, [persist])

  const logout = useCallback(() => {
    setUser(null); setToken(null)
    localStorage.removeItem('ps-token')
    setAuthToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthed: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

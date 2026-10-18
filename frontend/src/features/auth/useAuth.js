import { useState, useEffect } from 'react'
import { registerRequest, loginRequest } from './authApi'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch {
        localStorage.removeItem('profile')
      }
    }

    setLoading(false)
  }, [])

  async function register(formData) {
    setError(null)
    setLoading(true)

    try {
      const data = await registerRequest(formData)

      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      if (data.profile) {
        setProfile(data.profile)
        localStorage.setItem('profile', JSON.stringify(data.profile))
      }

      if (data.session) {
        localStorage.setItem('session', JSON.stringify(data.session))
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function login(formData) {
    setError(null)
    setLoading(true)

    try {
      const data = await loginRequest(formData)

      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      if (data.profile) {
        setProfile(data.profile)
        localStorage.setItem('profile', JSON.stringify(data.profile))
      }

      if (data.session) {
        localStorage.setItem('session', JSON.stringify(data.session))
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setError(null)

    localStorage.removeItem('user')
    localStorage.removeItem('profile')
    localStorage.removeItem('session')

    setUser(null)
    setProfile(null)
  }

  return {
    user,
    profile,
    login,
    register,
    logout,
    loading,
    error
  }
}
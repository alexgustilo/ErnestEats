import { useState } from 'react'
import { registerRequest, loginRequest } from './authApi'

function readStoredJson(key) {
  const savedValue = localStorage.getItem(key)
  if (!savedValue) return null

  try {
    return JSON.parse(savedValue)
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => readStoredJson('user'))
  const [profile, setProfile] = useState(() => readStoredJson('profile'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

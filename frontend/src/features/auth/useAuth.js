import { useState } from 'react'
import { registerRequest, loginRequest } from './authApi'

function readStoredAuth() {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null')
    const profile = JSON.parse(sessionStorage.getItem('profile') || 'null')
    const session = JSON.parse(sessionStorage.getItem('session') || 'null')

    // These values must all belong to the same signed-in account. Otherwise
    // the UI can show a cached admin page while the API receives another
    // account's token and rejects its requests.
    const ids = [user?.id, profile?.id, session?.user?.id]
    if (ids.some((id) => !id) || !ids.every((id) => id === ids[0])) {
      clearStoredAuth()
      return { user: null, profile: null }
    }

    return { user, profile }
  } catch {
    clearStoredAuth()
    return { user: null, profile: null }
  }
}

function clearStoredAuth() {
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('profile')
  sessionStorage.removeItem('session')
}

function storeLogin(data) {
  const userId = data.user?.id

  if (!userId || data.profile?.id !== userId || data.session?.user?.id !== userId) {
    clearStoredAuth()
    throw new Error('Login returned mismatched account details. Please sign in again.')
  }

  // Replace the complete auth set together so older values cannot survive a
  // partial login response and be paired with the new token after refresh.
  clearStoredAuth()
  sessionStorage.setItem('user', JSON.stringify(data.user))
  sessionStorage.setItem('profile', JSON.stringify(data.profile))
  sessionStorage.setItem('session', JSON.stringify(data.session))
}

export function useAuth() {
  const [storedAuth] = useState(readStoredAuth)
  const [user, setUser] = useState(storedAuth.user)
  const [profile, setProfile] = useState(storedAuth.profile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function register(formData) {
    setError(null)
    setLoading(true)

    try {
      const data = await registerRequest(formData)

      if (data.user) {
        setUser(data.user)
        sessionStorage.setItem('user', JSON.stringify(data.user))
      }

      if (data.profile) {
        setProfile(data.profile)
        sessionStorage.setItem('profile', JSON.stringify(data.profile))
      }

      if (data.session) {
        sessionStorage.setItem('session', JSON.stringify(data.session))
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
      storeLogin(data)
      setUser(data.user)
      setProfile(data.profile)

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

    clearStoredAuth()

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

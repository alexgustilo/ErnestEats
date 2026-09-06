import { useState } from 'react'
import { registerRequest, loginRequest } from './authApi'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function register(formData) {
    setLoading(true)
    setError(null)
    try {
      const data = await registerRequest(formData)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function login(formData) {
    setLoading(true)
    setError(null)
    try {
      const data = await loginRequest(formData)

      // i-store yung session sa browser para hindi mawala pag nag-refresh
      localStorage.setItem('access_token', data.session.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { register, login, loading, error }
}
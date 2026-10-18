import { useState } from 'react'
import { getMyNotifications, markNotificationAsRead } from './notificationsApi'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchNotifications() {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyNotifications()
      setNotifications(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id) {
    setLoading(true)
    setError(null)
    try {
      const updated = await markNotificationAsRead(id)
      setNotifications((current) => current.map((item) => item.id === id ? updated : item))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { notifications, fetchNotifications, markAsRead, loading, error }
}

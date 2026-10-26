const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function authHeaders(extra = {}) {
  let session
  try { session = JSON.parse(localStorage.getItem('session') || 'null') } catch { session = null }
  if (!session?.access_token) throw new Error('Please log in again to view your notifications.')
  return { ...extra, Authorization: `Bearer ${session.access_token}` }
}

async function parseResponse(res, fallback) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || fallback)
  return data
}

export async function getMyNotifications() {
  return parseResponse(await fetch(`${API_URL}/notifications/mine`, { headers: authHeaders() }), 'Failed to get notifications')
}

export async function markNotificationAsRead(id) {
  return parseResponse(await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders()
  }), 'Failed to mark notification as read')
}

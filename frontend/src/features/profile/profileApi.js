const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function authHeaders(extra = {}) {
  let session
  try { session = JSON.parse(localStorage.getItem('session') || 'null') } catch { session = null }
  if (!session?.access_token) throw new Error('Mag-log in ulit para ma-update ang profile mo.')
  return { ...extra, Authorization: `Bearer ${session.access_token}` }
}

async function parseResponse(res, fallback) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || fallback)
  return data
}

export async function getMyProfile() {
  return parseResponse(await fetch(`${API_URL}/profile/me`, { headers: authHeaders() }), 'Failed to load profile')
}

export async function updateMyProfile(profile) {
  return parseResponse(await fetch(`${API_URL}/profile/me`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(profile)
  }), 'Failed to update profile')
}

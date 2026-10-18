const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Kunin ang login token at idagdag sa request headers
function getAuthHeaders(extraHeaders = {}) {
  let session

  try {
    session = JSON.parse(localStorage.getItem('session') || 'null')
  } catch {
    session = null
  }

  const token = session?.access_token

  if (!token) {
    throw new Error('Mag-log in ulit para magamit ang orders.')
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`
  }
}

// Kunin ang lahat ng orders para sa admin
export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders()
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get orders')
  }

  return data
}

// Kunin ang orders ng naka-login na customer
export async function getMyOrders() {
  const res = await fetch(`${API_URL}/orders/mine`, {
    headers: getAuthHeaders()
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get your orders')
  }

  return data
}

// Gumawa ng order para sa naka-login na customer
// Format: { items: [{ product_id, quantity }] }
export async function createOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(order)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create order')
  }

  return data
}

// update  orders; for admin
export async function updateOrder(id, updates) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(updates)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update order')
  }

  return data
}

// I-cancel ang order; tiyaking pinapayagan ito ng backend route mo
export async function cancelOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to cancel order')
  }

  return data
}
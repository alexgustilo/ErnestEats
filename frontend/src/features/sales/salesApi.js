const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get all sales
export async function getSales() {
  const res = await fetch(`${API_URL}/sales`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get sales')
  }

  return data
}

// Get sales summary
export async function getSalesSummary() {
  const res = await fetch(`${API_URL}/sales/summary`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get sales summary')
  }

  return data
}

// Create a sale from an order
export async function createSale(order_id) {
  const res = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ order_id })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create sale')
  }

  return data
}
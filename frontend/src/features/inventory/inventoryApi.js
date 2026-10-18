const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get all inventory records
export async function getInventory() {
  const res = await fetch(`${API_URL}/inventory`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get inventory')
  }

  return data
}

// Create an inventory record
export async function createInventory(inventory) {
  const res = await fetch(`${API_URL}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inventory)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create inventory')
  }

  return data
}

// Update an inventory record
export async function updateInventory(id, inventory) {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inventory)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update inventory')
  }

  return data
}

// Delete an inventory record
export async function deleteInventory(id) {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'DELETE'
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete inventory')
  }

  return data
}
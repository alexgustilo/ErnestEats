const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get all products
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get products')
  }

  return data
}

// Create a product
export async function createProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create product')
  }

  return data
}

// Update a product
export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update product')
  }

  return data
}

// Delete a product
export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete product')
  }

  return data
}
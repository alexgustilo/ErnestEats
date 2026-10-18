import { useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from './productsApi'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all products
  async function fetchProducts() {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(data)
      return data
    } catch (error) {
      console.error(error.message)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Add a product
  async function addProduct(product) {
    setLoading(true)
    setError(null)

    try {
      const data = await createProduct(product)
      setProducts((previousProducts) => [...previousProducts, data])
      return data
    } catch (error) {
      console.error(error.message)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Edit a product
  async function editProduct(id, product) {
    setLoading(true)
    setError(null)

    try {
      const data = await updateProduct(id, product)
      setProducts((previousProducts) =>
        previousProducts.map((item) => (item.id === id ? data : item))
      )
      return data
    } catch (error) {
      console.error(error.message)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Remove a product
  async function removeProduct(id) {
    setLoading(true)
    setError(null)

    try {
      const data = await deleteProduct(id)
      setProducts((previousProducts) =>
        previousProducts.filter((item) => item.id !== id)
      )
      return data
    } catch (error) {
      console.error(error.message)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    loading,
    error
  }
}
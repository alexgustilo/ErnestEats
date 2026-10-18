import { useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categoriesApi'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchCategories() {
    setLoading(true)
    setError(null)

    try {
      const data = await getCategories()
      setCategories(data)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function addCategory(category) {
    setLoading(true)
    setError(null)

    try {
      const data = await createCategory(category)
      setCategories((previousCategories) => [
        ...previousCategories,
        data
      ])
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function editCategory(id, category) {
    setLoading(true)
    setError(null)

    try {
      const data = await updateCategory(id, category)
      setCategories((previousCategories) =>
        previousCategories.map((item) =>
          item.id === id ? data : item
        )
      )
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function removeCategory(id) {
    setLoading(true)
    setError(null)

    try {
      const data = await deleteCategory(id)
      setCategories((previousCategories) =>
        previousCategories.filter((item) => item.id !== id)
      )
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    loading,
    error
  }
}
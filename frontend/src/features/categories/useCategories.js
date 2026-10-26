import { useCallback, useState } from 'react'
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

  const fetchCategories = useCallback(async function fetchCategories() {
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
  }, [])

  const addCategory = useCallback(async function addCategory(category) {
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
  }, [])

  const editCategory = useCallback(async function editCategory(id, category) {
    setLoading(true)
    setError(null)

    try {
      const data = await updateCategory(id, category)
      setCategories((previousCategories) =>
        previousCategories.map((item) =>
          String(item.id) === String(id) ? data : item
        )
      )
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const removeCategory = useCallback(async function removeCategory(id) {
    setLoading(true)
    setError(null)

    try {
      const data = await deleteCategory(id)
      setCategories((previousCategories) =>
        previousCategories.filter((item) => String(item.id) !== String(id))
      )
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

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

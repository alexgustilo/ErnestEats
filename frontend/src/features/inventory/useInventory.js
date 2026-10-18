import { useState } from 'react'
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} from './inventoryApi'

export function useInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchInventory() {
    setLoading(true)
    setError(null)

    try {
      const data = await getInventory()
      setInventory(data)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function addInventory(inventoryItem) {
    setLoading(true)
    setError(null)

    try {
      const data = await createInventory(inventoryItem)
      setInventory((previousInventory) => [...previousInventory, data])
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function editInventory(id, inventoryItem) {
    setLoading(true)
    setError(null)

    try {
      const data = await updateInventory(id, inventoryItem)
      setInventory((previousInventory) =>
        previousInventory.map((item) => (item.id === id ? data : item))
      )
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function removeInventory(id) {
    setLoading(true)
    setError(null)

    try {
      const data = await deleteInventory(id)
      setInventory((previousInventory) =>
        previousInventory.filter((item) => item.id !== id)
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
    inventory,
    fetchInventory,
    addInventory,
    editInventory,
    removeInventory,
    loading,
    error
  }
}
import { useState } from 'react'
import {
  getSales,
  getSalesSummary,
  createSale
} from './salesApi'

export function useSales() {
  const [sales, setSales] = useState([])
  const [summary, setSummary] = useState({
    total_sales: 0,
    total_revenue: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchSales() {
    setLoading(true)
    setError(null)

    try {
      const data = await getSales()
      setSales(data)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function fetchSalesSummary() {
    setLoading(true)
    setError(null)

    try {
      const data = await getSalesSummary()
      setSummary(data)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function addSale(order_id) {
    setLoading(true)
    setError(null)

    try {
      const data = await createSale(order_id)

      setSales((previousSales) => {
        const alreadyAdded = previousSales.some(
          (sale) => sale.id === data.id
        )

        return alreadyAdded
          ? previousSales.map((sale) => (sale.id === data.id ? data : sale))
          : [...previousSales, data]
      })

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    sales,
    summary,
    fetchSales,
    fetchSalesSummary,
    addSale,
    loading,
    error
  }
}
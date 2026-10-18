import { useCallback, useEffect, useState } from 'react'

const CART_KEY = 'ernesteats_cart'
const CART_EVENT = 'ernesteats-cart-updated'

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function useCart() {
  const [cart, setCart] = useState(readCart)

  useEffect(() => {
    const sync = () => setCart(readCart())
    window.addEventListener(CART_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CART_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const addItem = useCallback((product) => {
    const current = readCart()
    const id = product.id || product.product_id
    const exists = current.some((item) => (item.id || item.product_id) === id)
    const next = exists
      ? current.map((item) => (item.id || item.product_id) === id
          ? { ...item, quantity: Number(item.quantity || 0) + 1 }
          : item)
      : [...current, {
          id,
          product_id: id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || null,
          quantity: 1
        }]
    saveCart(next)
    setCart(next)
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    const current = readCart()
    const next = quantity <= 0
      ? current.filter((item) => (item.id || item.product_id) !== id)
      : current.map((item) => (item.id || item.product_id) === id ? { ...item, quantity } : item)
    saveCart(next)
    setCart(next)
  }, [])

  const removeItem = useCallback((id) => {
    const next = readCart().filter((item) => (item.id || item.product_id) !== id)
    saveCart(next)
    setCart(next)
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setCart([])
  }, [])

  const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0)
  const total = cart.reduce((sum, item) => sum + Math.round(Number(item.price || 0) * 100) * Number(item.quantity || 0), 0) / 100
  return { cart, count, total, addItem, updateQuantity, removeItem, clearCart }
}

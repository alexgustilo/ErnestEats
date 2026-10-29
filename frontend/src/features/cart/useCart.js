import { useCallback, useEffect, useState } from 'react'

const CART_KEY = 'ernesteats_cart'
const CART_EVENT = 'ernesteats-cart-updated'

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(saved)) return []

    return saved
      .filter((item) => item && (item.id ?? item.product_id) != null)
      .map((item) => {
        const id = item.id ?? item.product_id
        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))
        const price = Number(item.price)

        return {
          ...item,
          id,
          product_id: id,
          quantity,
          price: Number.isFinite(price) && price >= 0 ? price : 0
        }
      })
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

  const addItem = useCallback((product, quantity = 1) => {
    const current = readCart()
    const id = product.id ?? product.product_id
    if (id == null) return { ok: false, message: 'This product is unavailable.' }
    const amount = Math.max(1, Math.floor(Number(quantity) || 1))
    const stock = Math.max(0, Math.floor(Number(product.stock_quantity) || 0))
    const existing = current.find((item) => String(item.id) === String(id))
    const newQuantity = Number(existing?.quantity || 0) + amount
    if (stock <= 0) return { ok: false, message: 'This item is out of stock.' }
    if (newQuantity > stock) return { ok: false, message: `Only ${stock} available. Your cart already has ${Number(existing?.quantity || 0)}.` }

    const next = existing
      ? current.map((item) => String(item.id) === String(id)
          ? { ...item, quantity: newQuantity, stock_quantity: stock }
          : item)
      : [...current, {
          id,
          product_id: id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || null,
          quantity: amount,
          stock_quantity: stock
        }]
    saveCart(next)
    setCart(next)
    return { ok: true }
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    const current = readCart()
    const requestedQuantity = Math.floor(Number(quantity))
    const item = current.find((cartItem) => String(cartItem.id) === String(id))
    const stock = Math.max(0, Math.floor(Number(item?.stock_quantity) || 0))
    const normalizedQuantity = requestedQuantity <= Number(item?.quantity || 0)
      ? requestedQuantity
      : Math.min(requestedQuantity, stock)
    const next = !Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0
      ? current.filter((item) => String(item.id) !== String(id))
      : current.map((item) => String(item.id) === String(id) ? { ...item, quantity: normalizedQuantity } : item)
    saveCart(next)
    setCart(next)
  }, [])

  const syncStock = useCallback((products) => {
    const stockById = new Map(products.map((product) => [String(product.id), Math.max(0, Math.floor(Number(product.stock_quantity) || 0))]))
    const current = readCart()
    let changed = false
    const next = current.map((item) => {
      const stock = stockById.get(String(item.id)) ?? 0
      if (Number(item.stock_quantity) === stock) return item
      changed = true
      return { ...item, stock_quantity: stock }
    })
    if (!changed) return
    saveCart(next)
    setCart(next)
  }, [])

  const removeItem = useCallback((id) => {
    const next = readCart().filter((item) => String(item.id) !== String(id))
    saveCart(next)
    setCart(next)
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setCart([])
  }, [])

  const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0)
  const total = cart.reduce((sum, item) => sum + Math.round(Number(item.price || 0) * 100) * Number(item.quantity || 0), 0) / 100
  return { cart, count, total, addItem, updateQuantity, removeItem, clearCart, syncStock }
}

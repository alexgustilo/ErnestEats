import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../features/cart/useCart'
import { createOrder } from '../../features/orders/ordersApi'

function peso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function Checkout() {
  const { cart, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (!cart.length || loading) return
    setLoading(true)
    setError('')
    try {
      const order = await createOrder({ items: cart.map((item) => ({ product_id: item.product_id || item.id, quantity: Number(item.quantity) })) })
      clearCart()
      setPlacedOrder(order)
    } catch (err) {
      setError(err.message || 'Hindi ma-place ang order. Subukan ulit.')
    } finally {
      setLoading(false)
    }
  }

  if (placedOrder) {
    return <main className="mx-auto min-h-[60vh] max-w-3xl px-5 py-12"><section className="rounded-2xl border border-[#EAD9BC] bg-white p-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">✓</span><h1 className="mt-4 text-2xl font-extrabold">Order received!</h1><p className="mt-2 text-sm leading-6 text-[#756957]">Ihahanda namin ang order mo. Magbayad sa counter pag-pickup.</p><p className="mt-4 text-sm">Order #{String(placedOrder.id).slice(0, 8).toUpperCase()}</p><button onClick={() => navigate('/customer/orders')} className="mt-6 rounded-xl bg-[#E8531D] px-5 py-3 text-sm font-bold text-white">View my orders</button></section></main>
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-9 sm:px-8">
      <button onClick={() => navigate('/customer/cart')} className="mb-5 text-sm font-bold text-[#8A4A24]">← Back to cart</button>
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="mt-2 text-sm text-[#8A7A61]">Confirm your pickup order.</p>
      {!cart.length ? <section className="mt-6 rounded-2xl bg-white p-8"><p className="font-bold">Your cart is empty.</p><Link className="mt-4 inline-block text-[#B23F14]" to="/customer/menu">Browse menu</Link></section> : (
        <form onSubmit={handleSubmit} className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-[#EAD9BC] bg-white p-5"><h2 className="text-lg font-extrabold">Order items</h2><div className="mt-3 divide-y divide-[#EAD9BC]">{cart.map((item) => <div key={item.id} className="flex justify-between gap-4 py-4"><div><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#8A7A61]">Quantity: {item.quantity}</p></div><p className="shrink-0 font-semibold">{peso(Number(item.price) * Number(item.quantity))}</p></div>)}</div></section>
          <aside className="h-fit rounded-2xl border border-[#EAD9BC] bg-white p-5"><h2 className="text-lg font-extrabold">Pickup and payment</h2><p className="mt-3 text-sm leading-6 text-[#756957]">Pickup at Ernest Kitchen &amp; Streetfood. Cash payment at the counter.</p><div className="mt-5 flex justify-between border-t border-[#EAD9BC] pt-4 font-extrabold"><span>Total</span><span>{peso(total)}</span></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-5 w-full rounded-xl bg-[#E8531D] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Placing order…' : 'Place order'}</button></aside>
        </form>
      )}
    </main>
  )
}

export default Checkout

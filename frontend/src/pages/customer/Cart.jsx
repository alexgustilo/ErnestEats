import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../features/cart/useCart'
import { useProducts } from '../../features/products/useProducts'
import { useEffect, useState } from 'react'

function peso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function Cart() {
  const { cart, total, updateQuantity, removeItem, syncStock } = useCart()
  const { products, fetchProducts, loading: productsLoading, error: productsError } = useProducts()
  const navigate = useNavigate()
  const [stockVerified, setStockVerified] = useState(false)

  useEffect(() => {
    setStockVerified(false)
    fetchProducts()
      .then((freshProducts) => {
        syncStock(freshProducts)
        setStockVerified(true)
      })
      .catch(() => setStockVerified(false))
  }, [fetchProducts, syncStock])
  const stockIssues = cart.filter((item) => Number(item.stock_quantity || 0) < Number(item.quantity))

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-9 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[#B23F14]">Pickup order</p>
      <h1 className="mt-2 text-3xl font-extrabold">Your cart</h1>
      <p className="mt-2 text-sm text-[#8A7A61]">Review your items before checkout.</p>
      {!cart.length ? (
        <section className="mt-7 rounded-2xl border border-[#EAD9BC] bg-white p-10 text-center">
          <p className="text-lg font-bold">Your cart is empty.</p>
          <p className="mt-2 text-sm text-[#8A7A61]">Choose some items from the menu first.</p>
          <Link to="/customer/menu" className="mt-5 inline-flex rounded-xl bg-[#E8531D] px-5 py-3 text-sm font-bold text-white">Browse menu</Link>
        </section>
      ) : (
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">
            {cart.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 border-b border-[#EAD9BC] p-5 last:border-0 sm:flex-row sm:items-center">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="h-24 w-full rounded-xl object-cover sm:w-28" /> : <div className="flex h-24 w-full items-end rounded-xl bg-[radial-gradient(ellipse_at_70%_30%,rgba(232,83,29,.2),transparent_45%),linear-gradient(145deg,#E8D9C1,#CDB999)] p-3 sm:w-28"><span className="text-[9px] font-bold uppercase tracking-widest text-[#604D39]">Fresh</span></div>}
                <div className="min-w-0 flex-1"><h2 className="font-extrabold">{item.name}</h2><p className="mt-1 text-sm text-[#8A7A61]">{peso(item.price)} each</p><p className={`mt-1 text-xs font-semibold ${Number(item.stock_quantity || 0) > 0 ? 'text-[#58734A]' : 'text-red-600'}`}>{productsLoading ? 'Checking stock…' : Number(item.stock_quantity || 0) > 0 ? `${item.stock_quantity} available` : 'Out of stock'}{Number(item.quantity) > Number(item.stock_quantity || 0) ? ' · Reduce quantity or remove this item' : ''}</p></div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)} className="h-9 w-9 rounded-lg border border-[#EAD9BC] font-bold" aria-label="Decrease quantity">−</button>
                  <span className="min-w-6 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)} disabled={productsLoading || Number(item.quantity) >= Number(item.stock_quantity || 0)} className="h-9 w-9 rounded-lg border border-[#EAD9BC] font-bold disabled:cursor-not-allowed disabled:opacity-40" aria-label="Increase quantity">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-left text-sm font-bold text-red-600 hover:underline">Remove</button>
              </article>
            ))}
          </section>
          <aside className="h-fit rounded-2xl border border-[#EAD9BC] bg-white p-5">
            <h2 className="text-lg font-extrabold">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm"><span>Items</span><span>{cart.reduce((n, item) => n + Number(item.quantity), 0)}</span></div>
            <div className="mt-4 flex justify-between border-t border-[#EAD9BC] pt-4 font-extrabold"><span>Total</span><span>{peso(total)}</span></div>
            <p className="mt-4 rounded-xl bg-[#FBF1DE] p-3 text-xs leading-5 text-[#756957]">Pickup only. Pay at the counter when you pick up your order.</p>
            {productsError && <p role="alert" className="mt-4 text-sm text-red-700">Could not verify current stock. Refresh the page before checkout.</p>}
            {stockIssues.length > 0 && <p role="alert" className="mt-4 text-sm text-red-700">Some quantities exceed current stock. Adjust or remove those items to continue.</p>}
            <button onClick={() => navigate('/customer/checkout')} disabled={!stockVerified || productsLoading || stockIssues.length > 0 || cart.some((item) => Number(item.stock_quantity || 0) <= 0)} className="mt-5 w-full rounded-xl bg-[#E8531D] px-5 py-3 text-sm font-bold text-white hover:bg-[#B23F14] disabled:cursor-not-allowed disabled:opacity-50">{productsLoading || !stockVerified && !productsError ? 'Checking stock…' : 'Continue to checkout'}</button>
            <Link to="/customer/menu" className="mt-3 block text-center text-sm font-bold text-[#8A4A24]">Continue shopping</Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Cart

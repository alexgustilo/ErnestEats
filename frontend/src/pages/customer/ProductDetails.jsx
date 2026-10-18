import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../../features/products/useProducts'
import { useCategories } from '../../features/categories/useCategories'
import { useCart } from '../../features/cart/useCart'

function peso(value) { return `₱${Number(value || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}` }

function ProductDetails() {
  const { id } = useParams()
  const { products, fetchProducts, loading, error } = useProducts()
  const { categories, fetchCategories } = useCategories()
  const { addItem } = useCart()
  useEffect(() => { fetchProducts().catch(() => {}); fetchCategories().catch(() => {}) }, [])
  const product = useMemo(() => products.find((item) => String(item.id) === id), [products, id])
  const category = categories.find((item) => item.id === product?.category_id)?.name || 'Uncategorized'

  if (loading && !product) return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 text-[#8A7A61]">Loading product…</main>
  if (error || !product) return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12"><h1 className="text-2xl font-extrabold">Product not found</h1><Link to="/customer/menu" className="mt-4 inline-block text-[#B23F14]">Back to menu</Link></main>

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-9 sm:px-8">
      <Link to="/customer/menu" className="mb-6 inline-block text-sm font-bold text-[#8A4A24]">← Back to menu</Link>
      <section className="grid overflow-hidden rounded-3xl border border-[#EAD9BC] bg-white md:grid-cols-2">
        {product.image_url ? <img src={product.image_url} alt={product.name} className="h-72 w-full object-cover md:h-full" /> : <div className="flex min-h-72 items-end bg-[radial-gradient(ellipse_at_70%_30%,rgba(232,83,29,.12),transparent_45%),linear-gradient(145deg,#EAE2D6,#D5C8B5)] p-8"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#604D39]">Ernest Kitchen · Freshly made</span></div>}
        <div className="p-6 sm:p-10"><p className="text-sm font-bold text-[#8A7A61]">{category}</p><h1 className="mt-2 text-3xl font-extrabold">{product.name}</h1><p className="mt-5 leading-7 text-[#756957]">{product.description || 'Freshly prepared to order.'}</p><p className="mt-6 text-2xl font-extrabold text-[#B23F14]">{peso(product.price)}</p><div className="mt-7 rounded-xl bg-[#FBF1DE] p-4"><p className="font-bold">Pickup only · Pay at counter</p><p className="mt-1 text-sm text-[#756957]">We’ll prepare your order for pickup at Ernest Kitchen &amp; Streetfood.</p></div><button onClick={() => addItem(product)} disabled={!product.is_available} className="mt-6 w-full rounded-xl bg-[#E8531D] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{product.is_available ? 'Add to cart' : 'Currently unavailable'}</button></div>
      </section>
    </main>
  )
}

export default ProductDetails

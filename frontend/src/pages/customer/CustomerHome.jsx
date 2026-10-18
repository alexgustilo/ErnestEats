import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../features/products/useProducts'
import { useCart } from '../../features/cart/useCart'

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function CustomerHome() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products, fetchProducts, loading, error } = useProducts()

  useEffect(() => { fetchProducts().catch(() => {}) }, [])

  const availableProducts = products.filter((product) => product.is_available)
  const featuredProducts = availableProducts.slice(0, 4)
  const heroProduct = availableProducts.find((product) => product.image_url)

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-12">
      <section className="grid min-h-[430px] overflow-hidden rounded-3xl border border-[#E8D8BE] bg-white lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col items-start justify-center px-7 py-12 sm:px-12 lg:px-14">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#B6532B]"><span className="h-px w-8 bg-[#E8531D]" />Ernest Kitchen · Streetfood</p>
          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-[#29241E] sm:text-5xl">Streetfood,<br /><span className="text-[#B6532B]">made to order.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#746B60]">Your favorites, freshly prepared when you order. Browse the menu and order ahead. We’ll prepare your food for pickup at the counter.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3"><span className="rounded-full border border-[#E8D8BE] bg-[#FAF7F1] px-4 py-2 text-xs font-semibold text-[#4D453B]">Pickup only</span><span className="text-sm text-[#817565]">Pay in cash at pickup</span></div>
          <button type="button" onClick={() => navigate('/customer/menu')} className="mt-8 rounded-xl bg-[#E8531D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C9481B]">Explore the menu <span aria-hidden="true" className="ml-2">→</span></button>
        </div>
        <div className="relative min-h-[290px] lg:min-h-full">
          {heroProduct?.image_url ? <img src={heroProduct.image_url} alt={heroProduct.name} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(232,83,29,.12),transparent_45%),linear-gradient(135deg,#EAE2D6,#D5C8B5)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 rounded-xl border border-white/40 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7">
            <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#A54A26]">Kitchen favorite</p><p className="mt-1 text-lg font-bold text-[#29241E]">{heroProduct?.name || 'Made fresh when you order'}</p></div>
            {heroProduct && <span className="shrink-0 text-sm font-bold text-[#29241E]">{formatPeso(heroProduct.price)}</span>}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A54A26]">Made fresh daily</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-[#29241E]">On the menu</h2><p className="mt-2 text-sm text-[#817565]">A few favorites to get you started.</p></div>
          <button type="button" onClick={() => navigate('/customer/menu')} className="text-sm font-extrabold text-[#B23F14] hover:underline">View full menu <span aria-hidden="true">→</span></button>
        </div>
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-12 text-center text-[#817565]">Loading menu…</p> : featuredProducts.length === 0 ? <p className="rounded-2xl border border-[#EAD9BC] bg-white p-8 text-center text-[#817565]">Wala pang available products.</p> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-2xl border border-[#E8D8BE] bg-white transition hover:border-[#D7B996] hover:shadow-md">
                <button type="button" onClick={() => navigate(`/customer/products/${product.id}`)} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#E7D7BE] text-left">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-end bg-[radial-gradient(ellipse_at_70%_30%,rgba(232,83,29,.12),transparent_45%),linear-gradient(145deg,#EAE2D6,#D5C8B5)] p-4"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#604D39]">Ernest Kitchen</span></div>}
                </button>
                <div className="p-4"><button type="button" onClick={() => navigate(`/customer/products/${product.id}`)} className="text-left font-extrabold hover:text-[#B23F14]">{product.name}</button><div className="mt-4 flex items-center justify-between"><span className="font-bold text-[#A54A26]">{formatPeso(product.price)}</span><button type="button" onClick={() => addItem(product)} className="rounded-lg border border-[#D9CCBA] px-4 py-2 text-xs font-semibold text-[#332B22] transition hover:border-[#A54A26] hover:text-[#A54A26]">Add to cart</button></div></div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 pb-12 md:grid-cols-3">
        {[['Pickup location', 'Ernest Kitchen & Streetfood, main branch'], ['Store hours', '10:00 AM – 9:00 PM daily'], ['How it works', 'Order online → we prepare it → pick up and pay at the counter']].map(([title, description]) => <article key={title} className="rounded-2xl border border-[#E8D8BE] bg-white p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9B8060]">{title}</p><p className="mt-3 text-sm leading-6 text-[#3D352C]">{description}</p></article>)}
      </section>
    </main>
  )
}

export default CustomerHome

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../features/products/useProducts'
import { useCart } from '../../features/cart/useCart'

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

// Editorial food photography selected from Unsplash photos marked free under the Unsplash License.
const FOOD_PHOTOS = [
  {
    id: 'sisig',
    title: 'Sizzling sisig',
    keywords: /sisig/i,
    image: 'https://images.unsplash.com/photo-1646821195934-fb7ddb6166ab?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 'turon',
    title: 'Banana cue',
    keywords: /turon|banana/i,
    image: 'https://images.unsplash.com/photo-1540714605746-4f474eefc6d4?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 'kwek-kwek',
    title: 'Kwek-kwek',
    keywords: /kwek|tokneneng/i,
    image: 'https://images.unsplash.com/photo-1642616128754-7d026f979317?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 'burger',
    title: 'Filipino beef burger',
    keywords: /burger/i,
    image: 'https://images.unsplash.com/photo-1565016050896-d5f362810b48?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 'siomai',
    title: 'Siomai rice',
    keywords: /siomai|shumai/i,
    image: 'https://images.unsplash.com/photo-1717768448876-d62cd1f3182e?auto=format&fit=crop&w=1600&q=85'
  }
]

function CustomerHome() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products, fetchProducts, loading, error } = useProducts()
  const [activeSlide, setActiveSlide] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)

  useEffect(() => { fetchProducts().catch(() => {}) }, [fetchProducts])

  const availableProducts = useMemo(
    () => products.filter((product) => product.is_available),
    [products]
  )
  const featuredProducts = availableProducts.slice(0, 4)
  const slides = useMemo(() => FOOD_PHOTOS.map((photo) => {
    const product = availableProducts.find((item) =>
      photo.keywords.test(`${item.name || ''} ${item.description || ''}`)
    )

    return { ...photo, product, image: product?.image_url || photo.image }
  }), [availableProducts])

  useEffect(() => {
    if (isCarouselPaused) return undefined

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [slides.length, isCarouselPaused])

  const currentSlide = slides[activeSlide]

  function changeSlide(direction) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

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
        <div
          className="group relative min-h-[360px] overflow-hidden bg-[#D8C8B2] lg:min-h-full"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured Filipino street food"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onFocusCapture={() => setIsCarouselPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsCarouselPaused(false)
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(232,83,29,.18),transparent_45%),linear-gradient(135deg,#EAE2D6,#B5A48F)]" />
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.product?.name || currentSlide.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            onError={(event) => { event.currentTarget.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:left-7 sm:top-7">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F3A93B]" />
            {currentSlide.product ? 'On our menu' : 'Filipino street-food favorite'}
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
            <div className="min-w-0 rounded-xl border border-white/35 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#A54A26]">{currentSlide.product ? currentSlide.product.category?.name || 'Kitchen favorite' : 'Made for Ernest Kitchen'}</p>
              <p className="mt-1 truncate text-lg font-bold text-[#29241E] sm:text-xl">{currentSlide.product?.name || currentSlide.title}</p>
              <button type="button" onClick={() => navigate(currentSlide.product ? `/customer/products/${currentSlide.product.id}` : '/customer/menu')} className="mt-2 block text-xs font-bold text-[#A54A26] hover:underline">
                {currentSlide.product ? 'View menu item' : 'Browse the menu'} <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-3">
              {currentSlide.product && <span className="rounded-full bg-white px-3 py-1.5 text-sm font-extrabold text-[#29241E]">{formatPeso(currentSlide.product.price)}</span>}
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous food photo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/30 text-xl text-white backdrop-blur-sm transition hover:bg-black/55">‹</button>
                <button type="button" onClick={() => changeSlide(1)} aria-label="Next food photo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/30 text-xl text-white backdrop-blur-sm transition hover:bg-black/55">›</button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-3" aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>
            {slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show ${slide.product?.name || slide.title}`} aria-current={activeSlide === index ? 'true' : undefined} className={`h-1.5 rounded-full transition-all ${activeSlide === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white'}`} />)}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A54A26]">Made fresh daily</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-[#29241E]">On the menu</h2><p className="mt-2 text-sm text-[#817565]">A few favorites to get you started.</p></div>
          <button type="button" onClick={() => navigate('/customer/menu')} className="text-sm font-extrabold text-[#B23F14] hover:underline">View full menu <span aria-hidden="true">→</span></button>
        </div>
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-12 text-center text-[#817565]">Loading menu…</p> : featuredProducts.length === 0 ? <p className="rounded-2xl border border-[#EAD9BC] bg-white p-8 text-center text-[#817565]">No products are available right now.</p> : (
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

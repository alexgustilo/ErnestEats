import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../../features/products/useProducts'
import { useCategories } from '../../features/categories/useCategories'
import { useCart } from '../../features/cart/useCart'
import { Link } from 'react-router-dom'

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

function CustomerMenu() {
  const { addItem } = useCart()
  const {
    products,
    fetchProducts,
    loading: productsLoading,
    error: productsError
  } = useProducts()

  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
    error: categoriesError
  } = useCategories()

  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cartNotice, setCartNotice] = useState('')

  useEffect(() => {
    fetchProducts().catch(() => {})
    fetchCategories().catch(() => {})
  }, [fetchProducts, fetchCategories])

  const availableProducts = useMemo(
    () => products.filter((product) => product.is_available),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return availableProducts.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || String(product.category_id) === String(activeCategory)

      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [availableProducts, activeCategory, search])

  function getCategoryName(categoryId) {
    return categories.find((category) => String(category.id) === String(categoryId))?.name ||
      'Uncategorized'
  }

  const loading = productsLoading || categoriesLoading
  const error = productsError || categoriesError

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-[1440px] flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:px-12">
      <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:h-fit lg:w-60">
        <h1 className="mb-6 text-3xl font-black tracking-tight">Menu</h1>

        <label className="mb-6 block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-[#8A7A61]">
            Search menu
          </span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a product"
            className="w-full rounded-xl border border-[#EAD9BC] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E8531D]"
          />
        </label>

        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#8A7A61]">
          Categories
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
              activeCategory === 'all'
                ? 'bg-[#241A12] text-white'
                : 'text-[#8A7A61] hover:bg-white'
            }`}
          >
            All products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(String(category.id))}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                activeCategory === String(category.id)
                  ? 'bg-[#241A12] text-white'
                  : 'text-[#8A7A61] hover:bg-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0 flex-1">

        {cartNotice && <p role="status" className="mb-4 rounded-xl border border-[#EAD9BC] bg-white p-3 text-sm text-[#8A4A24]">{cartNotice}</p>}

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-8 text-center text-[#8A7A61]">Loading menu…</p>
        ) : filteredProducts.length === 0 ? (
          <p className="rounded-2xl border border-[#EAD9BC] bg-white p-8 text-center text-[#8A7A61]">
            No available products match your search or selected category.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#E8D8BE] bg-white transition hover:border-[#D7B996] hover:shadow-md"
              >
                <Link to={`/customer/products/${product.id}`} className="block h-40 overflow-hidden bg-[#E7D7BE]">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-end bg-[radial-gradient(ellipse_at_70%_30%,rgba(232,83,29,.12),transparent_45%),linear-gradient(145deg,#EAE2D6,#D5C8B5)] p-4"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#604D39]">Ernest Kitchen</span></div>
                  )}
                </Link>

                <div className="p-4">
                  <p className="text-xs font-semibold text-[#8A7A61]">
                    {getCategoryName(product.category_id)}
                  </p>

                  <Link to={`/customer/products/${product.id}`} className="mt-1 block text-lg font-extrabold hover:text-[#B23F14]">{product.name}</Link>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-[#8A7A61]">
                    {product.description || 'Freshly prepared to order.'}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-extrabold text-[#B23F14]">
                      {formatPeso(product.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const result = addItem(product)
                        setCartNotice(result?.ok ? `${product.name} added to cart.` : result?.message || 'Could not add this item.')
                      }}
                      disabled={Number(product.stock_quantity) <= 0}
                      className="rounded-lg bg-[#E8531D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C9481B] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {Number(product.stock_quantity) > 0 ? 'Add to cart' : 'Out of stock'}
                    </button>
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${Number(product.stock_quantity) > 0 ? 'text-[#58734A]' : 'text-red-600'}`}>
                    {Number(product.stock_quantity) > 0 ? `${product.stock_quantity} available` : 'Currently out of stock'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default CustomerMenu

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInventory } from '../../features/inventory/useInventory'
import { useProducts } from '../../features/products/useProducts'
import { useCategories } from '../../features/categories/useCategories'
import AdminPagination from '../../components/admin/AdminPagination'

const emptyForm = {
  product_id: '',
  stock_quantity: '',
  low_stock_threshold: '5'
}

function getStockStatus(stock, threshold, isAvailable = true) {
  if (Number(stock) <= 0) {
    return {
      label: 'Out of stock',
      style: 'bg-red-100 text-red-700'
    }
  }

  if (!isAvailable) {
    return {
      label: 'Unavailable',
      style: 'bg-[#EEE9D9] text-[#8D7655]'
    }
  }

  if (Number(stock) <= Number(threshold)) {
    return {
      label: 'Low stock',
      style: 'bg-orange-100 text-orange-700'
    }
  }

  return {
    label: 'Available',
    style: 'bg-[#E0EEE5] text-[#315D4D]'
  }
}

function AdminInventory() {
  const {
    inventory,
    fetchInventory,
    addInventory,
    editInventory,
    loading: inventoryLoading,
    error: inventoryError
  } = useInventory()

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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchInventory().catch(() => {})
    fetchProducts().catch(() => {})
    fetchCategories().catch(() => {})
  }, [fetchInventory, fetchProducts, fetchCategories])

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  function openEditForm(item) {
    setEditingId(item.id)
    setForm({
      product_id: item.product_id || '',
      stock_quantity: String(item.stock_quantity ?? ''),
      low_stock_threshold: String(item.low_stock_threshold ?? '5')
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const inventoryData = {
      product_id: form.product_id,
      stock_quantity: Number(form.stock_quantity),
      low_stock_threshold: Number(form.low_stock_threshold)
    }

    try {
      if (editingId) {
        await editInventory(editingId, inventoryData)
      } else {
        await addInventory(inventoryData)
      }

      closeForm()
    } catch {
      // useInventory exposes the error through inventoryError.
    }
  }

  const getProductName = useCallback((productId) => {
    const product = products.find((item) => String(item.id) === String(productId))
    return product?.name || `Product ${String(productId).slice(0, 6)}`
  }, [products])

  const getProductCategory = useCallback((productId) => {
    const product = products.find((item) => String(item.id) === String(productId))
    return categories.find((category) => String(category.id) === String(product?.category_id))?.name || 'Uncategorized'
  }, [products, categories])

  const loading = inventoryLoading || productsLoading || categoriesLoading
  const error = inventoryError || productsError || categoriesError
  const inventoryRows = useMemo(() => {
    const inventoryProductIds = new Set(inventory.map((item) => String(item.product_id)))
    return [
      ...inventory,
      ...products
        .filter((product) => !inventoryProductIds.has(String(product.id)))
        .map((product) => ({
          id: null,
          product_id: product.id,
          stock_quantity: Number(product.stock_quantity) || 0,
          low_stock_threshold: 5,
          needsInventoryRecord: true
        }))
    ]
  }, [inventory, products])

  const maxStock = Math.max(
    1,
    ...inventoryRows.map((item) => Number(item.stock_quantity) || 0)
  )

  const trackedProductIds = inventory.map((item) => item.product_id)
  const availableProducts = products.filter(
    (product) => !trackedProductIds.some((id) => String(id) === String(product.id))
  )
  const visibleInventory = useMemo(() => inventoryRows.filter((item) =>
    `${getProductName(item.product_id)} ${getProductCategory(item.product_id)}`.toLowerCase().includes(query.trim().toLowerCase()) &&
    (categoryFilter === 'all' || getProductCategory(item.product_id) === categoryFilter)
  ), [inventoryRows, getProductName, getProductCategory, query, categoryFilter])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleInventory.length / pageSize))
  const pageInventory = visibleInventory.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])
  const selectedProduct = products.find((product) => String(product.id) === String(form.product_id))
  const selectedProductCategory = categories.find((category) => String(category.id) === String(selectedProduct?.category_id))?.name || 'Uncategorized'
  const lowStockCount = inventoryRows.filter((item) => Number(item.stock_quantity) <= Number(item.low_stock_threshold)).length

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Inventory</h1>
          <p className="mt-1 text-sm text-[#9A8061]">
            Stock per menu item
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openAddForm} className="rounded-lg bg-[#2B211A] px-4 py-2 text-sm font-bold text-white hover:bg-[#44362B]">+ Update stock</button>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search product or category" aria-label="Search inventory" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
          <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1) }} aria-label="Filter inventory by category" className="rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]">
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            {categories.length === 0 && inventoryRows.some((item) => getProductCategory(item.product_id) === 'Uncategorized') && <option value="Uncategorized">Uncategorized</option>}
          </select>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${lowStockCount ? 'bg-[#FBEAD3] text-[#8A5A0E]' : 'bg-[#E0EEE5] text-[#315D4D]'}`}>{lowStockCount} low or out of stock</span>
      </div>

      <AdminPagination total={visibleInventory.length} page={page} pageSize={pageSize} onPageChange={setPage} />

      <section className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[#F2ECDD] text-[#927859]">
              <tr>
                <th className="px-4 py-4 font-medium">Product</th>
                <th className="px-4 py-4 font-medium">Category</th>
                <th className="px-4 py-4 font-medium">Stock level</th>
                <th className="px-4 py-4 font-medium">Qty left</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageInventory.map((item) => {
                const stock = Number(item.stock_quantity) || 0
                const threshold = Number(item.low_stock_threshold) || 0
                const product = products.find((entry) => String(entry.id) === String(item.product_id))
                const status = getStockStatus(stock, threshold, product?.is_available !== false)
                const barWidth = Math.min((stock / maxStock) * 100, 100)

                return (
                  <tr key={item.id || item.product_id} className="border-t border-[#EAD8B9]">
                    <td className="px-4 py-4">
                      {getProductName(item.product_id)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-[#E8D8BE] bg-[#FAF6EE] px-3 py-1 text-xs font-semibold text-[#765B3C]">
                        {getProductCategory(item.product_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex min-w-[150px] items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-[#EAD8B9]">
                          <div
                            className={`h-full rounded-full ${
                              stock <= 0
                                ? 'bg-red-500'
                                : stock <= threshold
                                  ? 'bg-orange-400'
                                  : 'bg-[#315D4D]'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span>{stock}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">{stock}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${status.style}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="rounded-lg border border-[#2B211A] px-3 py-1.5 text-xs font-bold hover:bg-[#F8F0DD]"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!loading && visibleInventory.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-[#9A8061]"
                  >
                    {products.length === 0 ? 'No products found.' : 'No inventory items match this search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="border-t border-[#EAD8B9] px-4 py-3 text-sm text-[#9A8061]">
            Loading inventory…
          </p>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
          >
            <h2 className="mb-5 text-xl font-extrabold">
              {editingId || form.product_id ? 'Update stock' : 'Add inventory record'}
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">
                Product
                <select
                  name="product_id"
                  value={form.product_id}
                  onChange={handleChange}
                  required
                  disabled={Boolean(editingId)}
                  className="mt-2 w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3 outline-none focus:border-[#E8531D] disabled:bg-gray-100"
                >
                  <option value="">Choose a product</option>

                  {editingId && (
                    <option value={form.product_id}>
                      {getProductName(form.product_id)}
                    </option>
                  )}

                  {!editingId &&
                    availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </label>

              <section aria-live="polite" className="rounded-xl border border-[#EAD9BC] border-l-4 border-l-[#E8531D] bg-[#FAF6EE] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9A8061]">Selected menu item</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-[#2B211A]">{selectedProduct?.name || 'Choose a product above'}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#765B3C] ring-1 ring-[#E8D8BE]">
                    {selectedProduct ? selectedProductCategory : 'Category'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#9A8061]">The category follows the selected product.</p>
              </section>

              <label className="block text-sm font-semibold">
                Stock quantity
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Low-stock threshold
                <input
                  name="low_stock_threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={form.low_stock_threshold}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-[#D9C9AF] px-4 py-2 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={inventoryLoading}
                className="rounded-lg bg-[#E8531D] px-4 py-2 text-sm font-bold text-white hover:bg-[#C94316] disabled:opacity-60"
              >
                {inventoryLoading ? 'Saving…' : 'Save stock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

export default AdminInventory

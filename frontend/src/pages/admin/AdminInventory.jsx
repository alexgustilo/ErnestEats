import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInventory } from '../../features/inventory/useInventory'
import { useProducts } from '../../features/products/useProducts'

const emptyForm = {
  product_id: '',
  stock_quantity: '',
  low_stock_threshold: '5'
}

function getStockStatus(stock, threshold) {
  if (Number(stock) <= 0) {
    return {
      label: 'Out of stock',
      style: 'bg-red-100 text-red-700'
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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchInventory().catch(() => {})
    fetchProducts().catch(() => {})
  }, [fetchInventory, fetchProducts])

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
    const product = products.find((item) => item.id === productId)
    return product?.name || `Product ${String(productId).slice(0, 6)}`
  }, [products])

  const loading = inventoryLoading || productsLoading
  const error = inventoryError || productsError
  const maxStock = Math.max(
    1,
    ...inventory.map((item) => Number(item.stock_quantity) || 0)
  )

  const trackedProductIds = inventory.map((item) => item.product_id)
  const availableProducts = products.filter(
    (product) => !trackedProductIds.some((id) => String(id) === String(product.id))
  )
  const visibleInventory = useMemo(() => inventory.filter((item) =>
    getProductName(item.product_id).toLowerCase().includes(query.trim().toLowerCase())
  ), [inventory, getProductName, query])
  const lowStockCount = inventory.filter((item) => Number(item.stock_quantity) <= Number(item.low_stock_threshold)).length

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
          <button type="button" onClick={() => { fetchInventory().catch(() => {}); fetchProducts().catch(() => {}) }} disabled={loading} className="rounded-lg border border-[#D8BD8F] bg-white px-4 py-2 text-sm font-bold text-[#756957] hover:text-[#241A12] disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh'}</button>
          <button type="button" onClick={openAddForm} className="rounded-lg bg-[#2B211A] px-4 py-2 text-sm font-bold text-white hover:bg-[#44362B]">+ Update stock</button>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory" aria-label="Search inventory" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${lowStockCount ? 'bg-[#FBEAD3] text-[#8A5A0E]' : 'bg-[#E0EEE5] text-[#315D4D]'}`}>{lowStockCount} low or out of stock</span>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[#F2ECDD] text-[#927859]">
              <tr>
                <th className="px-4 py-4 font-medium">Product</th>
                <th className="px-4 py-4 font-medium">Stock level</th>
                <th className="px-4 py-4 font-medium">Qty left</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleInventory.map((item) => {
                const stock = Number(item.stock_quantity) || 0
                const threshold = Number(item.low_stock_threshold) || 0
                const status = getStockStatus(stock, threshold)
                const barWidth = Math.min((stock / maxStock) * 100, 100)

                return (
                  <tr key={item.id} className="border-t border-[#EAD8B9]">
                    <td className="px-4 py-4">
                      {getProductName(item.product_id)}
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
                    colSpan="5"
                    className="px-4 py-8 text-center text-[#9A8061]"
                  >
                    {inventory.length === 0 ? 'No inventory records found.' : 'No inventory items match this search.'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-5 text-xl font-extrabold">
              {editingId ? 'Update stock' : 'Add inventory record'}
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

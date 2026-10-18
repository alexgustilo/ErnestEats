import { useEffect, useState } from 'react'
import { useProducts } from '../../features/products/useProducts'
import { useCategories } from '../../features/categories/useCategories'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_available: true,
  category_id: ''
}

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

function AdminProducts() {
  const {
    products,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
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

  useEffect(() => {
    fetchProducts().catch(() => {})
    fetchCategories().catch(() => {})
  }, [])

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  function openEditForm(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      image_url: product.image_url || '',
      is_available: Boolean(product.is_available),
      category_id: product.category_id || ''
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image_url: form.image_url.trim() || null,
      is_available: form.is_available,
      category_id: form.category_id || null
    }

    try {
      if (editingId) {
        await editProduct(editingId, productData)
      } else {
        await addProduct(productData)
      }

      closeForm()
    } catch {
      // Ipinapakita ng useProducts ang error sa productsError.
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    )

    if (!confirmed) return

    try {
      await removeProduct(product.id)
    } catch {
      // Ipinapakita ng useProducts ang error sa productsError.
    }
  }

  function getCategoryName(categoryId) {
    const category = categories.find((item) => item.id === categoryId)
    return category?.name || 'Uncategorized'
  }

  const error = productsError || categoriesError
  const loading = productsLoading || categoriesLoading

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="mt-1 text-sm text-[#9A8061]">
            Manage menu items, prices and availability
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-[#2B211A] px-4 py-2 text-sm font-bold text-white hover:bg-[#44362B]"
        >
          + Add product
        </button>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#EAD8B9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[#F2ECDD] text-[#927859]">
              <tr>
                <th className="px-4 py-4 font-medium">Product</th>
                <th className="px-4 py-4 font-medium">Category</th>
                <th className="px-4 py-4 font-medium">Price</th>
                <th className="px-4 py-4 font-medium">Availability</th>
                <th className="px-4 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#EAD8B9]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E2BD] text-xl">
                          🍽️
                        </span>
                      )}

                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {getCategoryName(product.category_id)}
                  </td>

                  <td className="px-4 py-4">
                    {formatPeso(product.price)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.is_available
                          ? 'bg-[#E0EEE5] text-[#315D4D]'
                          : 'bg-[#EEE9D9] text-[#8D7655]'
                      }`}
                    >
                      {product.is_available ? 'Visible' : 'Unavailable'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        className="rounded-lg border border-[#2B211A] px-3 py-1.5 text-xs font-bold hover:bg-[#F8F0DD]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-[#9A8061]"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="border-t border-[#EAD8B9] px-4 py-3 text-sm text-[#9A8061]">
            Loading products…
          </p>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">
                {editingId ? 'Edit product' : 'Add product'}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-1 text-xl text-[#8A7A61] hover:bg-[#F8F0DD]"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">
                Product name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Price
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Category
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3 outline-none focus:border-[#E8531D]"
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Image URL
                <input
                  name="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] px-4 py-3 outline-none focus:border-[#E8531D]"
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  name="is_available"
                  type="checkbox"
                  checked={form.is_available}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#E8531D]"
                />
                Product is available
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
                disabled={productsLoading}
                className="rounded-lg bg-[#E8531D] px-4 py-2 text-sm font-bold text-white hover:bg-[#C94316] disabled:opacity-60"
              >
                {productsLoading
                  ? 'Saving…'
                  : editingId
                    ? 'Save changes'
                    : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

export default AdminProducts
import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../../features/products/useProducts'
import { useCategories } from '../../features/categories/useCategories'
import AdminPagination from '../../components/admin/AdminPagination'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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
    addCategory,
    loading: categoriesLoading,
    error: categoriesError
  } = useCategories()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showCategoryCreator, setShowCategoryCreator] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryCreateError, setCategoryCreateError] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  useEffect(() => {
    fetchProducts().catch(() => {})
    fetchCategories().catch(() => {})
  }, [fetchCategories, fetchProducts])

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setPreviewUrl('')
    setFormError('')
    setShowCategoryCreator(false)
    setNewCategoryName('')
    setCategoryCreateError('')
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
    setImageFile(null)
    setPreviewUrl('')
    setFormError('')
    setShowCategoryCreator(false)
    setNewCategoryName('')
    setCategoryCreateError('')
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setPreviewUrl('')
    setFormError('')
    setShowCategoryCreator(false)
    setNewCategoryName('')
    setCategoryCreateError('')
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim()
    if (!name) {
      setCategoryCreateError('Enter a category name.')
      return
    }

    const existingCategory = categories.find(
      (category) => category.name.trim().toLowerCase() === name.toLowerCase()
    )
    if (existingCategory) {
      setForm((previousForm) => ({ ...previousForm, category_id: String(existingCategory.id) }))
      setShowCategoryCreator(false)
      setNewCategoryName('')
      setCategoryCreateError('')
      return
    }

    setIsCreatingCategory(true)
    setCategoryCreateError('')
    try {
      const category = await addCategory({ name })
      setForm((previousForm) => ({ ...previousForm, category_id: String(category.id) }))
      setShowCategoryCreator(false)
      setNewCategoryName('')
    } catch (err) {
      setCategoryCreateError(err.message || 'Could not create the category.')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === 'checkbox' ? checked : value
    }))
    setFormError('')
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null
    setFormError('')

    if (!file) {
      setImageFile(null)
      setPreviewUrl('')
      return
    }

    setImageFile(null)
    setPreviewUrl('')

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError('Choose a JPG, PNG, or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError('Choose an image that is 5 MB or less.')
      event.target.value = ''
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setIsSaving(true)

    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        is_available: form.is_available,
        category_id: form.category_id || null
      }

      if (editingId) {
        await editProduct(editingId, productData, imageFile)
      } else {
        await addProduct(productData, imageFile)
      }

      closeForm()
    } catch (err) {
      setFormError(err.message || 'Could not save the product.')
    } finally {
      setIsSaving(false)
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
      // useProducts exposes the error through productsError.
    }
  }

  function getCategoryName(categoryId) {
    const category = categories.find((item) => String(item.id) === String(categoryId))
    return category?.name || 'Uncategorized'
  }

  const error = productsError || categoriesError
  const loading = productsLoading || categoriesLoading
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || String(product.category_id) === categoryFilter
    const matchesText = `${product.name || ''} ${product.description || ''}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchesCategory && matchesText
  }), [products, categoryFilter, query])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const pageProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="mt-1 text-sm text-[#9A8061]">
            Manage menu items, prices and availability
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openAddForm} className="rounded-lg bg-[#2B211A] px-4 py-2 text-sm font-bold text-white hover:bg-[#44362B]">+ Add product</button>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search products" aria-label="Search products" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
        <div className="flex max-w-full items-center gap-2 overflow-x-auto py-1" aria-label="Filter products by category">
          <button type="button" onClick={() => { setCategoryFilter('all'); setPage(1) }} aria-pressed={categoryFilter === 'all'} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold ${categoryFilter === 'all' ? 'border-[#2B211A] bg-[#2B211A] text-white' : 'border-[#E6DCCF] bg-white text-[#756957] hover:border-[#B94E2B]'}`}>All products</button>
          {categories.map((category) => {
            const selected = categoryFilter === String(category.id)
            return <button key={category.id} type="button" onClick={() => { setCategoryFilter(String(category.id)); setPage(1) }} aria-pressed={selected} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold ${selected ? 'border-[#2B211A] bg-[#2B211A] text-white' : 'border-[#E6DCCF] bg-white text-[#756957] hover:border-[#B94E2B]'}`}>{category.name}</button>
          })}
        </div>
      </div>

      <AdminPagination total={visibleProducts.length} page={page} pageSize={pageSize} onPageChange={setPage} />

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
              {pageProducts.map((product) => (
                <tr key={product.id} className="border-t border-[#EAD8B9]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
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
                          disabled={loading}
                        onClick={() => openEditForm(product)}
                        className="rounded-lg border border-[#2B211A] px-3 py-1.5 text-xs font-bold hover:bg-[#F8F0DD]"
                      >
                        Edit
                      </button>

                        <button
                          type="button"
                          disabled={loading}
                        onClick={() => handleDelete(product)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && visibleProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-[#9A8061]"
                  >
                    {products.length === 0 ? 'No products found.' : 'No products match these filters.'}
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
                  onChange={(event) => {
                    if (event.target.value === '__create_category__') {
                      setShowCategoryCreator(true)
                      setCategoryCreateError('')
                      return
                    }
                    handleChange(event)
                  }}
                  className="mt-1 w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3 outline-none focus:border-[#E8531D]"
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="__create_category__">+ Create a category…</option>
                </select>
              </label>

              {showCategoryCreator && (
                <div className="rounded-xl border border-[#E6DCCF] bg-[#FAF9F6] p-4">
                  <label htmlFor="new-product-category" className="block text-sm font-semibold">New category name</label>
                  <div className="mt-2 flex gap-2">
                    <input id="new-product-category" value={newCategoryName} onChange={(event) => { setNewCategoryName(event.target.value); setCategoryCreateError('') }} autoFocus placeholder="For example, Rice Meals" className="min-w-0 flex-1 rounded-lg border border-[#E6DCCF] bg-white px-3 py-2 text-sm outline-none focus:border-[#E8531D]" />
                    <button type="button" onClick={handleCreateCategory} disabled={isCreatingCategory} className="shrink-0 rounded-lg bg-[#2B211A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#44362B] disabled:opacity-60">{isCreatingCategory ? 'Adding…' : 'Add'}</button>
                    <button type="button" onClick={() => { setShowCategoryCreator(false); setCategoryCreateError('') }} className="rounded-lg border border-[#D9C9AF] px-3 py-2 text-sm font-semibold">Cancel</button>
                  </div>
                  {categoryCreateError && <p role="alert" className="mt-2 text-sm text-red-700">{categoryCreateError}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold" htmlFor="product-image">Product image</label>
                <input id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="mt-2 block w-full cursor-pointer rounded-xl border border-[#E6DCCF] bg-white text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-[#F5E2BD] file:px-4 file:py-3 file:font-bold file:text-[#241A12] hover:file:bg-[#EED5A9]" />
                <p className="mt-1 text-xs text-[#8A7A61]">JPG, PNG, or WebP · up to 5 MB · securely uploaded by the server</p>
                {(previewUrl || form.image_url) && <img src={previewUrl || form.image_url} alt="Product preview" className="mt-3 h-36 w-full rounded-xl border border-[#EAD9BC] object-cover" />}
              </div>

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

            {formError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

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
                disabled={productsLoading || isSaving}
                className="rounded-lg bg-[#E8531D] px-4 py-2 text-sm font-bold text-white hover:bg-[#C94316] disabled:opacity-60"
              >
                {productsLoading || isSaving
                  ? imageFile ? 'Uploading image…' : 'Saving…'
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

import { useEffect, useMemo, useState } from 'react'
import { useOrders } from '../../features/orders/useOrders'
import { useProducts } from '../../features/products/useProducts'
import AdminPagination from '../../components/admin/AdminPagination'
import { getCustomerProfiles } from '../../features/profile/profileApi'

const stages = ['pending', 'confirmed', 'preparing', 'ready', 'completed']
const statusText = {
  pending: 'Order received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

function AdminNotifications() {
  const { orders, fetchOrders, loading, error } = useOrders()
  const { products, fetchProducts, loading: productsLoading, error: productsError } = useProducts()
  const [profiles, setProfiles] = useState([])
  const [profilesError, setProfilesError] = useState('')
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchOrders().catch(() => {})
    fetchProducts().catch(() => {})
    getCustomerProfiles()
      .then(setProfiles)
      .catch((fetchError) => setProfilesError(fetchError.message || 'Could not load customer names.'))
      .finally(() => setProfilesLoading(false))
  }, [fetchOrders, fetchProducts])

  const profilesById = useMemo(
    () => new Map(profiles.map((profile) => [String(profile.id), profile])),
    [profiles]
  )
  const productsById = useMemo(
    () => new Map(products.map((product) => [String(product.id), product])),
    [products]
  )
  const activity = useMemo(() => orders.map((order) => ({
    ...order,
    customerProfile: profilesById.get(String(order.customer_id)),
    itemSummary: (order.order_items || []).map((item) => {
      const product = item.product || productsById.get(String(item.product_id))
      return `${product?.name || 'Menu item'} ×${Number(item.quantity) || 1}`
    }).join(', ')
  }))
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .filter((order) => {
      const status = String(order.status || '').toLowerCase()
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const searchable = `${order.id} ${order.itemSummary} ${order.customerProfile?.full_name || ''} ${order.customerProfile?.contact_number || ''} ${status}`.toLowerCase()
      return matchesStatus && searchable.includes(query.trim().toLowerCase())
    }), [orders, profilesById, productsById, query, statusFilter])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(activity.length / pageSize))
  const pageActivity = activity.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const featured = activity.find((order) => stages.includes(String(order.status || '').toLowerCase()))
  const currentStatus = String(featured?.status || '').toLowerCase()
  const activeStage = stages.indexOf(currentStatus)
  const pageLoading = loading || productsLoading || profilesLoading

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <p className="mt-1 text-sm text-[#8A7A61]">Order status updates for customer pickups</p>
        </div>
      </header>

      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {profilesError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profilesError}</p>}
      {productsError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{productsError}</p>}
      {productsError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{productsError}</p>}

      {featured && (
        <section className="mb-6 rounded-2xl border border-[#EAD9BC] bg-white p-5 sm:p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-[#8A7A61]">
            Order progress · {featured.itemSummary || 'Items unavailable'} · #{String(featured.id).slice(0, 8)}
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {stages.map((stage, index) => {
              const complete = activeStage >= 0 && index < activeStage
              const active = index === activeStage
              return (
                <li key={stage} className="flex items-center gap-2 sm:flex-col sm:gap-2">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-[#315D4D] text-white' : active ? 'bg-[#E8531D] text-white' : 'bg-[#F1EBDD] text-[#8A7A61]'}`}>
                    {complete ? '✓' : index + 1}
                  </span>
                  <span className={`text-xs font-semibold ${active ? 'text-[#E8531D]' : 'text-[#756957]'}`}>{statusText[stage]}</span>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search order or customer name" aria-label="Search order updates" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }} aria-label="Filter updates by status" className="rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]">
          <option value="all">All statuses</option>
          {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{statusText[status]}</option>)}
        </select>
      </div>

      <AdminPagination total={activity.length} page={page} pageSize={pageSize} onPageChange={setPage} />

      <div className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-[#F0ECDD] text-[#8A7A61]"><tr><th className="px-4 py-4 font-semibold">Order items</th><th className="px-4 py-4 font-semibold">Customer</th><th className="px-4 py-4 font-semibold">Current update</th><th className="px-4 py-4 font-semibold">Last updated</th></tr></thead>
            <tbody>
              {pageActivity.map((order) => {
                const status = String(order.status || '').toLowerCase()
                return (
                  <tr key={order.id} className="border-t border-[#EAD9BC]">
                    <td className="px-4 py-4"><div className="max-w-[360px] font-medium text-[#2B211A]">{order.itemSummary || 'Items unavailable'}</div><span className="mt-1 block text-xs text-[#8A7A61]">Order #{String(order.id).slice(0, 8)}</span></td>
                    <td className="px-4 py-4 font-medium">{order.customerProfile?.full_name || 'Customer name unavailable'}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${status === 'cancelled' ? 'bg-red-100 text-red-700' : status === 'completed' || status === 'ready' ? 'bg-[#E0EEE5] text-[#315D4D]' : status === 'preparing' ? 'bg-[#FFEDD5] text-[#A65E0C]' : 'bg-[#EEE9D9] text-[#8D7655]'}`}>{statusText[status] || order.status || 'Status unavailable'}</span></td>
                    <td className="px-4 py-4 text-[#756957]">{formatDate(order.updated_at || order.created_at)}</td>
                  </tr>
                )
              })}
              {!pageLoading && activity.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-[#8A7A61]">{query || statusFilter !== 'all' ? 'No order updates match these filters.' : 'No order updates yet.'}</td></tr>}
            </tbody>
          </table>
        </div>
        {pageLoading && <p className="border-t border-[#EAD9BC] px-4 py-3 text-sm text-[#8A7A61]">Loading order updates…</p>}
      </div>
    </section>
  )
}

export default AdminNotifications

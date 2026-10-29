import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOrders } from '../../features/orders/useOrders'
import { useProducts } from '../../features/products/useProducts'
import { getCustomerProfiles } from '../../features/profile/profileApi'
import AdminPagination from '../../components/admin/AdminPagination'

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`
}

function getStatusClass(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'preparing') return 'bg-[#FFEDD5] text-[#A65E0C]'
  if (value === 'confirmed') return 'bg-[#FBEAD3] text-[#8A5A0E]'
  if (value === 'ready') return 'bg-[#E0EEE5] text-[#315D4D]'
  if (value === 'completed') return 'bg-[#E0EEE5] text-[#315D4D]'
  if (value === 'cancelled') return 'bg-red-100 text-red-700'
  return 'bg-[#EEE9D9] text-[#8D7655]'
}

function getNextAction(order) {
  const status = String(order.status || '').toLowerCase()
  if (status === 'pending') return { label: 'Confirm', updates: { status: 'confirmed' } }
  if (status === 'confirmed') return { label: 'Start preparing', updates: { status: 'preparing' } }
  if (status === 'preparing') return { label: 'Mark ready', updates: { status: 'ready' } }
  if (status === 'ready') return { label: 'Confirm pickup', updates: { status: 'completed', payment_status: 'paid' } }
  return null
}

function AdminOrders() {
  const { orders, fetchOrders, editOrder, cancelOrder, loading: ordersLoading, error: ordersError } = useOrders()
  const { products, fetchProducts, loading: productsLoading, error: productsError } = useProducts()
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [profiles, setProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState(null)
  const [actionNotice, setActionNotice] = useState('')

  const requestProfiles = useCallback(() => getCustomerProfiles(), [])

  useEffect(() => {
    fetchOrders().catch(() => {})
    fetchProducts().catch(() => {})
    requestProfiles()
      .then((data) => setProfiles(data))
      .catch((fetchError) => setProfilesError(fetchError.message))
      .finally(() => setProfilesLoading(false))
  }, [fetchOrders, fetchProducts, requestProfiles])

  const profilesById = useMemo(
    () => new Map(profiles.map((profile) => [String(profile.id), profile])),
    [profiles]
  )

  const visibleOrders = useMemo(() => orders.map((order) => ({
    ...order,
    customerProfile: profilesById.get(String(order.customer_id))
  })).filter((order) => {
    const status = String(order.status || '').toLowerCase()
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    const itemNames = (order.order_items || []).map((item) => item.product?.name || '').join(' ')
    const customerName = order.customerProfile?.full_name || ''
    const customerContact = order.customerProfile?.contact_number || ''
    const text = `${order.id} ${order.customer_id || ''} ${customerName} ${customerContact} ${itemNames} ${status}`.toLowerCase()
    return matchesStatus && text.includes(query.trim().toLowerCase())
  }), [orders, profilesById, query, statusFilter])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleOrders.length / pageSize))
  const pageOrders = visibleOrders.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  async function handleStatusUpdate(order, updates) {
    setUpdatingOrderId(order.id)
    setActionNotice('')
    try {
      const result = await editOrder(order.id, updates)
      setActionNotice(result.warning || 'Order updated successfully.')
    } catch {
      // The hook stores the API error for the page alert.
    } finally {
      setUpdatingOrderId(null)
    }
  }

  async function handleCancelOrder(order) {
    if (!window.confirm(`Cancel order #${String(order.id).slice(0, 8)}? Its reserved stock will be returned.`)) return
    setUpdatingOrderId(order.id)
    setActionNotice('')
    try {
      const result = await cancelOrder(order.id)
      setActionNotice(result.warning || 'Order cancelled and stock returned.')
    } catch {
      // The hook stores the API error for the page alert.
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const pageLoading = ordersLoading || productsLoading || profilesLoading
  const pageError = ordersError || productsError || profilesError

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold">Orders</h1><p className="mt-1 text-sm text-[#9A8061]">Manage incoming pickup orders</p></div>
      </header>

      {pageError && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</div>}
      {actionNotice && <div role="status" className="mb-5 rounded-xl border border-[#D6E8DC] bg-[#F0F8F2] px-4 py-3 text-sm text-[#315D4D]">{actionNotice}</div>}

      <div className="mb-4 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search order, customer, or item" aria-label="Search orders" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }} aria-label="Filter orders by status" className="rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]">
          <option value="all">All statuses</option>
          {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
        </select>
      </div>

      <AdminPagination total={visibleOrders.length} page={page} pageSize={pageSize} onPageChange={setPage} />

      <div className="overflow-hidden rounded-2xl border border-[#EAD8B9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-[#F2ECDD] text-[#927859]"><tr><th className="px-4 py-4 font-medium">Order ID</th><th className="px-4 py-4 font-medium">Customer</th><th className="px-4 py-4 font-medium">Items</th><th className="px-4 py-4 font-medium">Total</th><th className="px-4 py-4 font-medium">Payment</th><th className="px-4 py-4 font-medium">Status</th><th className="px-4 py-4 font-medium">Action</th></tr></thead>
            <tbody>
              {pageOrders.map((order) => {
                const nextAction = getNextAction(order)
                const orderItems = order.order_items || []
                const itemsText = orderItems.map((item) => {
                  const product = item.product || products.find((entry) => String(entry.id) === String(item.product_id))
                  return `${product?.name || `Product ${String(item.product_id || '').slice(0, 6)}`} ×${item.quantity}`
                }).join(', ')
                return (
                  <tr key={order.id} className="border-t border-[#EAD8B9]">
                    <td className="px-4 py-4">#{String(order.id).slice(0, 8)}</td>
                    <td className="px-4 py-4">{order.customerProfile?.full_name || (order.customer_id ? `Customer ${String(order.customer_id).slice(0, 6)}` : '—')}</td>
                    <td className="max-w-[260px] px-4 py-4">{itemsText || 'No items'}</td>
                    <td className="px-4 py-4">{formatPeso(order.total_amount)}</td>
                    <td className="px-4 py-4 capitalize">{order.payment_status || 'Unpaid'}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(order.status)}`}>{order.status || 'Unknown'}</span></td>
                    <td className="px-4 py-4"><div className="flex flex-wrap gap-2">{nextAction && <button type="button" disabled={pageLoading || updatingOrderId === order.id} onClick={() => handleStatusUpdate(order, nextAction.updates)} className="whitespace-nowrap rounded-lg bg-[#2B211A] px-4 py-2 text-xs font-bold text-white hover:bg-[#44362B] disabled:cursor-not-allowed disabled:opacity-50">{updatingOrderId === order.id ? 'Updating…' : nextAction.label}</button>}{!['completed', 'cancelled'].includes(String(order.status || '').toLowerCase()) && <button type="button" disabled={pageLoading || updatingOrderId === order.id} onClick={() => handleCancelOrder(order)} className="whitespace-nowrap rounded-lg border border-red-300 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>}</div></td>
                  </tr>
                )
              })}
              {!pageLoading && visibleOrders.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-[#9A8061]">{query || statusFilter !== 'all' ? 'No orders match these filters.' : 'No orders found.'}</td></tr>}
            </tbody>
          </table>
        </div>
        {pageLoading && <p className="border-t border-[#EAD8B9] px-4 py-3 text-sm text-[#9A8061]">Loading orders…</p>}
      </div>
    </section>
  )
}

export default AdminOrders

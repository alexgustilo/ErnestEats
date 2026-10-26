import { useEffect, useMemo, useState } from 'react'
import { useOrders } from '../../features/orders/useOrders'

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
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders().catch(() => {})
  }, [fetchOrders])

  const activity = useMemo(() => [...orders]
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .filter((order) => {
      const status = String(order.status || '').toLowerCase()
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const searchable = `${order.id} ${order.customer_id || ''} ${status}`.toLowerCase()
      return matchesStatus && searchable.includes(query.trim().toLowerCase())
    }), [orders, query, statusFilter])

  const featured = activity.find((order) => stages.includes(String(order.status || '').toLowerCase()))
  const currentStatus = String(featured?.status || '').toLowerCase()
  const activeStage = stages.indexOf(currentStatus)

  return (
    <section>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <p className="mt-1 text-sm text-[#8A7A61]">Order-status updates for customer pickups</p>
        </div>
        <button type="button" onClick={() => fetchOrders().catch(() => {})} disabled={loading} className="rounded-lg border border-[#D8BD8F] bg-white px-4 py-2 text-sm font-bold text-[#756957] hover:text-[#241A12] disabled:opacity-50">
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {featured && (
        <section className="mb-6 rounded-2xl border border-[#EAD9BC] bg-white p-5 sm:p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-[#8A7A61]">
            Order progress · #{String(featured.id).slice(0, 8)}
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

      <div className="mb-5 rounded-xl border border-[#EAD9BC] bg-white px-4 py-3 text-sm text-[#756957]">
        This view reflects each order’s current status. The current admin API does not provide a notification delivery history.
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order or customer ID" aria-label="Search order updates" className="w-full max-w-sm rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter updates by status" className="rounded-xl border border-[#E6DCCF] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8531D]">
          <option value="all">All statuses</option>
          {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{statusText[status]}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-[#F0ECDD] text-[#8A7A61]"><tr><th className="px-4 py-4 font-semibold">Order</th><th className="px-4 py-4 font-semibold">Customer ID</th><th className="px-4 py-4 font-semibold">Current update</th><th className="px-4 py-4 font-semibold">Last updated</th></tr></thead>
            <tbody>
              {activity.map((order) => {
                const status = String(order.status || '').toLowerCase()
                return (
                  <tr key={order.id} className="border-t border-[#EAD9BC]">
                    <td className="px-4 py-4">#{String(order.id).slice(0, 8)}</td>
                    <td className="px-4 py-4">{order.customer_id ? String(order.customer_id).slice(0, 12) : '—'}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${status === 'cancelled' ? 'bg-red-100 text-red-700' : status === 'completed' || status === 'ready' ? 'bg-[#E0EEE5] text-[#315D4D]' : status === 'preparing' ? 'bg-[#FFEDD5] text-[#A65E0C]' : 'bg-[#EEE9D9] text-[#8D7655]'}`}>{statusText[status] || order.status || 'Status unavailable'}</span></td>
                    <td className="px-4 py-4 text-[#756957]">{formatDate(order.updated_at || order.created_at)}</td>
                  </tr>
                )
              })}
              {!loading && activity.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-[#8A7A61]">{query || statusFilter !== 'all' ? 'No order updates match these filters.' : 'No order updates yet.'}</td></tr>}
            </tbody>
          </table>
        </div>
        {loading && <p className="border-t border-[#EAD9BC] px-4 py-3 text-sm text-[#8A7A61]">Loading order updates…</p>}
      </div>
    </section>
  )
}

export default AdminNotifications

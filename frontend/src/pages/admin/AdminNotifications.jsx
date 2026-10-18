import { useEffect } from 'react'
import { useOrders } from '../../features/orders/useOrders'

const stages = ['pending', 'preparing', 'ready', 'completed']
const statusText = { pending: 'Order received', preparing: 'Preparing', ready: 'Ready for pickup', completed: 'Completed', cancelled: 'Cancelled' }

function AdminNotifications() {
  const { orders, fetchOrders, loading, error } = useOrders()
  useEffect(() => { fetchOrders().catch(() => {}) }, [])

  const activity = [...orders].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
  const featured = activity.find((order) => stages.includes(String(order.status || '').toLowerCase()))
  const activeStage = stages.indexOf(String(featured?.status || '').toLowerCase())

  return <section>
    <header className="mb-7"><h1 className="text-2xl font-extrabold">Notifications</h1><p className="mt-1 text-sm text-[#8A7A61]">Order status updates that trigger customer notifications</p></header>
    {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    {featured && <div className="mb-6 rounded-2xl border border-[#EAD9BC] bg-white p-5 sm:p-6"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8A7A61]">Current progress · Order #{String(featured.id).slice(0, 8)}</p><div className="flex flex-wrap gap-2">{stages.map((stage, index) => <span key={stage} className={`rounded-lg border px-3 py-2 text-xs font-bold ${index === activeStage ? 'border-[#E8531D] bg-[#E8531D] text-white' : index < activeStage ? 'border-[#C8DCCF] bg-[#E3EFE6] text-[#2F5744]' : 'border-[#EAD9BC] bg-[#FBF1DE] text-[#756957]'}`}>{statusText[stage]}</span>)}</div></div>}
    <div className="mb-5 rounded-xl border border-[#EAD9BC] bg-white px-4 py-3 text-sm text-[#756957]">The backend doesn’t expose an admin notification-history endpoint. This list shows current order statuses; the customer notification feed is managed through the customer account.</div>
    <div className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-[#F0ECDD] text-[#8A7A61]"><tr><th className="px-4 py-4 font-semibold">Order</th><th className="px-4 py-4 font-semibold">Customer ID</th><th className="px-4 py-4 font-semibold">Current update</th><th className="px-4 py-4 font-semibold">Updated</th></tr></thead><tbody>
      {activity.map((order) => <tr key={order.id} className="border-t border-[#EAD9BC]"><td className="px-4 py-4">#{String(order.id).slice(0, 8)}</td><td className="px-4 py-4">{order.customer_id || '—'}</td><td className="px-4 py-4">{statusText[String(order.status || '').toLowerCase()] || order.status || 'Status unavailable'}</td><td className="px-4 py-4">{order.updated_at || order.created_at ? new Date(order.updated_at || order.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</td></tr>)}
      {!loading && activity.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-[#8A7A61]">No order updates yet.</td></tr>}
    </tbody></table></div>{loading && <p className="border-t border-[#EAD9BC] px-4 py-3 text-sm text-[#8A7A61]">Loading order updates…</p>}</div>
  </section>
}

export default AdminNotifications

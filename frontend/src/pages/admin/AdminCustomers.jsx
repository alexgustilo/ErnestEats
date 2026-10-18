import { useEffect } from 'react'
import { useOrders } from '../../features/orders/useOrders'

function peso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`
}

function AdminCustomers() {
  const { orders, fetchOrders, loading, error } = useOrders()
  useEffect(() => { fetchOrders().catch(() => {}) }, [])

  const customers = Object.values(orders.reduce((groups, order) => {
    if (!order.customer_id) return groups
    const id = order.customer_id
    if (!groups[id]) groups[id] = { id, orderCount: 0, total: 0 }
    groups[id].orderCount += 1
    groups[id].total += Number(order.total_amount) || 0
    return groups
  }, {})).sort((a, b) => b.orderCount - a.orderCount)

  return <section>
    <header className="mb-7"><h1 className="text-2xl font-extrabold">Customers</h1><p className="mt-1 text-sm text-[#8A7A61]">Customer activity based on recorded orders</p></header>
    {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="mb-5 rounded-xl border border-[#EAD9BC] bg-white px-4 py-3 text-sm text-[#756957]">This backend currently provides order records but no customer directory endpoint, so names and contact details aren’t available here.</div>
    <div className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white"><div className="overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse text-left text-sm"><thead className="bg-[#F0ECDD] text-[#8A7A61]"><tr><th className="px-4 py-4 font-semibold">Customer ID</th><th className="px-4 py-4 font-semibold">Orders placed</th><th className="px-4 py-4 font-semibold">Recorded order total</th></tr></thead><tbody>
        {customers.map((customer) => <tr key={customer.id} className="border-t border-[#EAD9BC]"><td className="px-4 py-4 font-medium">{customer.id}</td><td className="px-4 py-4">{customer.orderCount}</td><td className="px-4 py-4">{peso(customer.total)}</td></tr>)}
        {!loading && customers.length === 0 && <tr><td colSpan="3" className="px-4 py-10 text-center text-[#8A7A61]">No customer orders recorded yet.</td></tr>}
      </tbody></table>
    </div>{loading && <p className="border-t border-[#EAD9BC] px-4 py-3 text-sm text-[#8A7A61]">Loading customers…</p>}</div>
  </section>
}

export default AdminCustomers

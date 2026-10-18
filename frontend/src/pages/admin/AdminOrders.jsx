import { useEffect, useState } from 'react'
import { useOrders } from '../../features/orders/useOrders'
import { useProducts } from '../../features/products/useProducts'

function formatPeso(value) {
  const amount = Number(value) || 0

  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

function getStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'preparing') return 'bg-[#FFEDD5] text-[#A65E0C]'
  if (value === 'ready') return 'bg-[#E0EEE5] text-[#315D4D]'
  if (value === 'completed') return 'bg-[#E0EEE5] text-[#315D4D]'

  return 'bg-[#EEE9D9] text-[#8D7655]'
}

function getNextAction(order) {
  const status = String(order.status || '').toLowerCase()

  if (status === 'pending') {
    return {
      label: 'Confirm',
      updates: { status: 'preparing' }
    }
  }

  if (status === 'preparing') {
    return {
      label: 'Mark ready',
      updates: { status: 'ready' }
    }
  }

  if (status === 'ready') {
    return {
      label: 'Confirm pickup',
      updates: {
        status: 'completed',
        payment_status: 'paid'
      }
    }
  }

  return null
}

function AdminOrders() {
  const {
    orders,
    fetchOrders,
    editOrder,
    loading,
    error
  } = useOrders()
  const { products, fetchProducts, error: productsError } = useProducts()

  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  useEffect(() => {
    fetchOrders().catch(() => {})
    fetchProducts().catch(() => {})
  }, [])

  async function handleStatusUpdate(order, updates) {
    setUpdatingOrderId(order.id)

    try {
      await editOrder(order.id, updates)
    } catch {
      // useOrders keeps the error message in its error state
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const pageError = error || productsError

  return (
    <section>
      <header className="mb-7">
        <h1 className="text-2xl font-extrabold">Orders</h1>
        <p className="mt-1 text-sm text-[#9A8061]">
          Manage incoming pickup orders
        </p>
      </header>

      {pageError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#EAD8B9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead className="bg-[#F2ECDD] text-[#927859]">
              <tr>
                <th className="px-4 py-4 font-medium">Order ID</th>
                <th className="px-4 py-4 font-medium">Customer</th>
                <th className="px-4 py-4 font-medium">Items</th>
                <th className="px-4 py-4 font-medium">Total</th>
                <th className="px-4 py-4 font-medium">Payment</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const nextAction = getNextAction(order)
                const orderItems = order.order_items || []

                const itemsText = orderItems
                  .map((item) => {
                    const product = products.find((entry) => entry.id === item.product_id)
                    const productName = product?.name || `Product ${String(item.product_id || '').slice(0, 6)}`
                    return `${productName} ×${item.quantity}`
                  })
                  .join(', ')

                return (
                  <tr key={order.id} className="border-t border-[#EAD8B9]">
                    <td className="px-4 py-4">
                      #{String(order.id).slice(0, 8)}
                    </td>

                    <td className="px-4 py-4">
                      {order.customer_id
                        ? `Customer ${String(order.customer_id).slice(0, 6)}`
                        : '—'}
                    </td>

                    <td className="max-w-[220px] px-4 py-4">
                      {itemsText || 'No items'}
                    </td>

                    <td className="px-4 py-4">
                      {formatPeso(order.total_amount)}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {order.payment_status || 'Unpaid'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(order.status)}`}
                      >
                        {order.status || 'Unknown'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {nextAction && (
                        <button
                          type="button"
                          disabled={loading || updatingOrderId === order.id}
                          onClick={() =>
                            handleStatusUpdate(order, nextAction.updates)
                          }
                          className="whitespace-nowrap rounded-lg bg-[#2B211A] px-4 py-2 text-xs font-bold text-white hover:bg-[#44362B] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingOrderId === order.id
                            ? 'Updating…'
                            : nextAction.label}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {!loading && orders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-[#9A8061]"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="border-t border-[#EAD8B9] px-4 py-3 text-sm text-[#9A8061]">
            Loading orders…
          </p>
        )}
      </div>
    </section>
  )
}

export default AdminOrders

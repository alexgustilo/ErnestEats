import { useCallback, useEffect, useState } from 'react'
import { getMyOrders } from '../../features/orders/ordersApi'

const statusSteps = [
  { key: 'pending', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' }
]

function formatPeso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

function formatDate(value) {
  if (!value) return ''

  return new Date(value).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric'
  })
}

function normalizeStatus(status) {
  return String(status || 'pending')
    .toLowerCase()
    .replaceAll('_', ' ')
}

function getCurrentStep(status) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === 'confirmed') return 1
  if (normalizedStatus === 'preparing') return 2
  if (
    normalizedStatus === 'ready' ||
    normalizedStatus === 'ready for pickup' ||
    normalizedStatus === 'completed'
  ) {
    return 3
  }

  return 0
}

function getStatusBadgeStyle(status) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === 'completed') {
    return 'bg-emerald-100 text-emerald-800'
  }

  if (normalizedStatus === 'cancelled') {
    return 'bg-red-100 text-red-700'
  }

  if (normalizedStatus === 'preparing' || normalizedStatus === 'ready' || normalizedStatus === 'ready for pickup') {
    return 'bg-orange-100 text-orange-800'
  }

  return 'bg-[#F1EBDD] text-[#756957]'
}

function getOrderItemName(item) {
  return item.product?.name || item.products?.name || 'Product'
}

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = useCallback(async function loadOrders() {
    setLoading(true)
    setError(null)

    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadOrders)
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') loadOrders()
    }
    const timer = window.setInterval(refreshWhenVisible, 30000)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [loadOrders])

  return (
    <main className="min-h-[60vh]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B23F14]">Your kitchen updates</p><h1 className="mt-2 text-3xl font-black tracking-tight">My orders</h1><p className="mt-2 text-sm text-[#817565]">See what’s cooking and when it’s ready for pickup.</p></div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="rounded-lg border border-[#EAD9BC] px-4 py-2 text-sm font-bold hover:bg-[#FBF1DE] disabled:opacity-50"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-[#8A7A61]">
            Loading your orders…
          </p>
        ) : !error && orders.length === 0 ? (
          <section className="max-w-4xl rounded-2xl border border-[#EAD9BC] bg-white p-7 shadow-[0_8px_30px_rgba(66,45,22,.04)]">
            <p className="font-bold">You don’t have any orders yet.</p>
            <p className="mt-2 text-sm text-[#8A7A61]">
              Your order status will appear here after you place an order.
            </p>
          </section>
        ) : (
          <section className="max-w-4xl space-y-4">
            {orders.map((order) => {
              const status = normalizeStatus(order.status)
              const currentStep = getCurrentStep(status)
              const items = order.order_items || []
              const isCompleted = status === 'completed'
              const isCancelled = status === 'cancelled'

              const itemSummary = items
                .map(
                  (item) =>
                    `${Number(item.quantity || 0)}× ${getOrderItemName(item)}`
                )
                .join(' · ')

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-[#EAD9BC] bg-white p-5 shadow-[0_8px_30px_rgba(66,45,22,.04)] sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-extrabold text-[#756957]">
                      Order #{String(order.id).slice(0, 8).toUpperCase()}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusBadgeStyle(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  {!isCompleted && !isCancelled && (
                    <div className="mt-6 grid grid-cols-4">
                      {statusSteps.map((step, index) => {
                        const isDone = index < currentStep
                        const isCurrent = index === currentStep

                        return (
                          <div
                            key={step.key}
                            className="relative flex flex-col items-center text-center"
                          >
                            {index > 0 && (
                              <span
                                className={`absolute right-1/2 top-4 h-0.5 w-full ${
                                  index <= currentStep
                                    ? 'bg-[#355E4D]'
                                    : 'bg-[#EAD9BC]'
                                }`}
                              />
                            )}

                            <span
                              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                                isDone
                                  ? 'bg-[#355E4D]'
                                  : isCurrent
                                    ? 'bg-[#E8531D]'
                                    : 'bg-[#EAD9BC]'
                              }`}
                            >
                              {isDone ? '✓' : index + 1}
                            </span>

                            <span className="mt-2 text-xs text-[#756957]">
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {isCancelled && (
                    <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      This order was cancelled.
                    </p>
                  )}

                  <div className="mt-5 border-t border-[#EAD9BC] pt-4 text-sm leading-6 text-[#8A7A61]">
                    {itemSummary || 'Order items'}
                    {' — '}
                    Total {formatPeso(order.total_amount)}
                    {' · '}
                    {isCompleted
                      ? `Completed${order.updated_at ? ` ${formatDate(order.updated_at)}` : ''}`
                      : 'Pay at counter on pickup'}
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}

export default MyOrders

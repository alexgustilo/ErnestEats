import { useCallback, useEffect, useState } from 'react'
import { getMyNotifications, markNotificationAsRead } from '../../features/notifications/notificationsApi'

function CustomerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setNotifications(await getMyNotifications()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    Promise.resolve().then(load)
    window.addEventListener('ernesteats-notifications-updated', load)

    return () => {
      window.removeEventListener('ernesteats-notifications-updated', load)
    }
  }, [load])
  async function markRead(id) {
    try {
      const updated = await markNotificationAsRead(id)
      setNotifications((previous) => previous.map((item) => item.id === id ? updated : item))
      window.dispatchEvent(new Event('ernesteats-notifications-updated'))
    } catch (err) { setError(err.message) }
  }
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-9 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#B23F14]">Updates</p><h1 className="mt-2 text-3xl font-extrabold">Notifications</h1><p className="mt-2 text-sm text-[#8A7A61]">Order updates from Ernest Kitchen.</p></div><button onClick={load} disabled={loading} className="rounded-lg border border-[#EAD9BC] px-4 py-2 text-sm font-bold disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh'}</button></div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <p className="py-12 text-center text-[#8A7A61]">Loading notifications…</p> : notifications.length === 0 ? <section className="mt-6 rounded-2xl border border-[#EAD9BC] bg-white p-8 text-center text-[#8A7A61]">You don’t have any notifications yet.</section> : <section className="mt-6 overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white">{notifications.map((item) => <article key={item.id} className={`flex flex-wrap items-start justify-between gap-3 border-b border-[#EAD9BC] p-5 last:border-0 ${item.is_read ? '' : 'bg-[#FFF9EE]'}`}><div><p className="font-bold">{item.message || 'There’s an update on your order.'}</p><p className="mt-1 text-xs text-[#8A7A61]">{item.created_at ? new Date(item.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : ''}</p></div>{!item.is_read && <button onClick={() => markRead(item.id)} className="text-sm font-bold text-[#B23F14]">Mark as read</button>}</article>)}</section>}
    </main>
  )
}
export default CustomerNotifications

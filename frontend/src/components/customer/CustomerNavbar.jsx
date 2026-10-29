import { useCallback, useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getMyNotifications, markNotificationAsRead } from '../../features/notifications/notificationsApi'

function CustomerNavbar({ cartCount = 0, cartTotal = 0, unreadCount = 0, profile, onLogout }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationError, setNotificationError] = useState('')

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true)
    setNotificationError('')
    try {
      setNotifications(await getMyNotifications())
    } catch (error) {
      setNotificationError(error.message || 'Could not load notifications.')
    } finally {
      setNotificationsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!notificationsOpen) return undefined
    loadNotifications()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('ernesteats-notifications-updated', loadNotifications)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('ernesteats-notifications-updated', loadNotifications)
    }
  }, [notificationsOpen, loadNotifications])

  async function markRead(id) {
    try {
      const updated = await markNotificationAsRead(id)
      setNotifications((current) => current.map((item) => item.id === id ? updated : item))
      window.dispatchEvent(new Event('ernesteats-notifications-updated'))
    } catch (error) {
      setNotificationError(error.message || 'Could not update this notification.')
    }
  }

  const navItems = [
    { label: 'Home', to: '/customer', end: true },
    { label: 'Menu', to: '/customer/menu' },
    { label: 'About us', to: '/customer/about' },
    { label: 'My orders', to: '/customer/orders' }
  ]

  return (
    <header className="customer-header sticky top-0 z-40 border-b border-[#E8D8BE] bg-white text-[#29241E]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 px-3 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-8 lg:px-12 lg:py-4">
        <Link to="/customer" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Ernest Kitchen home">
          <img src="/logo/logo1.png" alt="" className="h-9 w-9 shrink-0 rounded-full object-contain sm:h-10 sm:w-10" />
          <span className="hidden truncate text-sm font-semibold tracking-tight min-[381px]:inline sm:text-base">Ernest Kitchen <span className="hidden font-normal text-[#8A8177] sm:inline">&amp; Streetfood</span></span>
        </Link>
        <nav aria-label="Customer navigation" className="order-3 col-span-2 flex w-full items-center justify-between gap-1 overflow-x-auto border-t border-[#F0ECE5] pt-1 lg:order-2 lg:col-span-1 lg:w-auto lg:justify-center lg:gap-8 lg:overflow-visible lg:border-0 lg:pt-0">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `shrink-0 border-b-2 px-2 py-2 text-xs font-semibold transition sm:text-sm lg:px-0 ${isActive ? 'border-[#E8531D] text-[#A54A26]' : 'border-transparent text-[#746B60] hover:text-[#29241E]'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="order-2 flex shrink-0 items-center justify-end gap-1 sm:gap-2 lg:order-3">
          <div className="relative">
            <button type="button" onClick={() => setNotificationsOpen((open) => !open)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-haspopup="dialog" aria-expanded={notificationsOpen} className="relative rounded-full p-2 text-[#5B5146] transition hover:bg-[#FAF7F1] hover:text-[#A54A26]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
              {unreadCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#E8531D] ring-2 ring-white" />}
            </button>
            {notificationsOpen && (
              <>
                <button type="button" aria-label="Close notifications" className="fixed inset-0 z-40 cursor-default" onClick={() => setNotificationsOpen(false)} />
                <section role="dialog" aria-labelledby="customer-notifications-title" className="absolute right-0 top-full z-50 mt-3 flex max-h-[min(620px,75vh)] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#E8E3DA] bg-white text-left shadow-[0_16px_48px_rgba(35,29,21,.18)]">
                  <header className="flex items-center justify-between border-b border-[#EEEAE2] px-5 py-4">
                    <div><h2 id="customer-notifications-title" className="text-xl font-bold text-[#29241E]">Notifications</h2><p className="mt-1 text-xs text-[#81796D]">{unreadCount ? `${unreadCount} new update${unreadCount === 1 ? '' : 's'}` : 'You’re all caught up'}</p></div>
                    <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications" className="rounded-full p-2 text-lg leading-none text-[#746B60] hover:bg-[#F7F5F0]">×</button>
                  </header>
                  {notificationError && <p role="alert" className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{notificationError}</p>}
                  <div className="min-h-24 flex-1 overflow-y-auto">
                    {notificationsLoading ? <p className="px-5 py-10 text-center text-sm text-[#81796D]">Loading updates…</p> : notifications.length === 0 ? <p className="px-5 py-10 text-center text-sm text-[#81796D]">Order updates will appear here.</p> : <ul className="py-1">{notifications.map((item) => <li key={item.id}><div className={`flex gap-3 px-4 py-3 transition hover:bg-[#F7F5F0] ${item.is_read ? '' : 'bg-[#FFF8EE]'}`}><span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.is_read ? 'bg-[#F0EEE9] text-[#77736C]' : 'bg-[#FCE9D9] text-[#B94E2B]'}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg></span><div className="min-w-0 flex-1"><p className="text-[13px] leading-5 text-[#37342F]">{item.message || 'There’s an update on your order.'}</p><p className={`mt-1 text-xs ${item.is_read ? 'text-[#8A8177]' : 'font-semibold text-[#A54A26]'}`}>{item.created_at ? new Date(item.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}</p>{!item.is_read && <button type="button" onClick={() => markRead(item.id)} className="mt-1 text-xs font-bold text-[#A54A26] hover:underline">Mark as read</button>}</div>{!item.is_read && <span aria-label="Unread" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E8531D]" />}</div></li>)}</ul>}
                  </div>
                  <footer className="border-t border-[#EEEAE2] px-4 py-3 text-center text-xs text-[#81796D]">Order updates appear here automatically</footer>
                </section>
              </>
            )}
          </div>
          <Link to="/customer/cart" aria-label={`Cart, ${cartCount} items, ₱${Number(cartTotal).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`} className="max-w-[108px] truncate rounded-full bg-[#E8531D] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#C9481B] sm:max-w-none sm:px-4 sm:text-xs">
            Cart · ₱{Number(cartTotal).toLocaleString('en-PH', { maximumFractionDigits: 2 })}{cartCount > 0 ? ` (${cartCount})` : ''}
          </Link>
          <Link to="/customer/profile" aria-label="Your profile" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3A93B] font-bold text-[#292722]">
            {(profile?.full_name || profile?.email || 'A').charAt(0).toUpperCase()}
          </Link>
          <button type="button" onClick={onLogout} aria-label="Log out" className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-[#746B60] hover:bg-[#FAF7F1] hover:text-[#A54A26] sm:h-auto sm:w-auto sm:px-1">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>
            <span className="hidden whitespace-nowrap text-xs font-semibold sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar

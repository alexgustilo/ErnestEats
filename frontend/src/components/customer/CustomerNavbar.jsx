import { NavLink, Link } from 'react-router-dom'

function CustomerNavbar({ cartCount = 0, cartTotal = 0, unreadCount = 0, profile, onLogout }) {
  const navItems = [
    { label: 'Home', to: '/customer', end: true },
    { label: 'Menu', to: '/customer/menu' },
    { label: 'About us', to: '/customer/about' },
    { label: 'My orders', to: '/customer/orders' }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8D8BE] bg-white text-[#29241E]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 sm:px-8">
        <Link to="/customer" className="flex items-center gap-3" aria-label="Ernest Kitchen home">
          <img src="/logo/logo1.png" alt="" className="h-10 w-10 rounded-full object-contain" />
          <span className="font-extrabold">Ernest Kitchen &amp; Streetfood</span>
        </Link>
        <nav aria-label="Customer navigation" className="order-3 flex w-full items-center justify-center gap-5 sm:order-2 sm:w-auto sm:gap-8">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `border-b-2 py-2 text-sm font-semibold transition ${isActive ? 'border-[#E8531D] text-[#A54A26]' : 'border-transparent text-[#746B60] hover:text-[#29241E]'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="order-2 flex items-center gap-3 sm:order-3">
          <Link to="/customer/notifications" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} className="relative rounded-full p-2 text-[#5B5146] transition hover:bg-[#FAF7F1] hover:text-[#A54A26]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
            {unreadCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#E8531D] ring-2 ring-white" />}
          </Link>
          <Link to="/customer/cart" className="rounded-full bg-[#E8531D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C9481B]">
            Cart · ₱{Number(cartTotal).toLocaleString('en-PH', { maximumFractionDigits: 2 })}{cartCount > 0 ? ` (${cartCount})` : ''}
          </Link>
          <Link to="/customer/profile" aria-label="Your profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3A93B] font-bold text-[#332B22]">
            {(profile?.full_name || profile?.email || 'A').charAt(0).toUpperCase()}
          </Link>
          <button type="button" onClick={onLogout} className="text-xs font-semibold text-[#746B60] hover:text-[#A54A26]">Log out</button>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar

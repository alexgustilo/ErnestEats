import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const sections = [
  { label: 'Overview', to: '/admin', end: true, icon: 'overview' },
  { label: 'Orders', to: '/admin/orders', icon: 'orders' },
  { label: 'Products', to: '/admin/products', icon: 'products' },
  { label: 'Categories', to: '/admin/categories', icon: 'categories' },
  { label: 'Inventory', to: '/admin/inventory', icon: 'inventory' },
  { label: 'Customers', to: '/admin/customers', icon: 'customers' },
  { label: 'Notifications', to: '/admin/notifications', icon: 'notifications' },
  { label: 'Sales / Reports', to: '/admin/reports', icon: 'reports' }
]

const iconPaths = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  orders: <><path d="M8 4H6a2 2 0 0 0-2 2v14h16V6a2 2 0 0 0-2-2h-2" /><rect x="8" y="2.5" width="8" height="4" rx="1.5" /><path d="M8 11h8M8 15h8" /></>,
  products: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>,
  categories: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
  inventory: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" /></>,
  customers: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  notifications: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  reports: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>
}

function AdminIcon({ name }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0">
      {iconPaths[name]}
    </svg>
  )
}

function AdminSidebar({ onLogout, profile }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const ownerName = profile?.full_name?.trim() || 'Administrator'
  const ownerInitials = ownerName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'A'

  return (
    <aside className="admin-sidebar relative z-30 flex w-full shrink-0 flex-col border-b border-[#E8531D] bg-[#241A12] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6 lg:h-[88px] lg:justify-start lg:px-7">
      <NavLink to="/admin" end onClick={() => setMobileOpen(false)} className="admin-brand flex min-w-0 items-center gap-3">
        <img src="/logo/logo1.png" alt="" className="h-10 w-10 shrink-0 rounded-full object-contain" />
        <span className="min-w-0"><span className="block font-semibold tracking-tight">Ernest Eats</span></span>
      </NavLink>
      <button type="button" aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 lg:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={mobileOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
      </button>
      </div>

      <nav aria-label="Admin navigation" className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full max-h-[calc(100dvh-72px)] flex-col gap-1 overflow-y-auto border-b border-white/10 bg-[#292722] p-3 shadow-xl lg:static lg:flex lg:max-h-none lg:flex-1 lg:gap-1 lg:overflow-y-auto lg:overflow-x-hidden lg:border-0 lg:bg-transparent lg:px-3 lg:pt-6 lg:shadow-none`}>
        <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/35 lg:block">Workspace</p>
        {sections.map(({ label, to, end, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex min-h-[46px] shrink-0 items-center gap-3 rounded-xl px-4 text-left text-sm transition-colors lg:w-full lg:px-4 ${isActive ? 'admin-nav-active font-semibold text-white' : 'text-[#C9AE8E] hover:bg-white/5 hover:text-white'}`}
          >
            {({ isActive }) => <>
              <AdminIcon name={icon} />
              <span className="whitespace-nowrap">{label}</span>
            </>}
          </NavLink>
        ))}
        <button type="button" onClick={onLogout} className="mt-2 w-full shrink-0 rounded-xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-[#F7EEE0] transition hover:bg-white/10 lg:hidden">
          Log out
        </button>
      </nav>

      <div className="admin-sidebar-footer hidden lg:block">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[.04] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8D5B7] text-xs font-bold text-[#292722]">{ownerInitials}</span>
          <span className="min-w-0"><span className="block truncate text-xs font-semibold text-white/90">{ownerName}</span><span className="mt-0.5 block text-[10px] text-white/45">Store owner</span></span>
        </div>
        <button type="button" onClick={onLogout} className="w-full shrink-0 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#F7EEE0] transition hover:border-white/20 hover:bg-white/5">
          Log out
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar

import { NavLink } from 'react-router-dom'

const sections = [
  { label: 'Overview', to: '/admin', end: true },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Notifications', to: '/admin/notifications' },
  { label: 'Sales / Reports', to: '/admin/reports' }
]

function AdminSidebar({ onLogout }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b-[3px] border-[#E8531D] bg-[#241A12] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r-[3px]">
      <NavLink to="/admin" end className="flex h-[88px] shrink-0 items-center gap-3 border-b border-white/10 px-7">
        <img src="/logo/logo1.png" alt="" className="h-9 w-9 rounded-full object-cover" />
        <span className="font-bold tracking-tight">ErnestEats</span>
      </NavLink>

      <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto p-2 lg:flex-1 lg:flex-col lg:gap-0 lg:overflow-y-auto lg:overflow-x-hidden lg:pt-4">
        {sections.map(({ label, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex min-h-[48px] shrink-0 items-center gap-3 px-4 text-left text-sm transition-colors lg:w-full lg:px-6 ${isActive ? 'bg-[#E8531D] font-bold text-white' : 'text-[#C9AE8E] hover:bg-white/5 hover:text-white'}`}
          >
            {({ isActive }) => <>
              <span className={`h-5 w-5 rounded-md ${isActive ? 'bg-white/35' : 'bg-[#3A2E22]'}`} aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </>}
          </NavLink>
        ))}
      </nav>

      <button type="button" onClick={onLogout} className="m-3 shrink-0 rounded-lg border border-[#80664D] px-4 py-2.5 text-sm text-[#F7EEE0] transition hover:bg-white/10 lg:mx-5 lg:mb-5 lg:mt-auto">
        Log out
      </button>
    </aside>
  )
}

export default AdminSidebar

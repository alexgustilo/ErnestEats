import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import AdminSidebar from '../components/admin/AdminSidebar'

function AdminLayout() {
  const { logout, profile } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth', { replace: true })
  }

  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="admin-shell min-h-screen bg-[#F8F1DE] text-[#241A12] lg:flex">
      <AdminSidebar onLogout={handleLogout} profile={profile} />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-[1440px]">
          <header className="admin-topbar mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9A8061]">Ernest Eats <span className="mx-1 text-[#C7B79E]">/</span> Administration</p>
              <p className="mt-1 text-sm font-semibold text-[#35332F]">Management workspace</p>
            </div>
            <div className="flex items-center gap-3">
              <time className="text-right text-xs font-medium text-[#77766F]">{today}</time>
            </div>
          </header>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

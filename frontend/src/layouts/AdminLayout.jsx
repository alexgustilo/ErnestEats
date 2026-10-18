import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import AdminSidebar from '../components/admin/AdminSidebar'

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F8F1DE] text-[#241A12] lg:flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-[1440px]"><Outlet /></div>
      </main>
    </div>
  )
}

export default AdminLayout

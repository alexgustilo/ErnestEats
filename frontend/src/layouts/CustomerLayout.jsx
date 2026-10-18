import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import CustomerNavbar from '../components/customer/CustomerNavbar'
import CustomerFooter from '../components/customer/CustomerFooter'
import { useAuth } from '../features/auth/useAuth'
import { useCart } from '../features/cart/useCart'
import { getMyNotifications } from '../features/notifications/notificationsApi'

function readProfile() {
  try { return JSON.parse(localStorage.getItem('profile') || 'null') } catch { return null }
}

function CustomerLayout() {
  const { logout } = useAuth()
  const { count, total } = useCart()
  const [unreadCount, setUnreadCount] = useState(0)
  const [profile, setProfile] = useState(readProfile)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const refreshNotifications = () => {
      getMyNotifications().then((items) => {
        if (active) setUnreadCount(items.filter((item) => !item.is_read).length)
      }).catch(() => {})
    }
    const refreshProfile = () => setProfile(readProfile())
    refreshNotifications()
    window.addEventListener('ernesteats-notifications-updated', refreshNotifications)
    window.addEventListener('ernesteats-profile-updated', refreshProfile)
    return () => {
      active = false
      window.removeEventListener('ernesteats-notifications-updated', refreshNotifications)
      window.removeEventListener('ernesteats-profile-updated', refreshProfile)
    }
  }, [])

  function handleLogout() {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF8F2] text-[#241A12]">
      <CustomerNavbar cartCount={count} cartTotal={total} unreadCount={unreadCount} profile={profile} onLogout={handleLogout} />
      <div className="flex-1"><Outlet /></div>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout

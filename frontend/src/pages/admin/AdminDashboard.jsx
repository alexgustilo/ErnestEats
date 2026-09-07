import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

function AdminDashboard() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/auth', { replace: true })
    }

    return (
        <div>
        <h1>Admin Dashboard</h1>

        <p>Welcome to the ErnestEats admin dashboard.</p>

        <button onClick={handleLogout}>
            Logout
        </button>
        </div>
    )
}

export default AdminDashboard
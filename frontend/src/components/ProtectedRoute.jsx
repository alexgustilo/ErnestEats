import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

function ProtectedRoute({ children, role }) {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    if (role && profile?.role !== role) {
        return <Navigate to="/auth" replace />
    }

    return children
}

export default ProtectedRoute;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import CustomerHome from './pages/customer/CustomerHome';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/customer" element={<ProtectedRoute role="customer"> <CustomerHome /></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute role="admin"> <AdminDashboard /> </ProtectedRoute>}/>
        <Route path="/" element={<Navigate to="/auth" replace />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Navbar from '../components/layout/Navbar'

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}

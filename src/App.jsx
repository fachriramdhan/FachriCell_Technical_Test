import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedLayout from './layouts/ProtectedLayout'

// Lazy loading per halaman — bundle awal lebih kecil, load lebih cepat
const LoginPage           = lazy(() => import('./features/auth/LoginPage'))
const DashboardPage       = lazy(() => import('./features/auth/DashboardPage'))
const PackageListPage     = lazy(() => import('./features/packages/PackageListPage'))
const PackageDetailPage   = lazy(() => import('./features/packages/PackageDetailPage'))
const CheckoutPage        = lazy(() => import('./features/checkout/CheckoutPage'))
const CheckoutSuccessPage = lazy(() => import('./features/checkout/CheckoutSuccessPage'))
const TransactionsPage    = lazy(() => import('./features/transactions/TransactionsPage'))
const NotFoundPage        = lazy(() => import('./features/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 mx-auto shadow-md">
          <i className="fa-solid fa-signal text-white text-xl"></i>
        </div>
        <div className="flex items-center gap-2 text-ink-500 text-sm justify-center">
          <i className="fa-solid fa-circle-notch fa-spin text-brand-500"></i>
          Memuat halaman...
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Halaman publik */}
          <Route path="/login" element={<LoginPage />} />

          {/* Halaman yang butuh login (protected) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard"        element={<DashboardPage />} />
            <Route path="/packages"         element={<PackageListPage />} />
            <Route path="/packages/:id"     element={<PackageDetailPage />} />
            <Route path="/checkout/:id"     element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/transactions"     element={<TransactionsPage />} />
          </Route>

          {/* Redirect & 404 */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

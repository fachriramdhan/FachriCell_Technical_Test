import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'fachri@demo.com', password: 'demo123' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.password) e.password = 'Password wajib diisi'
    else if (form.password.length < 6) e.password = 'Minimal 6 karakter'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    const ok = await login(form.email, form.password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4 shadow-md">
            <i className="fa-solid fa-signal text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Masuk ke Akun</h1>
          <p className="text-sm text-ink-500 mt-1">DataPackage Store</p>
        </div>

        <div className="card p-6">
          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex gap-2">
            <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 flex-shrink-0"></i>
            <div>
              <p className="text-xs font-semibold text-blue-700">Akun Demo</p>
              <p className="text-xs text-blue-600 mt-0.5">
                Email: <strong>fachri@demo.com</strong><br/>
                Password: <strong>demo123</strong>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-500 flex-shrink-0 mt-0.5"></i>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                <i className="fa-solid fa-envelope text-ink-400 mr-1.5"></i>Alamat Email
              </label>
              <input type="text" className={`input-field ${errors.email ? 'border-red-400 ring-1 ring-red-100' : ''}`}
                placeholder="email@contoh.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                <i className="fa-solid fa-lock text-ink-400 mr-1.5"></i>Password
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 ring-1 ring-red-100' : ''}`}
                  placeholder="Masukkan password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-sm mt-2">
              {isLoading
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Memverifikasi...</>
                : <><i className="fa-solid fa-right-to-bracket"></i> Masuk</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-400 mt-5">
          &copy; 2026 Fachri Cell · Simulasi Technical Test
        </p>
      </div>
    </div>
  )
}

import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Beranda', icon: 'fa-house' },
    { to: '/packages', label: 'Paket Data', icon: 'fa-wifi' },
    { to: '/transactions', label: 'Riwayat', icon: 'fa-clock-rotate-left' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-cream-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <i className="fa-solid fa-signal text-white text-sm"></i>
            </div>
            <span className="font-bold text-ink-900 text-base">Fachri Cell</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  location.pathname === to
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-cream-100'
                }`}
              >
                <i className={`fa-solid ${icon} text-xs`}></i>
                {label}
              </Link>
            ))}
          </div>

          {/* User */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center">
                  <span className="text-brand-700 text-xs font-bold">{user.avatar}</span>
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink-800">{user.name.split(' ')[0]}</p>
                  <p className="text-xs text-ink-500">{user.phone}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <i className="fa-solid fa-right-from-bracket text-xs"></i>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden flex items-center gap-1 py-1.5 border-t border-cream-200">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                location.pathname === to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              <i className={`fa-solid ${icon}`}></i>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

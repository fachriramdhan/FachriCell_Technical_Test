// ── Skeleton ───────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-5 w-32 rounded" />
        </div>
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="skeleton h-7 w-24 rounded" />
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
      <div className="skeleton h-9 w-full rounded-lg" />
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ title = 'Tidak ada data', description = '', icon = 'fa-inbox', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mb-4">
        <i className={`fa-solid ${icon} text-2xl text-ink-400`}></i>
      </div>
      <h3 className="text-base font-semibold text-ink-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ── Error State ────────────────────────────────────────────
export function ErrorState({ message = 'Terjadi kesalahan', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <i className="fa-solid fa-triangle-exclamation text-2xl text-red-400"></i>
      </div>
      <h3 className="text-base font-semibold text-red-600 mb-1">Gagal memuat data</h3>
      <p className="text-sm text-ink-500 mb-5 max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          <i className="fa-solid fa-rotate-right text-xs"></i> Coba Lagi
        </button>
      )}
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'text-base', md: 'text-2xl', lg: 'text-4xl' }
  return <i className={`fa-solid fa-circle-notch fa-spin text-brand-500 ${sizes[size]}`}></i>
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ children, className = '' }) {
  return <span className={`badge ${className}`}>{children}</span>
}

// ── Modal (Reusable) ───────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up border border-cream-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="text-base font-bold text-ink-900">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 w-8 h-8 rounded-lg">
            <i className="fa-solid fa-xmark text-sm text-ink-500"></i>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150 ${
            p === currentPage
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white border border-cream-300 text-ink-600 hover:border-brand-300 hover:text-brand-600'
          }`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
      >
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  )
}

// ── Status Badge ───────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    success: 'bg-green-100 text-green-700 border border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    failed:  'bg-red-100 text-red-600 border border-red-200',
  }
  const icons = { success: 'fa-circle-check', pending: 'fa-clock', failed: 'fa-circle-xmark' }
  const label = { success: 'Berhasil', pending: 'Menunggu', failed: 'Gagal' }
  return (
    <span className={`badge ${map[status] || map.pending}`}>
      <i className={`fa-solid ${icons[status] || icons.pending} text-xs`}></i>
      {label[status] || status}
    </span>
  )
}

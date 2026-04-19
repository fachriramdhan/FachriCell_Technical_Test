import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { transactionService } from '../../services/api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { StatusBadge, EmptyState, ErrorState, Modal } from '../../components/ui'
import api from '../../services/api'

export default function TransactionsPage() {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Modal state for confirm payment
  const [confirmModal, setConfirmModal] = useState({ open: false, trx: null })
  const [confirming, setConfirming] = useState(false)

  const fetchTransactions = useCallback(() => {
    setLoading(true); setError(null)
    transactionService.getByUser(user.id)
      .then(res => { setTransactions(res.data); setLoading(false) })
      .catch(() => { setError('Gagal memuat riwayat transaksi'); setLoading(false) })
  }, [user.id])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  // Konfirmasi pembayaran — ubah status pending → success di db.json
  const handleConfirmPayment = async () => {
    if (!confirmModal.trx || confirming) return
    setConfirming(true)
    try {
      await api.patch('/transactions/' + confirmModal.trx.id, { status: 'success' })
      // Update local state optimistically
      setTransactions(prev => prev.map(t => t.id === confirmModal.trx.id ? { ...t, status: 'success' } : t))
      setConfirmModal({ open: false, trx: null })
    } catch {
      alert('Gagal mengkonfirmasi. Coba lagi.')
    } finally {
      setConfirming(false)
    }
  }

  const filtered = filterStatus === 'all' ? transactions : transactions.filter(t => t.status === filterStatus)

  const tabs = [
    { key:'all',     label:'Semua',    count: transactions.length },
    { key:'success', label:'Berhasil', count: transactions.filter(t => t.status === 'success').length },
    { key:'pending', label:'Menunggu', count: transactions.filter(t => t.status === 'pending').length },
    { key:'failed',  label:'Gagal',    count: transactions.filter(t => t.status === 'failed').length },
  ]

  return (
    <div className="animate-fade-in">
      {/* Confirm Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open:false, trx:null })} title="Konfirmasi Pembayaran">
        {confirmModal.trx && (
          <div className="space-y-4">
            {/* Info box: penjelasan "Menunggu" */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
              <i className="fa-solid fa-circle-info text-yellow-500 flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Status "Menunggu" artinya apa?</p>
                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                  Transaksi ini sudah dibuat, tapi pembayaran belum dikonfirmasi oleh sistem.
                  Ini biasanya terjadi pada pembayaran via Transfer Bank atau Minimarket yang perlu verifikasi manual.
                  Klik "Konfirmasi" di bawah untuk mengubah status menjadi Berhasil.
                </p>
              </div>
            </div>

            <div className="bg-cream-100 rounded-xl p-4 border border-cream-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-signal text-blue-500"></i>
                </div>
                <div>
                  <p className="font-semibold text-ink-800 text-sm">{confirmModal.trx.packageName}</p>
                  <p className="text-xs text-ink-500">{confirmModal.trx.provider} · {formatDate(confirmModal.trx.createdAt)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-cream-300">
                <span className="text-sm text-ink-600">Total</span>
                <span className="font-bold text-brand-600 font-mono">{formatCurrency(confirmModal.trx.price)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ open:false, trx:null })} className="btn-secondary flex-1 text-sm">Batal</button>
              <button onClick={handleConfirmPayment} disabled={confirming} className="btn-primary flex-1 text-sm bg-green-600 hover:bg-green-700">
                {confirming
                  ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Memproses...</>
                  : <><i className="fa-solid fa-circle-check text-xs"></i> Konfirmasi Berhasil</>
                }
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="page-header mb-0">
          <h1 className="page-title">Riwayat Transaksi</h1>
          <p className="page-subtitle">{transactions.length} total transaksi</p>
        </div>
        <Link to="/packages" className="btn-primary text-sm">
          <i className="fa-solid fa-plus text-xs"></i> Beli Paket
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-all duration-150 ${
              filterStatus === tab.key
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-ink-600 border-cream-300 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filterStatus === tab.key ? 'bg-white/20 text-white' : 'bg-cream-200 text-ink-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Penjelasan banner jika ada pending */}
      {transactions.filter(t => t.status === 'pending').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex gap-3">
          <i className="fa-solid fa-clock text-yellow-500 text-lg flex-shrink-0 mt-0.5"></i>
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              Ada {transactions.filter(t => t.status === 'pending').length} transaksi yang masih menunggu konfirmasi
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Klik tombol <strong>"Konfirmasi Bayar"</strong> di baris transaksi untuk mengubah statusnya menjadi Berhasil.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
              <div className="skeleton w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-4 w-40 rounded" />
                <div className="skeleton h-3 w-28 rounded" />
              </div>
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTransactions} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="fa-clock-rotate-left" title="Tidak ada transaksi" description="Belum ada transaksi pada kategori ini."
          action={<Link to="/packages" className="btn-primary text-sm">Beli Paket Sekarang</Link>}
        />
      ) : (
        <div className="card divide-y divide-cream-200">
          {filtered.map(trx => (
            <div key={trx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-colors">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-signal text-blue-500 text-sm"></i>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-800 text-sm truncate">{trx.packageName}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-ink-500">{trx.provider}</span>
                  <span className="text-ink-300">·</span>
                  <span className="text-xs text-ink-500">{trx.phone}</span>
                  <span className="text-ink-300">·</span>
                  <span className="text-xs text-ink-400">{formatDate(trx.createdAt)}</span>
                </div>
                <p className="text-xs text-ink-400 mt-0.5">
                  <i className="fa-solid fa-credit-card text-xs mr-1"></i>{trx.paymentMethod}
                </p>
              </div>

              {/* Right side */}
              <div className="text-right flex-shrink-0 space-y-1.5">
                <p className="font-bold text-ink-800 font-mono text-sm">{formatCurrency(trx.price)}</p>
                <StatusBadge status={trx.status} />

                {/* Tombol konfirmasi untuk status pending */}
                {trx.status === 'pending' && (
                  <button
                    onClick={() => setConfirmModal({ open: true, trx })}
                    className="block w-full text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded-lg transition-colors mt-1"
                  >
                    <i className="fa-solid fa-circle-check text-xs mr-1"></i>
                    Konfirmasi Bayar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

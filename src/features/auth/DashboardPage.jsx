import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { transactionService } from '../../services/api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { StatusBadge } from '../../components/ui'

function StatCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
        <i className={`fa-solid ${icon} text-base`}></i>
      </div>
      <p className="text-xl font-bold text-ink-900 font-mono">{value}</p>
      <p className="text-xs text-ink-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionService.getByUser(user.id)
      .then(res => { setTransactions(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user.id])

  const successTrx = transactions.filter(t => t.status === 'success')
  const totalSpend = successTrx.reduce((s, t) => s + t.price, 0)
  const recent = transactions.slice(0, 4)

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">
            Halo, {user.name.split(' ')[0]}!
            <span className="ml-2 text-2xl"></span>
          </h1>
          <p className="page-subtitle">Selamat datang kembali di Fachri Cell</p>
        </div>
        <Link to="/packages" className="btn-primary text-sm">
          <i className="fa-solid fa-plus text-xs"></i> Beli Paket
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="skeleton h-6 w-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="fa-receipt" iconBg="bg-blue-100 text-blue-600" label="Total Transaksi" value={transactions.length} />
          <StatCard icon="fa-sack-dollar" iconBg="bg-green-100 text-green-600" label="Total Pengeluaran" value={formatCurrency(totalSpend)} />
          <StatCard icon="fa-circle-check" iconBg="bg-emerald-100 text-emerald-600" label="Transaksi Berhasil" value={successTrx.length} />
          <StatCard icon="fa-clock" iconBg="bg-yellow-100 text-yellow-600" label="Menunggu Konfirmasi" value={transactions.filter(t => t.status === 'pending').length} sub="Klik riwayat untuk konfirmasi" />
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="section-title">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/packages', icon: 'fa-wifi', iconBg: 'bg-blue-100 text-blue-600', title: 'Beli Paket Data', desc: 'Temukan paket terbaik untuk kebutuhan Anda' },
            { to: '/transactions', icon: 'fa-clock-rotate-left', iconBg: 'bg-purple-100 text-purple-600', title: 'Riwayat Pembelian', desc: 'Lihat dan konfirmasi status transaksi' },
            { to: '/packages', icon: 'fa-fire', iconBg: 'bg-orange-100 text-orange-600', title: 'Paket Populer', desc: 'Paket yang paling banyak diminati pengguna' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="card-hover p-5 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div>
                <h3 className="font-semibold text-ink-800 text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Transaksi Terbaru</h2>
          <Link to="/transactions" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Lihat semua <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="card p-10 text-center">
            <i className="fa-solid fa-inbox text-4xl text-ink-300 mb-3 block"></i>
            <p className="text-ink-500 text-sm">Belum ada transaksi</p>
            <Link to="/packages" className="btn-primary mt-4 text-sm">Beli Paket Pertama</Link>
          </div>
        ) : (
          <div className="card divide-y divide-cream-200">
            {recent.map(trx => (
              <div key={trx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-signal text-blue-500 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-800 truncate">{trx.packageName}</p>
                  <p className="text-xs text-ink-500">{trx.provider} · {formatDate(trx.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-bold text-ink-800 font-mono">{formatCurrency(trx.price)}</p>
                  <StatusBadge status={trx.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

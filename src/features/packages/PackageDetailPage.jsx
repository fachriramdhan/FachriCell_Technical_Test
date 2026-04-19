import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { packageService } from '../../services/api'
import { formatCurrency } from '../../utils/helpers'
import { ErrorState, Modal } from '../../components/ui'

const PROVIDER_COLORS = {
  Telkomsel:'bg-red-100 text-red-700', Indosat:'bg-yellow-100 text-yellow-700',
  XL:'bg-blue-100 text-blue-700', Smartfren:'bg-purple-100 text-purple-700',
  Tri:'bg-green-100 text-green-700', Axis:'bg-orange-100 text-orange-700',
}

function ConfirmBuyModal({ isOpen, onClose, onConfirm, pkg }) {
  if (!pkg) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Pembelian">
      <div className="space-y-4">
        <div className="bg-cream-100 rounded-xl p-4 border border-cream-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <i className="fa-solid fa-signal text-blue-500"></i>
            </div>
            <div>
              <p className="font-semibold text-ink-800 text-sm">{pkg.name}</p>
              <p className="text-xs text-ink-500">{pkg.provider} · {pkg.quota >= 30 ? 'Unlimited' : pkg.quota + 'GB'} · {pkg.validity} hari</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-cream-300">
            <span className="text-sm text-ink-600">Total pembayaran</span>
            <span className="text-lg font-bold text-brand-600 font-mono">{formatCurrency(pkg.price)}</span>
          </div>
        </div>
        <p className="text-sm text-ink-600">
          Anda akan diarahkan ke halaman checkout. Lengkapi nomor HP dan pilih metode pembayaran di sana.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Batal</button>
          <button onClick={onConfirm} className="btn-primary flex-1 text-sm">
            <i className="fa-solid fa-arrow-right text-xs"></i> Lanjut Checkout
          </button>
        </div>
      </div>
    </Modal>
  )
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="skeleton h-4 w-48 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="skeleton h-6 w-56 rounded" />
          <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="skeleton h-20 rounded-xl"/>)}</div>
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
        <div className="card p-6 space-y-4">
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setLoading(true); setError(null)
    packageService.getById(id)
      .then(async res => {
        setPkg(res.data)
        const all = await packageService.getAll({ provider: res.data.provider })
        setRelated(all.data.filter(p => p.id !== id).slice(0, 3))
        setLoading(false)
      })
      .catch(() => { setError('Paket tidak ditemukan.'); setLoading(false) })
  }, [id])

  if (loading) return <DetailSkeleton />
  if (error) return <ErrorState message={error} onRetry={() => navigate('/packages')} />

  return (
    <div className="animate-fade-in">
      <ConfirmBuyModal isOpen={showModal} onClose={() => setShowModal(false)}
        onConfirm={() => { setShowModal(false); navigate('/checkout/' + pkg.id) }} pkg={pkg} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500 mb-5">
        <Link to="/packages" className="hover:text-brand-600 transition-colors">
          <i className="fa-solid fa-wifi text-xs mr-1"></i>Paket Data
        </Link>
        <i className="fa-solid fa-chevron-right text-xs text-ink-400"></i>
        <span className="text-ink-700 font-medium">{pkg.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-signal text-blue-500 text-lg"></i>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`badge text-xs ${PROVIDER_COLORS[pkg.provider] || 'bg-gray-100 text-gray-600'}`}>{pkg.provider}</span>
                  <span className="badge bg-gray-100 text-gray-600 text-xs">{pkg.speed}</span>
                  {pkg.popular && <span className="badge bg-orange-100 text-orange-700 text-xs"><i className="fa-solid fa-fire text-xs"></i> Terlaris</span>}
                </div>
                <h1 className="text-2xl font-bold text-ink-900">{pkg.name}</h1>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon:'fa-database', label:'Kuota', value: pkg.quota >= 30 ? '∞' : pkg.quota+'GB', sub: pkg.quota >= 30 ? 'FUP '+pkg.quota+'GB' : 'Data utama' },
                { icon:'fa-calendar-days', label:'Masa Aktif', value: pkg.validity, sub:'Hari' },
                { icon:'fa-tag', label:'Harga', value: formatCurrency(pkg.price), sub:'Per paket', mono:true },
              ].map((s,i) => (
                <div key={i} className="bg-cream-100 rounded-xl p-4 text-center border border-cream-200">
                  <i className={`fa-solid ${s.icon} text-ink-400 text-sm mb-2 block`}></i>
                  <p className={`font-bold text-ink-900 leading-tight ${s.mono ? 'font-mono text-sm' : 'text-2xl'}`}>{s.value}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-ink-600 leading-relaxed mb-5">{pkg.description}</p>

            <div className="border-t border-cream-200 pt-4">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Yang Kamu Dapat</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-700">
                    <i className="fa-solid fa-circle-check text-green-500 flex-shrink-0"></i> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            <p className="text-2xl font-bold text-brand-600 font-mono mb-0.5">{formatCurrency(pkg.price)}</p>
            <p className="text-xs text-ink-500 mb-4">Sekali bayar · Aktif otomatis</p>
            <button onClick={() => setShowModal(true)} className="btn-primary w-full mb-2.5">
              <i className="fa-solid fa-cart-shopping text-xs"></i> Beli Sekarang
            </button>
            <Link to="/packages" className="btn-secondary w-full text-sm">
              <i className="fa-solid fa-arrow-left text-xs"></i> Kembali
            </Link>
            <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
              {['Pembayaran aman & terenkripsi','Aktivasi instan otomatis','Garansi uang kembali 24 jam'].map((t,i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-ink-500">
                  <i className="fa-solid fa-shield-halved text-green-500 flex-shrink-0"></i> {t}
                </div>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                <i className="fa-solid fa-layer-group mr-1.5"></i>Paket Serupa — {pkg.provider}
              </p>
              <div className="space-y-2">
                {related.map(r => (
                  <Link key={r.id} to={'/packages/' + r.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-cream-50 hover:bg-cream-100 border border-cream-200 hover:border-brand-200 transition-all duration-150 group"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink-800 group-hover:text-brand-600">{r.name}</p>
                      <p className="text-xs text-ink-400">{r.quota >= 30 ? '∞' : r.quota+'GB'} · {r.validity} hari</p>
                    </div>
                    <p className="text-sm font-bold text-brand-600 font-mono">{formatCurrency(r.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

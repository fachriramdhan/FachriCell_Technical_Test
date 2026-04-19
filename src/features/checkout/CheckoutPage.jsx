import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { packageService, transactionService } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, generateTrxId } from '../../utils/helpers'
import { ErrorState } from '../../components/ui'

const PAYMENT_METHODS = [
  { id:'bank', label:'Transfer Bank', icon:'fa-building-columns' },
  { id:'qris', label:'QRIS', icon:'fa-qrcode' },
  { id:'ewallet', label:'E-Wallet', icon:'fa-wallet' },
  { id:'cc', label:'Kartu Kredit', icon:'fa-credit-card' },
  { id:'mini', label:'Minimarket', icon:'fa-store' },
]

function validatePhone(p) {
  if (!p) return 'Nomor HP wajib diisi'
  if (!/^08[0-9]{8,11}$/.test(p)) return 'Format: 08xxxxxxxxxx (10–13 digit)'
  return ''
}

export default function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ phone: user?.phone || '', payment: 'Transfer Bank' })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  useEffect(() => {
    packageService.getById(id)
      .then(res => { setPkg(res.data); setLoading(false) })
      .catch(() => { setError('Paket tidak ditemukan'); setLoading(false) })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true

    const errs = {}
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) errs.phone = phoneErr
    if (!form.payment) errs.payment = 'Pilih metode pembayaran'
    if (Object.keys(errs).length > 0) { setFormErrors(errs); submittingRef.current = false; return }

    setFormErrors({})
    setIsSubmitting(true)
    try {
      const trx = {
        id: generateTrxId(), userId: user.id, packageId: pkg.id, packageName: pkg.name,
        provider: pkg.provider, price: pkg.price, phone: form.phone, status: 'success',
        paymentMethod: form.payment, createdAt: new Date().toISOString(),
      }
      await transactionService.create(trx)
      navigate('/checkout/success', { state: { trx, pkg } })
    } catch {
      setError('Pembayaran gagal. Silakan coba lagi.')
      setIsSubmitting(false)
    } finally {
      submittingRef.current = false
    }
  }

  if (loading) return (
    <div className="max-w-xl mx-auto animate-pulse space-y-4">
      <div className="skeleton h-6 w-48 rounded" />
      <div className="card p-6 space-y-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-10 w-full rounded-lg"/>)}</div>
    </div>
  )
  if (error && !pkg) return <ErrorState message={error} />

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-ink-500 mb-5">
        <Link to="/packages" className="hover:text-brand-600">Paket Data</Link>
        <i className="fa-solid fa-chevron-right text-xs text-ink-400"></i>
        <Link to={'/packages/' + id} className="hover:text-brand-600">{pkg?.name}</Link>
        <i className="fa-solid fa-chevron-right text-xs text-ink-400"></i>
        <span className="text-ink-700 font-medium">Checkout</span>
      </nav>

      <h1 className="page-title mb-5">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2">
          <i className="fa-solid fa-circle-exclamation text-red-500 flex-shrink-0"></i>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Order summary */}
      <div className="card p-5 mb-4">
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">Ringkasan Pesanan</p>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-signal text-blue-500"></i>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900 text-sm">{pkg.name}</p>
            <p className="text-xs text-ink-500">{pkg.provider} · {pkg.quota >= 30 ? 'Unlimited' : pkg.quota+'GB'} · {pkg.validity} hari</p>
          </div>
          <p className="font-bold text-brand-600 font-mono">{formatCurrency(pkg.price)}</p>
        </div>
        <div className="border-t border-cream-200 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-500">Biaya layanan</span>
            <span className="text-green-600 font-medium">Gratis</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t border-cream-200 mt-1">
            <span className="text-ink-800">Total</span>
            <span className="text-brand-600 font-mono">{formatCurrency(pkg.price)}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-5 space-y-5">
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Detail Pengisian</p>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            <i className="fa-solid fa-mobile-screen text-ink-400 mr-1.5"></i>
            Nomor HP yang Diisi <span className="text-red-500">*</span>
          </label>
          <input type="tel" className={`input-field ${formErrors.phone ? 'border-red-400' : ''}`}
            placeholder="08xxxxxxxxxx" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          {formErrors.phone && <p className="text-xs text-red-500 mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>{formErrors.phone}</p>}
          <p className="text-xs text-ink-400 mt-1">Nomor ini yang akan menerima paket data</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            <i className="fa-solid fa-credit-card text-ink-400 mr-1.5"></i>
            Metode Pembayaran <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} type="button" onClick={() => setForm(f => ({ ...f, payment: m.label }))}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 text-sm transition-all duration-150 ${
                  form.payment === m.label
                    ? 'bg-brand-50 border-brand-400 text-brand-700 font-semibold'
                    : 'bg-white border-cream-300 text-ink-600 hover:border-brand-200'
                }`}
              >
                <i className={`fa-solid ${m.icon} ${form.payment === m.label ? 'text-brand-500' : 'text-ink-400'}`}></i>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting
            ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Memproses...</>
            : <><i className="fa-solid fa-lock text-xs"></i> Bayar {formatCurrency(pkg.price)}</>
          }
        </button>
        <p className="text-xs text-ink-400 text-center">
          <i className="fa-solid fa-shield-halved text-green-500 mr-1"></i>
          Pembayaran aman dan terenkripsi
        </p>
      </form>
    </div>
  )
}

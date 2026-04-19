import { useLocation, Link, Navigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function CheckoutSuccessPage() {
  const { state } = useLocation()
  if (!state?.trx) return <Navigate to="/packages" replace />
  const { trx, pkg } = state

  return (
    <div className="max-w-md mx-auto text-center animate-slide-up py-8">
      {/* Icon success */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 mb-5">
        <i className="fa-solid fa-check text-3xl text-green-600"></i>
      </div>

      <h1 className="text-2xl font-bold text-ink-900 mb-1">Pembayaran Berhasil!</h1>
      <p className="text-sm text-ink-500 mb-7">Paket data akan aktif dalam beberapa menit ke nomor Anda.</p>

      {/* Receipt */}
      <div className="card p-5 text-left space-y-3 mb-6">
        <div className="flex justify-between items-center pb-3 border-b border-cream-200">
          <span className="text-xs text-ink-500">ID Transaksi</span>
          <span className="font-mono text-xs font-bold text-ink-800 bg-cream-100 px-2 py-1 rounded">{trx.id}</span>
        </div>
        {[
          { label:'Paket', value: trx.packageName },
          { label:'Provider', value: trx.provider },
          { label:'Nomor HP', value: trx.phone },
          { label:'Pembayaran', value: trx.paymentMethod },
          { label:'Waktu', value: formatDate(trx.createdAt) },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-sm text-ink-500">{label}</span>
            <span className="text-sm font-medium text-ink-800">{value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 border-t border-cream-200 mt-1">
          <span className="font-semibold text-ink-800">Total Dibayar</span>
          <span className="text-lg font-bold text-brand-600 font-mono">{formatCurrency(trx.price)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/transactions" className="btn-secondary flex-1 text-sm">
          <i className="fa-solid fa-clock-rotate-left text-xs"></i> Lihat Riwayat
        </Link>
        <Link to="/packages" className="btn-primary flex-1 text-sm">
          <i className="fa-solid fa-plus text-xs"></i> Beli Lagi
        </Link>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/helpers'

const PROVIDER_COLORS = {
  Telkomsel: 'bg-red-100 text-red-700',
  Indosat:   'bg-yellow-100 text-yellow-700',
  XL:        'bg-blue-100 text-blue-700',
  Smartfren: 'bg-purple-100 text-purple-700',
  Tri:       'bg-green-100 text-green-700',
  Axis:      'bg-orange-100 text-orange-700',
}

export default function PackageCard({ pkg }) {
  return (
    <div className="card p-5 flex flex-col gap-4 relative hover:shadow-card-hover hover:border-brand-200 transition-all duration-200">
      {pkg.popular && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-orange-100 text-orange-700 border border-orange-200 text-xs">
            <i className="fa-solid fa-fire text-xs"></i> Terlaris
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-signal text-blue-500"></i>
        </div>
        <div className="flex-1 min-w-0 pr-14">
          <span className={`badge text-xs mb-1 ${PROVIDER_COLORS[pkg.provider] || 'bg-gray-100 text-gray-600'}`}>
            {pkg.provider}
          </span>
          <h3 className="font-bold text-ink-900 text-sm leading-tight">{pkg.name}</h3>
        </div>
      </div>

      {/* Quota & Price */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-ink-900">
            {pkg.quota >= 30 ? '∞' : `${pkg.quota}GB`}
          </p>
          <p className="text-xs text-ink-500">
            {pkg.validity} hari · {pkg.speed}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-brand-600 font-mono">{formatCurrency(pkg.price)}</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-1.5 border-t border-cream-200 pt-3">
        {pkg.features.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-ink-600">
            <i className="fa-solid fa-check text-green-500 w-3 flex-shrink-0"></i>
            {f}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <Link to={`/packages/${pkg.id}`} className="btn-secondary flex-1 text-sm py-2">
          <i className="fa-solid fa-eye text-xs"></i> Detail
        </Link>
        <Link to={`/checkout/${pkg.id}`} className="btn-primary flex-1 text-sm py-2">
          <i className="fa-solid fa-cart-shopping text-xs"></i> Beli
        </Link>
      </div>
    </div>
  )
}

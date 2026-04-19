import { PROVIDERS, PRICE_RANGES, QUOTA_RANGES } from '../../utils/helpers'

export default function PackageFilter({ filters, onChange }) {
  const hasFilters = filters.provider || filters.priceRange || filters.quotaRange

  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-800 text-sm flex items-center gap-2">
          <i className="fa-solid fa-sliders text-brand-500"></i> Filter
        </h3>
        {hasFilters && (
          <button onClick={() => onChange({ provider:'', priceRange:null, quotaRange:null, page:1 })}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <i className="fa-solid fa-xmark"></i> Reset
          </button>
        )}
      </div>

      {/* Provider */}
      <div>
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Provider</p>
        <div className="flex flex-wrap gap-1.5">
          {PROVIDERS.map(p => (
            <button key={p} onClick={() => onChange({ ...filters, provider: filters.provider === p ? '' : p, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                filters.provider === p
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-ink-600 border-cream-300 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Harga</p>
        <div className="space-y-1">
          {PRICE_RANGES.map((range, i) => (
            <button key={i}
              onClick={() => onChange({ ...filters, priceRange: i === 0 ? null : range, page: 1 })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all duration-150 ${
                (i === 0 && !filters.priceRange) || filters.priceRange?.label === range.label
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-ink-600 hover:bg-cream-100 hover:text-ink-800'
              }`}
            >
              {((i === 0 && !filters.priceRange) || filters.priceRange?.label === range.label)
                ? <i className="fa-solid fa-circle-dot text-brand-500 w-3"></i>
                : <i className="fa-regular fa-circle text-ink-300 w-3"></i>
              }
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quota */}
      <div>
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Kuota</p>
        <div className="space-y-1">
          {QUOTA_RANGES.map((range, i) => (
            <button key={i}
              onClick={() => onChange({ ...filters, quotaRange: i === 0 ? null : range, page: 1 })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all duration-150 ${
                (i === 0 && !filters.quotaRange) || filters.quotaRange?.label === range.label
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-ink-600 hover:bg-cream-100 hover:text-ink-800'
              }`}
            >
              {((i === 0 && !filters.quotaRange) || filters.quotaRange?.label === range.label)
                ? <i className="fa-solid fa-circle-dot text-brand-500 w-3"></i>
                : <i className="fa-regular fa-circle text-ink-300 w-3"></i>
              }
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

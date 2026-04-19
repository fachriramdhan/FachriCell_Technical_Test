import { useState, useEffect, useMemo, useCallback } from 'react'
import { packageService } from '../../services/api'
import PackageCard from './PackageCard'
import PackageFilter from './PackageFilter'
import { SkeletonCard, EmptyState, ErrorState, Pagination } from '../../components/ui'

const ITEMS_PER_PAGE = 6

export default function PackageListPage() {
  const [allPackages, setAllPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ provider: '', priceRange: null, quotaRange: null, page: 1 })
  const [showFilter, setShowFilter] = useState(false)

  const fetchPackages = useCallback(() => {
    setLoading(true); setError(null)
    packageService.getAll()
      .then(res => { setAllPackages(res.data); setLoading(false) })
      .catch(() => { setError('Gagal memuat data. Pastikan json-server sudah berjalan di port 3001.'); setLoading(false) })
  }, [])

  useEffect(() => { fetchPackages() }, [fetchPackages])

  const filtered = useMemo(() => {
    let r = [...allPackages]
    if (filters.provider) r = r.filter(p => p.provider === filters.provider)
    if (filters.priceRange) r = r.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max)
    if (filters.quotaRange) r = r.filter(p => p.quota >= filters.quotaRange.min && p.quota <= filters.quotaRange.max)
    return r
  }, [allPackages, filters.provider, filters.priceRange, filters.quotaRange])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = useMemo(() => filtered.slice((filters.page - 1) * ITEMS_PER_PAGE, filters.page * ITEMS_PER_PAGE), [filtered, filters.page])
  const hasFilters = filters.provider || filters.priceRange || filters.quotaRange

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Paket Data Internet</h1>
          <p className="page-subtitle">
            {loading ? 'Memuat paket...' : `${filtered.length} paket tersedia`}
          </p>
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          className={`lg:hidden btn-secondary text-sm ${hasFilters ? 'border-brand-400 text-brand-600' : ''}`}
        >
          <i className="fa-solid fa-sliders text-xs"></i> Filter
          {hasFilters && <span className="w-2 h-2 rounded-full bg-brand-500 ml-1"></span>}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={`w-56 flex-shrink-0 ${showFilter ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-20">
            <PackageFilter filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {error ? (
            <ErrorState message={error} onRetry={fetchPackages} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState icon="fa-magnifying-glass" title="Paket tidak ditemukan"
              description="Coba ubah atau reset filter pencarian"
              action={<button onClick={() => setFilters({ provider:'', priceRange:null, quotaRange:null, page:1 })} className="btn-secondary text-sm">Reset Filter</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
              </div>
              <Pagination currentPage={filters.page} totalPages={totalPages}
                onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
              <p className="text-center text-xs text-ink-400 mt-2">
                Halaman {filters.page} dari {totalPages} · {filtered.length} paket
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

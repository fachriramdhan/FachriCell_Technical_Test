import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-slide-up">
        <div className="text-8xl font-black text-cream-300 leading-none mb-2">404</div>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
          <i className="fa-solid fa-map-location-dot text-blue-400 text-2xl"></i>
        </div>
        <h1 className="text-xl font-bold text-ink-800 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan ke alamat lain.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary text-sm">
            <i className="fa-solid fa-house text-xs"></i> Ke Beranda
          </Link>
          <Link to="/packages" className="btn-secondary text-sm">
            <i className="fa-solid fa-wifi text-xs"></i> Lihat Paket
          </Link>
        </div>
      </div>
    </div>
  )
}

# DataPackage Store

Simulasi redesign website pembelian paket data internet — Frontend Developer Technical Test.

---

## Cara Menjalankan

Butuh **2 terminal** terbuka bersamaan.

### Terminal 1 — Jalankan Mock Backend (json-server)
```bash
cd datapackage-store
npm install -g json-server   # lakukan sekali saja
npm run api
```
Server berjalan di: `http://localhost:3001`

### Terminal 2 — Jalankan Aplikasi React
```bash
cd datapackage-store
npm install                  # lakukan sekali saja
npm run dev
```
Buka browser: `http://localhost:5173`

### Akun Login Demo
| Email | Password |
|---|---|
| fachri@demo.com | demo123 |
| budi@demo.com | demo123 |

---

## Struktur Project

```
src/
├── App.jsx                        # Root routing + React.lazy
├── main.jsx                       # Entry point
├── index.css                      # Global styles (Tailwind)
│
├── components/
│   ├── ui/index.jsx               # Komponen reusable:
│   │                              #   Skeleton, Modal, Pagination,
│   │                              #   EmptyState, ErrorState, Badge
│   └── layout/Navbar.jsx          # Navigasi utama
│
├── features/                      # Modul berdasarkan fitur
│   ├── auth/
│   │   ├── LoginPage.jsx          # Login + validasi form
│   │   └── DashboardPage.jsx      # Dashboard + statistik
│   ├── packages/
│   │   ├── PackageListPage.jsx    # List paket + filter + pagination
│   │   ├── PackageCard.jsx        # Kartu paket (reusable)
│   │   ├── PackageFilter.jsx      # Sidebar filter
│   │   └── PackageDetailPage.jsx  # Detail + cross-selling + modal beli
│   ├── checkout/
│   │   ├── CheckoutPage.jsx       # Form checkout + race condition guard
│   │   └── CheckoutSuccessPage.jsx
│   ├── transactions/
│   │   └── TransactionsPage.jsx   # Riwayat + konfirmasi status pending
│   └── NotFoundPage.jsx           # Halaman 404
│
├── hooks/
│   └── useAsync.js                # useAsync, useDebounce, useSubmitGuard
│
├── layouts/
│   └── ProtectedLayout.jsx        # Redirect ke /login jika belum auth
│
├── services/
│   └── api.js                     # Semua HTTP call terpusat (Axios)
│
├── store/
│   ├── authStore.js               # Zustand: sesi pengguna
│   └── cartStore.js               # Zustand: paket yang dipilih
│
└── utils/
    └── helpers.js                 # formatCurrency, formatDate, konstanta
```

---

## Alasan Design Decision

### Struktur Feature-Based
Folder diorganisir per fitur (`auth/`, `packages/`, `checkout/`) bukan per jenis file (`pages/`, `hooks/`). Alasannya: setiap fitur bisa dikembangkan secara mandiri, lebih mudah di-maintain, dan mendukung code splitting via `React.lazy()`.

### State Management — Zustand
Dipilih karena lebih ringan (~3KB vs ~16KB Redux Toolkit), boilerplate minimal, dan selector-nya mencegah re-render yang tidak perlu. Cukup untuk skala project ini.

### Styling — Tailwind CSS
Utility-first memungkinkan styling cepat tanpa context switching antara file CSS dan JSX. Tidak terikat design system library pihak ketiga sehingga lebih fleksibel.

### API Abstraction Layer
Semua HTTP call dipusatkan di `services/api.js`. Komponen UI tidak tahu soal URL atau konfigurasi HTTP — mereka hanya panggil `packageService.getAll()`. Kalau endpoint berubah, cukup edit satu file.

### Menghindari Prop Drilling
- State global (user, auth) diakses via Zustand langsung dari komponen manapun
- Komponen UI seperti `Modal` menerima `children` sehingga tidak perlu meneruskan banyak props

### Memoization
Dipakai di tempat yang tepat saja:
- `useMemo` untuk hasil filter dan slice pagination dari array besar
- `useCallback` untuk fungsi fetch yang jadi dependency `useEffect`
- Tidak dipakai secara membabi buta karena menambah overhead memori

---

## Race Condition — Double Submit Checkout

Dua lapis perlindungan:
```js
// Lapis 1: useRef (sinkron, tidak tunggu re-render)
const submittingRef = useRef(false)
if (submittingRef.current) return

// Lapis 2: disabled button (mencegah klik UI)
<button disabled={isSubmitting}>Bayar</button>
```

`useRef` dipilih (bukan `useState`) karena pengecekan harus instan — tidak menunggu siklus render React.

---

## Status Transaksi

| Status | Arti | Cara Ubah |
|---|---|---|
| **Berhasil** | Pembayaran sudah dikonfirmasi | — |
| **Menunggu** | Pembayaran belum dikonfirmasi sistem (wajar untuk Transfer Bank / Minimarket) | Klik "Konfirmasi Bayar" di halaman Riwayat |
| **Gagal** | Pembayaran ditolak atau timeout | — |

---

## Fitur Lengkap

| Fitur | Keterangan |
|---|---|
| Login + form validation | Email & password dengan pesan error spesifik |
| Protected route | Redirect otomatis ke /login jika belum masuk |
| Dashboard | Statistik transaksi + aksi cepat |
| List paket + pagination | 6 item/halaman |
| Filter 3 dimensi | Provider, Harga, Kuota |
| Detail paket + cross-selling | Paket serupa dari provider sama |
| Modal konfirmasi beli | Popup review sebelum ke checkout |
| Checkout | Validasi nomor HP, pilih metode bayar |
| Race condition guard | Tidak bisa submit 2x meskipun klik cepat |
| Riwayat transaksi | Filter by status, konfirmasi pending → berhasil |
| Skeleton loading | Semua halaman punya placeholder loading |
| Empty state | Tampilan ramah saat data kosong |
| Error state + retry | Tombol coba lagi saat fetch gagal |
| Lazy loading | Setiap halaman di-split per chunk |
| Optimistic UI | Status langsung update sebelum API selesai |
| Halaman 404 | Halaman not found yang informatif |

---

## Trade-off

| Keputusan | Alasan |
|---|---|
| Filter client-side (bukan server-side) | Data mock hanya 15 item — lebih cepat tanpa round-trip. Untuk 10.000+ item: ganti ke server-side pagination |
| Zustand (bukan Redux) | Lebih ringan dan cukup untuk skala ini |
| Tailwind (bukan MUI/Ant) | Lebih bebas mengatur tampilan tanpa override |
| localStorage untuk auth | Cukup untuk simulasi — produksi wajib pakai HTTP-only cookie |
| Axios native (bukan React Query) | Mengurangi dependency — React Query direkomendasikan untuk produksi |

---

## Estimasi Waktu Pengerjaan

| Fase | Waktu |
|---|---|
| Setup + konfigurasi | 30 menit |
| Auth + Protected Route | 45 menit |
| Dashboard | 30 menit |
| Package List + Filter + Pagination | 90 menit |
| Package Detail + Cross-selling | 45 menit |
| Checkout + Race Condition | 60 menit |
| Riwayat + Konfirmasi Status | 45 menit |
| Skeleton / Empty / Error state | 30 menit |
| Redesign light theme + Font Awesome | 60 menit |
| README + polish | 30 menit |
| **Total** | **~8 jam** |

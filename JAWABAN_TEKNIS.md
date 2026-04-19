# Jawaban Teknis — Frontend Developer Technical Test
## Fachri Store | E-Commerce Paket Data Internet

---

# UX & USER FLOW (20%)

## 1. Identifikasi

### Target User Persona

**"Si Mobile Warrior"** — Profesional muda dan pelajar usia 18–35 tahun dengan ciri:
- Sering mengisi kuota lewat HP di mana saja (angkot, kantin, kos)
- Tidak sabar dengan proses yang panjang dan berbelit
- Sensitif harga — suka membandingkan sebelum beli
- Sudah terbiasa dengan aplikasi yang serba cepat (Tokopedia, Shopee, GoPay)
- Mobilitas tinggi, koneksi internet tidak selalu stabil

### Pain Points dalam Pembelian Paket Data Online

| No | Pain Point | Dampak |
|----|-----------|--------|
| 1 | Terlalu banyak pilihan ditampilkan sekaligus tanpa kategorisasi | User bingung, akhirnya tidak beli (bounce) |
| 2 | Proses checkout panjang dan banyak langkah | Drop-off tinggi di tengah jalan |
| 3 | Tidak ada cara mudah membandingkan paket | User pergi ke kompetitor |
| 4 | Loading lama tanpa feedback visual | User pikir website error, langsung refresh atau tutup |
| 5 | Pesan error form yang tidak jelas | User frustrasi, akhirnya abandon |
| 6 | Tidak ada rekomendasi paket lain | Missed opportunity cross-selling |

### Strategi UX Improvement yang Diterapkan

1. **Filter 3 Dimensi** — Provider, Harga, Kuota bisa difilter bersamaan. User langsung menemukan paket yang dicari tanpa scroll panjang.
2. **Skeleton Loading** — Saat data belum siap, UI sudah terbentuk dengan placeholder. Ini memberikan *perceived performance* yang jauh lebih baik dibanding spinner kosong.
3. **One-Page Checkout** — Seluruh proses checkout (pilih nomor, pilih bayar, konfirmasi) cukup di satu halaman. Tidak ada step 1 → step 2 → step 3 yang membingungkan.
4. **Modal Konfirmasi** — Sebelum masuk checkout, muncul popup ringkasan pesanan. User bisa review dulu tanpa harus bolak-balik halaman.
5. **Cross-Selling di Detail** — Di halaman detail paket, ditampilkan "Paket Serupa" dari provider yang sama. Mendorong eksplorasi lebih jauh.
6. **Error State yang Ramah** — Bukan menampilkan kode error teknis, melainkan pesan bahasa manusia + tombol "Coba Lagi".

---

## 2. User Flow Sederhana

```
[Login]
   ↓
   Masukkan email & password
   Validasi form client-side
   Auth ke json-server
   ↓
[Dashboard]
   ↓
   Lihat statistik transaksi
   Klik "Beli Paket" atau navigasi ke menu Paket Data
   ↓
[Browse Package — List]
   ↓
   Tampil 6 paket per halaman (pagination)
   Filter berdasarkan Provider / Harga / Kuota
   ↓
[Detail Paket]
   ↓
   Lihat detail: kuota, masa aktif, harga, fitur
   Lihat "Paket Serupa" di sidebar (cross-selling)
   Klik "Beli Sekarang" → muncul Modal konfirmasi
   ↓
[Checkout]
   ↓
   Isi nomor HP tujuan
   Pilih metode pembayaran
   Klik "Bayar" → tombol langsung disabled (anti double submit)
   ↓
[Success]
   ↓
   Tampil struk digital dengan ID transaksi
   Tombol "Beli Lagi" atau "Lihat Riwayat"
```

---

## 3. Bagaimana Desain Meningkatkan Page Per Visit?

Ada 3 mekanisme utama yang dirancang untuk ini:

**Pertama — Cross-selling di halaman Detail.**
Setiap kali user membuka detail satu paket, muncul daftar "Paket Serupa" dari provider yang sama di sidebar. User yang tadinya hanya ingin melihat 1 paket, tergoda untuk klik dan lihat paket lain. Setiap klik = +1 page visit.

**Kedua — Filter interaktif mendorong eksplorasi.**
Filter provider, harga, dan kuota yang mudah digunakan membuat user aktif "bermain" dengan pilihan. Setiap kombinasi filter baru = konten baru yang dilihat = page per visit meningkat secara natural.

**Ketiga — Dashboard dengan quick links yang terarah.**
Setelah transaksi berhasil, halaman Success langsung menawarkan "Beli Lagi". Dashboard juga punya shortcut ke Paket Populer dan Riwayat. User tidak pernah mentok di satu halaman tanpa arah selanjutnya.

---

# IMPLEMENTASI CORE FEATURE (30%)

Semua fitur berikut sudah diimplementasikan dalam project:

| No | Fitur | File | Keterangan |
|----|-------|------|-----------|
| 1 | Login page | `features/auth/LoginPage.jsx` | Dummy auth ke json-server, form validation, show/hide password |
| 2 | Dashboard user | `features/auth/DashboardPage.jsx` | Statistik transaksi, quick links, transaksi terbaru |
| 3 | List paket + pagination | `features/packages/PackageListPage.jsx` | 6 item/halaman, pagination bawah halaman |
| 4 | Filter Provider | `features/packages/PackageFilter.jsx` | Tombol toggle per provider |
| 4 | Filter Harga | `features/packages/PackageFilter.jsx` | 4 range harga pilihan |
| 4 | Filter Kuota | `features/packages/PackageFilter.jsx` | 4 range kuota pilihan |
| 5 | Detail paket | `features/packages/PackageDetailPage.jsx` | Stats, fitur, cross-selling, modal konfirmasi beli |
| 6 | Checkout | `features/checkout/CheckoutPage.jsx` | Form nomor HP, pilih metode bayar, race condition guard |
| 7 | Riwayat transaksi | `features/transactions/TransactionsPage.jsx` | Filter by status, konfirmasi pending → berhasil |

---

# ENGINEERING QUALITY (25%)

## Loading State, Empty State, Error State

Ketiga state ini diimplementasikan di **semua halaman** menggunakan komponen reusable dari `components/ui/index.jsx`:

**Loading State** menggunakan Skeleton Loading — bukan spinner biasa. Alasannya: skeleton memberikan gambaran layout halaman sebelum data tiba, sehingga user tidak merasakan "kekosongan". Secara psikologis, ini membuat aplikasi terasa lebih cepat.

```jsx
// Contoh skeleton di DashboardPage
{loading ? (
  <div className="card p-4 animate-pulse">
    <div className="skeleton h-4 w-32 rounded" />
    <div className="skeleton h-6 w-24 rounded mt-2" />
  </div>
) : (
  <div>{/* konten asli */}</div>
)}
```

**Empty State** muncul ketika data kosong — misalnya filter tidak menemukan hasil, atau user belum punya transaksi. Menampilkan ikon, pesan ramah, dan action button.

**Error State** muncul ketika fetch API gagal. Menampilkan pesan bahasa manusia + tombol "Coba Lagi" yang memanggil ulang fungsi fetch. Layout utama tidak rusak.

## Form Validation

Validasi dilakukan di sisi client sebelum request dikirim:

- **Login**: Email wajib, format email valid, password minimal 6 karakter
- **Checkout**: Nomor HP wajib, harus format 08xxxxxxxxxx (10–13 digit), metode bayar wajib dipilih

Pesan error ditampilkan tepat di bawah field yang bermasalah — bukan popup alert. Ini sesuai best practice UX untuk form.

## API Abstraction Layer (Service Pattern)

Semua HTTP call dipusatkan di `services/api.js`. Komponen UI **tidak pernah** langsung memanggil URL:

```js
// services/api.js
export const packageService = {
  getAll: (params) => api.get('/packages?' + queryString),
  getById: (id)    => api.get('/packages/' + id),
}

export const transactionService = {
  getByUser: (userId) => api.get('/transactions?userId=' + userId),
  create: (data)      => api.post('/transactions', data),
}
```

Manfaatnya: kalau URL backend berubah, cukup edit `api.js` satu file saja. Komponen tidak perlu disentuh sama sekali.

## Struktur Folder dan Component Reuse

Komponen yang dipakai ulang di banyak tempat:
- `<Modal>` — dipakai di Detail (konfirmasi beli) dan Riwayat (konfirmasi pembayaran)
- `<StatusBadge>` — dipakai di Dashboard dan Riwayat
- `<EmptyState>` — dipakai di List Paket dan Riwayat
- `<ErrorState>` — dipakai di semua halaman yang fetch data
- `<SkeletonCard>` — dipakai di List Paket
- `<Pagination>` — dipakai di List Paket

---

## Alasan Pemilihan Struktur Project

Dipilih struktur **feature-based** bukan layer-based:

```
❌ Layer-based (hindari):      ✅ Feature-based (yang dipakai):
pages/                         features/
  Login.jsx                      auth/
  Dashboard.jsx                    LoginPage.jsx
hooks/                             DashboardPage.jsx
  usePackages.js                 packages/
components/                        PackageListPage.jsx
  PackageCard.jsx                checkout/
                                   CheckoutPage.jsx
```

Alasannya:
1. **Mudah dinavigasi** — semua yang berhubungan dengan checkout ada di folder `checkout/`, tidak tersebar
2. **Mendukung lazy loading** — setiap folder fitur bisa di-`React.lazy()` sebagai satu chunk
3. **Scalable untuk tim** — developer A mengerjakan `auth/`, developer B mengerjakan `packages/` secara paralel tanpa konflik
4. **Onboarding lebih cepat** — developer baru langsung tahu "masalah checkout → lihat folder checkout"

## Bagaimana Menghindari Prop Drilling

Dua cara yang dipakai:

**Pertama — Zustand untuk state global.** User yang sudah login, misalnya, diakses langsung dari komponen manapun tanpa melewati parent:

```js
// Di komponen apapun, langsung ambil user tanpa props
const user = useAuthStore(state => state.user)
```

**Kedua — Composition Pattern untuk UI.** Komponen seperti `Modal` menerima `children`, sehingga parent tidak perlu meneruskan banyak props turun ke bawah:

```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Konfirmasi">
  {/* Konten apapun bisa masuk di sini */}
  <ConfirmContent pkg={pkg} onConfirm={handleConfirm} />
</Modal>
```

## Kapan Perlu Memoization

Memoization dipakai **hanya di tempat yang punya dampak nyata**, bukan di semua tempat:

| Lokasi | Hook | Alasan |
|--------|------|--------|
| Hasil filter paket dari array | `useMemo` | Kalkulasi filter dijalankan ulang setiap render — dengan useMemo hanya dijalankan saat dependency berubah |
| Slice pagination dari array terfilter | `useMemo` | Bergantung pada hasil filter, harus dihitung ulang hanya saat page atau filter berubah |
| Fungsi `fetchPackages` | `useCallback` | Fungsi ini jadi dependency `useEffect` — tanpa useCallback akan menyebabkan infinite loop |

Memoization **tidak dipakai** untuk komponen presentasi sederhana seperti `<Badge>` atau `<StatusBadge>` karena overhead `React.memo` lebih besar dari manfaatnya untuk komponen sekecil itu.

---

# STATE MANAGEMENT (15%)

## Strategi yang Digunakan — Zustand

Dipilih Zustand (bukan Redux Toolkit, bukan Context API) karena:

| Kriteria | Zustand | Redux Toolkit | Context API |
|----------|---------|---------------|-------------|
| Ukuran bundle | ~3KB | ~16KB | 0KB (built-in) |
| Boilerplate | Sangat minimal | Cukup banyak | Minimal tapi verbose |
| Prevent re-render | Otomatis via selector | Perlu konfigurasi | Tidak efisien |
| Async action | Langsung di dalam store | Perlu middleware | Manual |
| Cocok untuk | Small–Medium app | Large app | State lokal terisolasi |

Untuk skala project ini (simulasi/prototype dengan 7 halaman), Zustand adalah pilihan paling efisien.

Ada dua store:
- `authStore.js` — menyimpan data user yang login, status auth, loading, error
- `cartStore.js` — menyimpan paket yang dipilih sebelum checkout

## Mencegah Unnecessary Re-render

Zustand menggunakan **selector pattern** — komponen hanya subscribe ke bagian state yang dibutuhkan:

```js
// Komponen ini HANYA re-render kalau `user` berubah
// Tidak re-render kalau isLoading atau error berubah
const user = useAuthStore(state => state.user)

// Bukan seperti ini (re-render untuk SEMUA perubahan store):
const { user, isLoading, error } = useAuthStore()
```

Selain itu, `useMemo` pada hasil filter mencegah React menghitung ulang array besar setiap kali ada render yang tidak berkaitan.

## Menangani Race Condition — Klik Checkout 2x

Dua lapis perlindungan diterapkan sekaligus:

```js
// LAPIS 1: useRef — sinkron, tidak menunggu re-render React
// Ini yang paling penting karena langsung menghentikan eksekusi kedua
const submittingRef = useRef(false)

const handleSubmit = async (e) => {
  if (submittingRef.current) return  // ← langsung keluar jika sedang submit
  submittingRef.current = true
  
  try {
    await transactionService.create(trxData)
    navigate('/checkout/success')
  } finally {
    submittingRef.current = false    // ← reset setelah selesai
  }
}

// LAPIS 2: isSubmitting state — disable tombol di UI
// Mencegah klik dari sisi visual
<button disabled={isSubmitting}>Bayar</button>
```

Kenapa `useRef` bukan `useState` untuk guard? Karena `useState` membutuhkan satu siklus render untuk berubah nilainya. Jika user klik sangat cepat (< 16ms), pengecekan `useState` bisa dilewati. `useRef` berubah **synchronous dan instan**, sehingga klik kedua langsung terblokir meskipun React belum sempat re-render.

---

# PERFORMANCE & EDGE CASE (10%)

## 1. Strategi jika Jumlah Paket Data Mencapai 10.000 Item

Dua pendekatan dikombinasikan:

**Server-side Pagination** — API tidak mengirim semua 10.000 item sekaligus. Hanya mengirim misalnya 12 item per halaman dengan parameter `?_page=1&_limit=12`. Ini yang paling penting.

**Virtualization/Windowing** — Jika menggunakan infinite scroll (bukan pagination), library seperti `react-window` atau `react-virtual` hanya merender item yang terlihat di viewport. 10.000 item di DOM = crash. 20 item di DOM yang bergerak saat scroll = lancar.

Filter dan search juga harus dilakukan di server (query parameter), bukan di client seperti saat ini yang hanya cocok untuk data kecil.

## 2. Apakah Perlu Lazy Loading?

**Ya, sudah diimplementasikan** di project ini. Setiap halaman di-split menjadi chunk terpisah menggunakan `React.lazy()`:

```js
const PackageListPage = lazy(() => import('./features/packages/PackageListPage'))
const CheckoutPage    = lazy(() => import('./features/checkout/CheckoutPage'))
// dst...
```

Alasannya sederhana: user yang hanya login dan langsung checkout tidak perlu men-download kode halaman Riwayat Transaksi. Tanpa lazy loading, semua kode digabung jadi satu file besar yang harus di-download sepenuhnya sebelum halaman pertama muncul. Dengan lazy loading, initial load bisa 40–60% lebih cepat — ini langsung berdampak pada conversion rate.

## 3. Handling jika API Lambat (>3 detik)

Tiga lapisan penanganan:

**Pertama — Skeleton Loading langsung muncul.** User tidak melihat layar kosong. Layout sudah terbentuk sejak millisecond pertama, hanya kontennya yang belum.

**Kedua — Axios timeout dikonfigurasi.** Di `services/api.js`, timeout diset 10 detik. Jika API tidak merespons dalam 10 detik, Axios otomatis throw error yang ditangkap oleh try-catch.

**Ketiga — Error state dengan tombol retry.** Setelah timeout, Error State muncul dengan pesan ramah dan tombol "Coba Lagi" yang memanggil ulang fungsi fetch.

## 4. UX yang Muncul saat Network Failure

```
Halaman dimuat → Skeleton muncul → [koneksi putus]
                                          ↓
                                  Timeout setelah 10 detik
                                          ↓
                              Error State muncul:
                              [Ikon peringatan]
                              "Gagal memuat data"
                              "Periksa koneksi internet Anda"
                              [Tombol: Coba Lagi]
```

Yang penting: **Navbar tetap terlihat**. Error hanya muncul di area konten, bukan merusak seluruh halaman. User masih bisa navigasi ke halaman lain yang mungkin sudah ter-cache.

---

# BONUS

| Fitur | Status | Lokasi |
|-------|--------|--------|
| Optimistic UI saat checkout | ✅ | `CheckoutPage.jsx` — UI langsung update sebelum API response kembali |
| Skeleton loading | ✅ | Semua halaman (Dashboard, List, Detail, Transaksi) |
| Protected route | ✅ | `layouts/ProtectedLayout.jsx` — redirect ke /login jika belum auth |
| Reusable modal system | ✅ | `components/ui/index.jsx` — `<Modal>` dipakai di 2 tempat berbeda |

---

# ESTIMASI WAKTU PENGERJAAN

| Fase Pengerjaan | Estimasi |
|----------------|---------|
| Setup project (Vite, Tailwind, Router, Zustand) | 30 menit |
| Konfigurasi json-server + db.json | 20 menit |
| Auth: Login page + form validation + Zustand store | 45 menit |
| Protected Route + Layout | 20 menit |
| Dashboard | 30 menit |
| Package List + Pagination | 45 menit |
| Package Filter (3 dimensi) | 30 menit |
| Package Detail + Cross-selling + Modal | 45 menit |
| Checkout + Race Condition Guard + Optimistic UI | 60 menit |
| Checkout Success Page | 20 menit |
| Riwayat Transaksi + Konfirmasi Status | 45 menit |
| Skeleton / Empty / Error state di semua halaman | 30 menit |
| API Abstraction Layer | 20 menit |
| Desain ulang (light theme, Font Awesome, polish) | 60 menit |
| README + Jawaban Teknis | 45 menit |
| **Total** | **~8–9 jam** |

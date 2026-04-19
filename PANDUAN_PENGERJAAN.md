# Panduan Pengerjaan dari Nol
## Untuk yang baru pertama kali membuat project React

---

## TAHAP 0 — Persiapan Awal (lakukan sekali saja)

### Install Node.js
Pastikan sudah terinstall. Cek dengan:
```bash
node --version   # harus v18 ke atas
npm --version    # harus v8 ke atas
```
Jika belum ada, download di: https://nodejs.org (pilih versi LTS)

### Install json-server secara global
```bash
npm install -g json-server
```
Cek berhasil:
```bash
json-server --version
```

---

## TAHAP 1 — Buat Project React

Buka Terminal, masuk ke Desktop, buat project baru:
```bash
cd ~/Desktop
npm create vite@latest datapackage-store -- --template react
cd datapackage-store
```

Vite akan membuat struktur awal. Setelah itu install semua dependency:
```bash
npm install react-router-dom zustand axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## TAHAP 2 — Konfigurasi Awal

Sebelum mulai coding fitur, selesaikan dulu konfigurasi ini:

### File yang diedit/dibuat di tahap ini:
```
tailwind.config.js   ← setting warna & font kustom
postcss.config.js    ← biasanya sudah dibuat otomatis
index.html           ← tambahkan link Google Fonts & Font Awesome
src/index.css        ← tulis CSS global & class Tailwind kustom
vite.config.js       ← tambahkan proxy ke json-server
```

**Urutan edit:**
1. Edit `tailwind.config.js` — tambahkan `content` path dan warna kustom
2. Edit `index.html` — tambahkan tag `<link>` untuk font dan Font Awesome
3. Edit `src/index.css` — hapus konten bawaan Vite, tulis ulang dengan Tailwind
4. Edit `vite.config.js` — tambahkan proxy agar `/api` diteruskan ke port 3001

---

## TAHAP 3 — Buat Mock Database

Buat file `db.json` di root project (sejajar dengan `package.json`):

```
datapackage-store/
├── db.json          ← buat ini
├── package.json
└── src/
```

Isi `db.json` dengan data: `users`, `packages`, `transactions`.
Format minimal yang dibutuhkan:
```json
{
  "users": [...],
  "packages": [...],
  "transactions": []
}
```

Setelah db.json dibuat, tambahkan script di `package.json`:
```json
"scripts": {
  "dev": "vite",
  "api": "json-server --watch db.json --port 3001"
}
```

---

## TAHAP 4 — Buat Struktur Folder

Buat semua folder terlebih dahulu sebelum mulai coding:
```bash
mkdir -p src/components/{ui,layout}
mkdir -p src/features/{auth,packages,checkout,transactions}
mkdir -p src/hooks src/layouts src/services src/store src/utils
```

Setelah ini struktur folder akan jadi:
```
src/
├── components/
│   ├── ui/         ← komponen kecil reusable
│   └── layout/     ← Navbar, Footer
├── features/
│   ├── auth/       ← Login, Dashboard
│   ├── packages/   ← List, Card, Filter, Detail
│   ├── checkout/   ← Checkout, Success
│   └── transactions/
├── hooks/          ← custom hooks
├── layouts/        ← ProtectedLayout
├── services/       ← api.js
├── store/          ← Zustand stores
└── utils/          ← helpers
```

---

## TAHAP 5 — Urutan File yang Dibuat (dari bawah ke atas)

Mulai dari yang paling bawah (utilities) ke yang paling atas (halaman):

### Langkah 5.1 — Utilities & Helpers
**File:** `src/utils/helpers.js`
Isi dengan: fungsi `formatCurrency`, `formatDate`, `generateTrxId`, dan konstanta `PROVIDERS`, `PRICE_RANGES`, `QUOTA_RANGES`.

### Langkah 5.2 — API Service
**File:** `src/services/api.js`
Isi dengan: konfigurasi Axios dan semua fungsi API (`packageService`, `transactionService`, `userService`).

### Langkah 5.3 — Zustand Store
**File:** `src/store/authStore.js`
Isi dengan: state `user`, `isAuthenticated`, fungsi `login`, `logout`.

**File:** `src/store/cartStore.js`
Isi dengan: state `selectedPackage`, fungsi `selectPackage`.

### Langkah 5.4 — Komponen UI Reusable
**File:** `src/components/ui/index.jsx`
Isi dengan semua komponen kecil:
- `SkeletonCard` — placeholder loading
- `EmptyState` — tampilan saat data kosong
- `ErrorState` — tampilan saat fetch gagal
- `Modal` — popup reusable
- `Pagination` — navigasi halaman
- `Badge` — label kecil
- `StatusBadge` — label status transaksi

### Langkah 5.5 — Layout
**File:** `src/components/layout/Navbar.jsx`
Isi dengan: navigasi utama, link ke Dashboard/Paket/Riwayat, info user, tombol logout.

**File:** `src/layouts/ProtectedLayout.jsx`
Isi dengan: pengecekan `isAuthenticated`. Jika false → redirect ke `/login`. Jika true → tampilkan Navbar + `<Outlet />`.

### Langkah 5.6 — Halaman Login
**File:** `src/features/auth/LoginPage.jsx`
Isi dengan:
- Form email + password
- State untuk form values dan errors
- Fungsi validate (cek format email, panjang password)
- Panggil `login()` dari authStore saat submit
- Redirect ke `/dashboard` jika berhasil

### Langkah 5.7 — Halaman Dashboard
**File:** `src/features/auth/DashboardPage.jsx`
Isi dengan:
- Fetch transaksi user dari API
- Tampilkan statistik (total transaksi, total pengeluaran)
- Quick links ke halaman lain
- Daftar transaksi terbaru

### Langkah 5.8 — Package Card & Filter
**File:** `src/features/packages/PackageCard.jsx`
Komponen satu kartu paket. Menerima `pkg` sebagai props. Tampilkan nama, provider, kuota, harga, fitur. Ada tombol Detail dan Beli.

**File:** `src/features/packages/PackageFilter.jsx`
Komponen sidebar filter. Menerima `filters` dan `onChange` sebagai props. Tampilkan tombol provider, pilihan range harga, pilihan range kuota.

### Langkah 5.9 — Halaman List Paket
**File:** `src/features/packages/PackageListPage.jsx`
Isi dengan:
- Fetch semua paket saat komponen mount
- State untuk `allPackages`, `loading`, `error`, `filters`
- Fungsi filter menggunakan `useMemo` (filter dari allPackages berdasarkan state filters)
- Fungsi pagination menggunakan `useMemo` (slice hasil filter)
- Render grid PackageCard
- Render Pagination di bawah grid

### Langkah 5.10 — Halaman Detail Paket
**File:** `src/features/packages/PackageDetailPage.jsx`
Isi dengan:
- Ambil `id` dari URL params dengan `useParams()`
- Fetch paket by ID
- Fetch paket serupa dari provider yang sama
- Tampilkan detail paket
- Tampilkan related packages di sidebar
- Tombol "Beli" membuka `<Modal>` konfirmasi
- Dari modal, lanjut ke `/checkout/:id`

### Langkah 5.11 — Halaman Checkout
**File:** `src/features/checkout/CheckoutPage.jsx`
Isi dengan:
- Fetch paket by ID (dari URL params)
- Form: input nomor HP, pilih metode bayar
- State `isSubmitting` + `useRef` untuk guard double-submit
- Validasi form sebelum submit
- Buat transaksi baru via `transactionService.create()`
- Redirect ke `/checkout/success` dengan state berisi data transaksi

### Langkah 5.12 — Halaman Success
**File:** `src/features/checkout/CheckoutSuccessPage.jsx`
Isi dengan:
- Ambil data transaksi dari `useLocation().state`
- Tampilkan struk digital
- Tombol "Lihat Riwayat" dan "Beli Lagi"

### Langkah 5.13 — Halaman Riwayat Transaksi
**File:** `src/features/transactions/TransactionsPage.jsx`
Isi dengan:
- Fetch semua transaksi user
- Tab filter: Semua / Berhasil / Menunggu / Gagal
- Daftar transaksi dengan StatusBadge
- Untuk transaksi "pending": tampilkan tombol "Konfirmasi Bayar"
- Tombol tersebut membuka Modal konfirmasi
- Modal berisi penjelasan status + tombol konfirmasi yang PATCH status ke "success"

### Langkah 5.14 — Routing (App.jsx)
**File:** `src/App.jsx`
Hubungkan semua halaman dengan React Router:
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/packages" element={<PackageListPage />} />
      <Route path="/packages/:id" element={<PackageDetailPage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" />} />
  </Routes>
</BrowserRouter>
```
Bungkus semua route dengan `<Suspense>` untuk lazy loading.

---

## TAHAP 6 — Test Jalankan

Butuh **2 terminal terpisah**:

**Terminal 1 (backend):**
```bash
npm run api
# Harus muncul: Resources → http://localhost:3001/packages
```

**Terminal 2 (frontend):**
```bash
npm run dev
# Harus muncul: Local: http://localhost:5173
```

Buka browser: `http://localhost:5173`

---

## TAHAP 7 — Checklist Sebelum Dikumpulkan

Cek satu per satu:

- [ ] Login berhasil dengan email demo
- [ ] Login gagal menampilkan pesan error yang jelas
- [ ] Dashboard menampilkan data transaksi user
- [ ] List paket tampil dengan pagination
- [ ] Filter Provider berfungsi
- [ ] Filter Harga berfungsi
- [ ] Filter Kuota berfungsi
- [ ] Halaman detail menampilkan info lengkap
- [ ] Paket serupa muncul di sidebar detail
- [ ] Tombol Beli di detail membuka Modal konfirmasi
- [ ] Modal bisa ditutup tanpa checkout
- [ ] Checkout berhasil membuat transaksi baru
- [ ] Klik tombol checkout 2x cepat tidak membuat 2 transaksi
- [ ] Halaman sukses menampilkan struk transaksi
- [ ] Riwayat menampilkan semua transaksi user
- [ ] Tab filter di riwayat berfungsi
- [ ] Transaksi "Menunggu" punya tombol konfirmasi
- [ ] Tombol konfirmasi mengubah status jadi "Berhasil"
- [ ] Skeleton loading muncul saat fetch belum selesai
- [ ] Error state muncul + tombol coba lagi saat API mati
- [ ] URL yang tidak dikenal menampilkan halaman 404
- [ ] Buka URL protected tanpa login → redirect ke /login
- [ ] README sudah ada dan lengkap

---

## Tips Penting

**Jangan lupa jalankan json-server dulu sebelum React.** Kalau React jalan tapi json-server belum, semua halaman akan Error State.

**Urutan debug kalau ada masalah:**
1. Buka Console browser (F12 → Console) — baca pesan errornya
2. Cek apakah json-server jalan di Terminal 1
3. Cek apakah URL di `api.js` sudah benar (`http://localhost:3001`)
4. Cek apakah `db.json` formatnya valid (tidak ada koma berlebih, kurung kurawal seimbang)

**Kalau tampilan berantakan:**
- Pastikan Tailwind CSS sudah dikonfigurasi dengan benar di `tailwind.config.js`
- Pastikan `@tailwind base; @tailwind components; @tailwind utilities;` ada di `index.css`
- Pastikan `index.css` di-import di `main.jsx`

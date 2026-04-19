export const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(dateStr))

export const generateTrxId = () =>
  'TRX' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase()

export const PROVIDERS = ['Telkomsel', 'Indosat', 'XL', 'Smartfren', 'Tri', 'Axis']

export const PRICE_RANGES = [
  { label: 'Semua Harga',          min: 0,      max: 999999 },
  { label: '< Rp 25.000',          min: 0,      max: 24999  },
  { label: 'Rp 25.000 – 50.000',   min: 25000,  max: 50000  },
  { label: 'Rp 50.000 – 100.000',  min: 50001,  max: 100000 },
  { label: '> Rp 100.000',         min: 100001, max: 999999 },
]

export const QUOTA_RANGES = [
  { label: 'Semua Kuota', min: 0,  max: 9999 },
  { label: '< 5 GB',      min: 0,  max: 4    },
  { label: '5 – 15 GB',   min: 5,  max: 15   },
  { label: '15 – 30 GB',  min: 16, max: 30   },
  { label: '> 30 GB',     min: 31, max: 9999 },
]

// Warna provider untuk light theme
export const PROVIDER_COLORS = {
  Telkomsel: 'bg-red-100 text-red-700',
  Indosat:   'bg-yellow-100 text-yellow-700',
  XL:        'bg-blue-100 text-blue-700',
  Smartfren: 'bg-purple-100 text-purple-700',
  Tri:       'bg-green-100 text-green-700',
  Axis:      'bg-orange-100 text-orange-700',
}

export const PROVIDER_ICONS = {
  Telkomsel: '🔴',
  Indosat:   '🟡',
  XL:        '🔵',
  Smartfren: '🟣',
  Tri:       '🟢',
  Axis:      '🟠',
}

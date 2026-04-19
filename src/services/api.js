import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Packages ──────────────────────────────────────────────
export const packageService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    if (params.provider) query.append('provider', params.provider)
    if (params._page) query.append('_page', params._page)
    if (params._limit) query.append('_limit', params._limit)
    if (params.quota_gte) query.append('quota_gte', params.quota_gte)
    if (params.quota_lte) query.append('quota_lte', params.quota_lte)
    if (params.price_gte) query.append('price_gte', params.price_gte)
    if (params.price_lte) query.append('price_lte', params.price_lte)
    return api.get(`/packages?${query.toString()}`)
  },
  getById: (id) => api.get(`/packages/${id}`),
}

// ── Transactions ───────────────────────────────────────────
export const transactionService = {
  getByUser: (userId) => api.get(`/transactions?userId=${userId}&_sort=createdAt&_order=desc`),
  create: (data) => api.post('/transactions', data),
}

// ── Users ──────────────────────────────────────────────────
export const userService = {
  getByCredentials: (email, password) =>
    api.get(`/users?email=${email}&password=${password}`),
}

export default api

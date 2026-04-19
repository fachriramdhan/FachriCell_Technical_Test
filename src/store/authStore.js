import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dp_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('dp_user'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`)
      const users = await res.json()
      if (users.length === 0) throw new Error('Email atau password salah')
      const user = users[0]
      localStorage.setItem('dp_user', JSON.stringify(user))
      set({ user, isAuthenticated: true, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('dp_user')
    set({ user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore

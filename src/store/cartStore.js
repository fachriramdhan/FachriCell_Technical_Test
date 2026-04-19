import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  selectedPackage: null,
  isCheckingOut: false,

  selectPackage: (pkg) => set({ selectedPackage: pkg }),
  clearPackage: () => set({ selectedPackage: null }),

  setCheckingOut: (val) => set({ isCheckingOut: val }),
}))

export default useCartStore

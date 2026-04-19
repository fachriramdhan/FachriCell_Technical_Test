import { useState, useCallback, useRef } from 'react'

// Generic async hook with loading/error/data state
export function useAsync(asyncFn) {
  const [state, setState] = useState({ data: null, loading: false, error: null })
  const isMounted = useRef(true)

  const execute = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const data = await asyncFn(...args)
      if (isMounted.current) setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      if (isMounted.current) setState(s => ({ ...s, loading: false, error: err.message || 'Terjadi kesalahan' }))
      throw err
    }
  }, [asyncFn])

  return { ...state, execute }
}

// Debounce hook
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timerRef = useRef(null)

  const trigger = useCallback((newVal) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedValue(newVal), delay)
  }, [delay])

  return [debouncedValue, trigger]
}

// Prevent double-submit
export function useSubmitGuard() {
  const submitting = useRef(false)

  const guard = useCallback(async (fn) => {
    if (submitting.current) return
    submitting.current = true
    try {
      await fn()
    } finally {
      submitting.current = false
    }
  }, [])

  return guard
}

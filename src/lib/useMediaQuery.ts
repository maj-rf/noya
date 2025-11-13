import { useRef, useSyncExternalStore } from 'react'

export default function useMediaQuery(query: string) {
  const mediaQuery = useRef<MediaQueryList | null>(null)

  // Initialize mediaQuery only on client side
  if (typeof window !== 'undefined' && !mediaQuery.current) {
    mediaQuery.current = window.matchMedia(query)
  }

  return useSyncExternalStore(
    (callback) => {
      if (!mediaQuery.current) return () => {}

      mediaQuery.current.addEventListener('change', callback)
      return () => {
        mediaQuery.current?.removeEventListener('change', callback)
      }
    },
    () => mediaQuery.current?.matches ?? false,
    () => false, // Server snapshot - always false during SSR
  )
}

import { router } from 'expo-router'
import { Platform } from 'react-native'

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => unknown
}

export function navigate(href: string) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const d = document as DocWithVT
    if (typeof d.startViewTransition === 'function') {
      d.startViewTransition(() => router.push(href))
      return
    }
  }
  router.push(href)
}

export function navigateReplace(href: string) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const d = document as DocWithVT
    if (typeof d.startViewTransition === 'function') {
      d.startViewTransition(() => router.replace(href))
      return
    }
  }
  router.replace(href)
}

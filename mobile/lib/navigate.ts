import { router } from 'expo-router'
import { Platform } from 'react-native'
import { flushSync } from 'react-dom'

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => unknown
}

function withViewTransition(fn: () => void) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    fn()
    return
  }
  const d = document as DocWithVT
  if (typeof d.startViewTransition !== 'function') {
    fn()
    return
  }
  d.startViewTransition(() => {
    flushSync(fn)
  })
}

export function navigate(href: string) {
  withViewTransition(() => router.push(href))
}

export function navigateReplace(href: string) {
  withViewTransition(() => router.replace(href))
}

export function navigateBack() {
  withViewTransition(() => router.back())
}

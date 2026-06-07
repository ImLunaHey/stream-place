import { Platform } from 'react-native'

export function safeViewName(handle: string): string {
  return handle.replace(/[^a-z0-9]/gi, '-')
}

export function vtNameStyle(name: string | null): any {
  if (!name) return undefined
  if (Platform.OS !== 'web') return undefined
  return { viewTransitionName: name }
}

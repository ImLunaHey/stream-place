import type { ReactNode } from 'react'
import { Platform, useWindowDimensions, View } from 'react-native'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'

type Props = { children: ReactNode }

export function WebShell({ children }: Props) {
  const { width } = useWindowDimensions()
  const isDesktop = Platform.OS === 'web' && width >= 1024
  if (!isDesktop) return <>{children}</>
  return (
    <View className="flex-1 flex-row bg-zinc-900">
      <Sidebar />
      <View className="flex-1">
        <TopBar />
        <View className="flex-1 overflow-hidden">{children}</View>
      </View>
    </View>
  )
}

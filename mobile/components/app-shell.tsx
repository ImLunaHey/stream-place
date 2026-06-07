import { router, usePathname } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import type { ReactNode } from 'react'
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'

type Props = { children: ReactNode }

const HIDE_CHROME_ROUTES = new Set<string>(['/login'])

export function AppShell({ children }: Props) {
  const { width } = useWindowDimensions()
  const path = usePathname() ?? '/'
  const isWeb = Platform.OS === 'web'
  const isDesktop = isWeb && width >= 1024
  const hideChrome = HIDE_CHROME_ROUTES.has(path)
  const isChannel = path.startsWith('/channel/')
  const showMobileBack = !isDesktop && path !== '/' && !hideChrome

  if (hideChrome) {
    return <View className="flex-1 bg-zinc-900">{children}</View>
  }

  if (isDesktop) {
    return (
      <View className="h-screen w-screen flex-row bg-zinc-900">
        <Sidebar />
        <View className="flex-1">
          <TopBar />
          <View className="flex-1 overflow-hidden">{children}</View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-zinc-900">
      <TopBar mobile />
      {showMobileBack && !isChannel && (
        <View className="flex-row items-center gap-2 border-b border-white/5 bg-zinc-950 px-3 py-2">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1 rounded-md px-2 py-1"
          >
            <ChevronLeft size={16} color="#e4e4e7" />
            <Text className="text-sm text-zinc-200">Back</Text>
          </Pressable>
        </View>
      )}
      <View className="flex-1">{children}</View>
    </View>
  )
}

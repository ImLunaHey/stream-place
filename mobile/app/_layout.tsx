import { Slot } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppShell } from '../components/app-shell'
import '../global.css'

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#18181b' }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <AppShell>
            <Slot />
          </AppShell>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

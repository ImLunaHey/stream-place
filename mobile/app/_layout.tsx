import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#0a0a0a' },
              headerTintColor: '#f4f4f5',
              contentStyle: { backgroundColor: '#18181b' },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'stream.place' }} />
            <Stack.Screen
              name="channel/[handle]"
              options={{ title: 'Channel', headerBackTitle: 'Back' }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

import { Tabs } from 'expo-router'
import { Platform, useWindowDimensions } from 'react-native'

export default function TabsLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = Platform.OS === 'web' && width >= 1024

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: isDesktop
          ? { display: 'none' }
          : { backgroundColor: '#0a0a0a', borderTopColor: '#27272a' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#71717a',
        headerShown: !isDesktop,
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#f4f4f5',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Search', tabBarLabel: 'Search' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarLabel: 'Settings' }}
      />
    </Tabs>
  )
}

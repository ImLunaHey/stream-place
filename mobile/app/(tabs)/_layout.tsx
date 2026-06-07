import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#27272a' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#71717a',
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

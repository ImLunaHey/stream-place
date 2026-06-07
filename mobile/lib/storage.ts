import AsyncStorage from '@react-native-async-storage/async-storage'

export async function readJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function writeJson<T>(key: string, value: T | null): Promise<void> {
  if (value == null) await AsyncStorage.removeItem(key)
  else await AsyncStorage.setItem(key, JSON.stringify(value))
}

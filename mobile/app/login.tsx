import { router, Stack } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useLogin } from '../hooks/use-login'
import { useSession } from '../hooks/use-session'

export default function Login() {
  const { session } = useSession()
  const loginMut = useLogin()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const errorMsg = loginMut.error instanceof Error ? loginMut.error.message : null

  if (session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <Text className="text-zinc-200">
          Signed in as{' '}
          <Text className="font-semibold text-white">{session.handle}</Text>
        </Text>
        <Pressable
          onPress={() => router.replace('/')}
          className="mt-4 rounded-md bg-violet-500 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-white">Go home</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-zinc-900"
      contentContainerStyle={{ padding: 24 }}
    >
      <Stack.Screen options={{ title: 'Sign in' }} />
      <Text className="text-2xl font-bold text-white">Sign in with ATProto</Text>
      <Text className="mt-2 text-sm text-zinc-400">
        Enter your handle and an app password. We'll find your PDS
        automatically.
      </Text>

      <View className="mt-6 gap-4">
        <View>
          <Text className="mb-1.5 text-sm text-zinc-300">Handle or DID</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="alice.bsky.social"
            placeholderTextColor="#71717a"
            className="rounded-md bg-zinc-800 px-3 py-3 text-white"
          />
        </View>

        <View>
          <Text className="mb-1.5 text-sm text-zinc-300">App password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="xxxx-xxxx-xxxx-xxxx"
            placeholderTextColor="#71717a"
            className="rounded-md bg-zinc-800 px-3 py-3 text-white"
          />
        </View>

        {errorMsg && (
          <View className="rounded-md bg-rose-950/60 px-3 py-2">
            <Text className="text-sm text-rose-300">{errorMsg}</Text>
          </View>
        )}

        <Pressable
          onPress={() =>
            loginMut.mutate(
              { identifier: identifier.trim(), password },
              { onSuccess: () => router.replace('/') },
            )
          }
          disabled={loginMut.isPending}
          className="mt-2 flex-row items-center justify-center gap-2 rounded-md bg-violet-500 px-4 py-3"
          style={{ opacity: loginMut.isPending ? 0.6 : 1 }}
        >
          {loginMut.isPending && <ActivityIndicator color="#fff" size="small" />}
          <Text className="text-sm font-semibold text-white">
            {loginMut.isPending ? 'Signing in…' : 'Sign in'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

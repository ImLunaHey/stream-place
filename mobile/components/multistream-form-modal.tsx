import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import type {
  MultistreamTargetRecord,
  MultistreamTargetView,
} from '../queries/multistream'

const RTMP_RE = /^rtmps?:\/\/.+/i

type Props = {
  visible: boolean
  target?: MultistreamTargetView
  isLoading: boolean
  error?: string | null
  onSubmit: (record: MultistreamTargetRecord) => void
  onClose: () => void
}

export function MultistreamFormModal({
  visible,
  target,
  isLoading,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [active, setActive] = useState(true)
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return
    setUrlError(null)
    if (target) {
      setName(target.record.name ?? '')
      setUrl('')
      setActive(target.record.active)
    } else {
      setName('')
      setUrl('')
      setActive(true)
    }
  }, [visible, target])

  const submit = () => {
    if (!url.trim()) {
      setUrlError('URL is required')
      return
    }
    if (!RTMP_RE.test(url.trim())) {
      setUrlError('URL must start with rtmp:// or rtmps://')
      return
    }
    setUrlError(null)
    onSubmit({
      name: name.trim() || undefined,
      url: url.trim(),
      active,
      createdAt: target?.record.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 p-4">
        <View className="w-full max-w-md rounded-xl bg-zinc-900 p-5">
          <Text className="text-base font-bold text-white">
            {target ? 'Edit target' : 'New target'}
          </Text>

          <Text className="mt-4 mb-1.5 text-sm text-zinc-300">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="My YouTube"
            placeholderTextColor="#71717a"
            className="rounded-md bg-zinc-800 px-3 py-2 text-white"
          />

          <Text className="mt-3 mb-1.5 text-sm text-zinc-300">RTMP URL</Text>
          <TextInput
            value={url}
            onChangeText={(t) => setUrl(t.trim())}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={
              target ? '(unchanged – type to replace)' : 'rtmps://example.com/live/foo'
            }
            placeholderTextColor="#71717a"
            multiline
            className="rounded-md bg-zinc-800 px-3 py-2 font-mono text-xs text-white"
            style={{ minHeight: 56 }}
          />
          {urlError && (
            <Text className="mt-1 text-xs text-rose-300">{urlError}</Text>
          )}

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-sm text-zinc-300">Active</Text>
            <Switch value={active} onValueChange={setActive} />
          </View>

          {error && (
            <View className="mt-3 rounded-md bg-rose-950/60 px-3 py-2">
              <Text className="text-sm text-rose-300">{error}</Text>
            </View>
          )}

          <View className="mt-5 flex-row justify-end gap-2">
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              className="rounded-md bg-white/5 px-4 py-2"
            >
              <Text className="text-sm font-semibold text-zinc-200">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={isLoading}
              className="flex-row items-center gap-2 rounded-md bg-violet-500 px-4 py-2"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading && <ActivityIndicator color="#fff" size="small" />}
              <Text className="text-sm font-semibold text-white">
                {target ? 'Update' : 'Create'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

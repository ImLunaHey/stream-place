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
import type { WebhookInput } from '../hooks/use-webhooks'
import type { WebhookEvent, WebhookView } from '../queries/webhooks'

const ALL_EVENTS: WebhookEvent[] = ['chat', 'livestream', 'follow', 'mention']

type Props = {
  visible: boolean
  webhook?: WebhookView
  isLoading: boolean
  error?: string | null
  onSubmit: (input: WebhookInput) => void
  onClose: () => void
}

export function WebhookFormModal({
  visible,
  webhook,
  isLoading,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [events, setEvents] = useState<WebhookEvent[]>(['chat'])
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return
    setUrlError(null)
    if (webhook) {
      setName(webhook.name ?? '')
      setUrl(webhook.url)
      setDescription(webhook.description ?? '')
      setActive(webhook.active)
      setEvents(webhook.events)
    } else {
      setName('')
      setUrl('')
      setDescription('')
      setActive(true)
      setEvents(['chat'])
    }
  }, [visible, webhook])

  const submit = () => {
    if (!url.trim()) {
      setUrlError('URL is required')
      return
    }
    try {
      const u = new URL(url.trim())
      if (u.protocol !== 'https:' && u.protocol !== 'http:') {
        setUrlError('Must be http or https')
        return
      }
    } catch {
      setUrlError('Invalid URL')
      return
    }
    if (events.length === 0) return
    setUrlError(null)
    onSubmit({
      url: url.trim(),
      name: name.trim() || undefined,
      description: description.trim() || undefined,
      active,
      events,
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
            {webhook ? 'Edit webhook' : 'New webhook'}
          </Text>

          <Text className="mt-4 mb-1.5 text-sm text-zinc-300">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="My Discord bot"
            placeholderTextColor="#71717a"
            className="rounded-md bg-zinc-800 px-3 py-2 text-white"
          />

          <Text className="mt-3 mb-1.5 text-sm text-zinc-300">URL</Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://example.com/hook"
            placeholderTextColor="#71717a"
            className="rounded-md bg-zinc-800 px-3 py-2 font-mono text-xs text-white"
          />
          {urlError && (
            <Text className="mt-1 text-xs text-rose-300">{urlError}</Text>
          )}

          <Text className="mt-3 mb-1.5 text-sm text-zinc-300">Events</Text>
          <View className="flex-row flex-wrap gap-2">
            {ALL_EVENTS.map((e) => {
              const checked = events.includes(e)
              return (
                <Pressable
                  key={e}
                  onPress={() =>
                    setEvents((cur) =>
                      cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e],
                    )
                  }
                  className={`rounded-md px-2.5 py-1.5 ${
                    checked ? 'bg-pink-500/20' : 'bg-white/5'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      checked ? 'text-pink-100' : 'text-zinc-400'
                    }`}
                  >
                    {e}
                  </Text>
                </Pressable>
              )
            })}
          </View>

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
              disabled={isLoading || events.length === 0}
              className="flex-row items-center gap-2 rounded-md bg-pink-500 px-4 py-2"
              style={{
                opacity: isLoading || events.length === 0 ? 0.6 : 1,
              }}
            >
              {isLoading && <ActivityIndicator color="#fff" size="small" />}
              <Text className="text-sm font-semibold text-white">
                {webhook ? 'Update' : 'Create'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

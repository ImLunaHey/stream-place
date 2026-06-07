import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native'
import { WebhookFormModal } from '../../components/webhook-form-modal'
import {
  useCreateWebhook,
  useDeleteWebhook,
  useUpdateWebhook,
  useWebhooks,
  type WebhookInput,
} from '../../hooks/use-webhooks'
import { useSession } from '../../hooks/use-session'
import type { WebhookView } from '../../queries/webhooks'

export default function WebhooksSettings() {
  const { session } = useSession()
  const { data: webhooks = [], isLoading, isFetching } = useWebhooks()
  const createMut = useCreateWebhook()
  const updateMut = useUpdateWebhook()
  const deleteMut = useDeleteWebhook()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<WebhookView | undefined>(undefined)

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-sm text-zinc-400">
          Sign in to manage webhooks.
        </Text>
      </View>
    )
  }

  const confirmDelete = (w: WebhookView) => {
    Alert.alert('Delete webhook', `Delete ${w.name ?? w.url}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMut.mutate(w.id),
      },
    ])
  }

  const handleSubmit = (input: WebhookInput) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.id, ...input },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMut.mutate(input, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-zinc-900"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Webhooks</Text>
            <Text className="mt-1 text-xs text-zinc-500">
              Forward events to your own endpoints.
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setEditing(undefined)
              createMut.reset()
              setFormOpen(true)
            }}
            className="rounded-md bg-violet-500 px-3 py-2"
          >
            <Text className="text-sm font-semibold text-white">+ New</Text>
          </Pressable>
        </View>

        {(isLoading || isFetching) && (
          <View className="mt-6 flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-sm text-zinc-400">Loading…</Text>
          </View>
        )}

        {webhooks.length === 0 && !isLoading && (
          <Text className="mt-6 text-sm text-zinc-400">No webhooks yet.</Text>
        )}

        <View className="mt-4 gap-2">
          {webhooks.map((w) => (
            <View key={w.id} className="rounded-md bg-white/5 p-3">
              <View className="flex-row items-start gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white">
                    {w.name ?? new URL(w.url).host}
                  </Text>
                  <Text className="font-mono text-xs text-zinc-500">{w.url}</Text>
                  {w.events.length > 0 && (
                    <View className="mt-1.5 flex-row flex-wrap gap-1">
                      {w.events.map((e) => (
                        <Text
                          key={e}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-300"
                        >
                          {e}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <Switch
                  value={w.active}
                  onValueChange={() =>
                    updateMut.mutate({ id: w.id, active: !w.active })
                  }
                />
              </View>
              <View className="mt-2 flex-row gap-2">
                <Pressable
                  onPress={() => {
                    setEditing(w)
                    updateMut.reset()
                    setFormOpen(true)
                  }}
                  className="rounded-md bg-white/5 px-3 py-1.5"
                >
                  <Text className="text-xs text-zinc-200">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmDelete(w)}
                  className="rounded-md bg-rose-500/20 px-3 py-1.5"
                >
                  <Text className="text-xs text-rose-300">Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <WebhookFormModal
        visible={formOpen}
        webhook={editing}
        isLoading={createMut.isPending || updateMut.isPending}
        error={
          (createMut.error instanceof Error
            ? createMut.error.message
            : null) ??
          (updateMut.error instanceof Error ? updateMut.error.message : null)
        }
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />
    </>
  )
}

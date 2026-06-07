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
import { MultistreamFormModal } from '../../components/multistream-form-modal'
import {
  useCreateMultistream,
  useDeleteMultistream,
  useMultistreamTargets,
  useUpdateMultistream,
} from '../../hooks/use-multistream'
import { useSession } from '../../hooks/use-session'
import type { MultistreamTargetView } from '../../queries/multistream'

function redactUrl(url: string) {
  try {
    const u = new URL(url)
    return `${u.protocol}//${u.host}/…`
  } catch {
    return 'invalid url'
  }
}

export default function MultistreamSettings() {
  const { session } = useSession()
  const { data: targets = [], isLoading, refetch, isFetching } =
    useMultistreamTargets()
  const createMut = useCreateMultistream()
  const updateMut = useUpdateMultistream()
  const deleteMut = useDeleteMultistream()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MultistreamTargetView | undefined>(
    undefined,
  )

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-sm text-zinc-400">
          Sign in to manage multistream.
        </Text>
      </View>
    )
  }

  const toggle = (t: MultistreamTargetView) => {
    updateMut.mutate({
      uri: t.uri,
      record: { ...t.record, active: !t.record.active },
    })
  }

  const confirmDelete = (t: MultistreamTargetView) => {
    Alert.alert('Delete target', `Delete ${t.record.name ?? redactUrl(t.record.url)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMut.mutate(t.uri),
      },
    ])
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-zinc-900"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              Multistream targets
            </Text>
            <Text className="mt-1 text-xs text-zinc-500">
              Rebroadcast your stream to RTMP endpoints.
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setEditing(undefined)
              createMut.reset()
              setFormOpen(true)
            }}
            className="rounded-md bg-pink-500 px-3 py-2"
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

        {targets.length === 0 && !isLoading && (
          <Text className="mt-6 text-sm text-zinc-400">No targets yet.</Text>
        )}

        <View className="mt-4 gap-2">
          {targets.map((t) => (
            <View key={t.uri} className="rounded-md bg-white/5 p-3">
              <View className="flex-row items-start">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white">
                    {t.record.name ?? redactUrl(t.record.url).slice(7)}
                  </Text>
                  <Text className="font-mono text-xs text-zinc-500">
                    {redactUrl(t.record.url)}
                  </Text>
                </View>
                <Switch
                  value={t.record.active}
                  onValueChange={() => toggle(t)}
                />
              </View>
              <View className="mt-2 flex-row gap-2">
                <Pressable
                  onPress={() => {
                    setEditing(t)
                    updateMut.reset()
                    setFormOpen(true)
                  }}
                  className="rounded-md bg-white/5 px-3 py-1.5"
                >
                  <Text className="text-xs text-zinc-200">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmDelete(t)}
                  className="rounded-md bg-rose-500/20 px-3 py-1.5"
                >
                  <Text className="text-xs text-rose-300">Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <MultistreamFormModal
        visible={formOpen}
        target={editing}
        isLoading={createMut.isPending || updateMut.isPending}
        error={
          (createMut.error instanceof Error
            ? createMut.error.message
            : null) ??
          (updateMut.error instanceof Error ? updateMut.error.message : null)
        }
        onSubmit={(record) => {
          if (editing) {
            updateMut.mutate(
              { uri: editing.uri, record },
              { onSuccess: () => setFormOpen(false) },
            )
          } else {
            createMut.mutate(record, {
              onSuccess: () => setFormOpen(false),
            })
          }
        }}
        onClose={() => setFormOpen(false)}
      />
    </>
  )
}

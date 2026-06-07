import { createFileRoute } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { MultistreamTargetRow } from '../components/multistream/target-row'
import { MultistreamTargetForm } from '../components/multistream/target-form'
import { DeleteTargetDialog } from '../components/multistream/delete-target-dialog'
import { useMultistreamTargets } from '../hooks/use-multistream-targets'
import {
  useCreateMultistreamTarget,
  useDeleteMultistreamTarget,
  useUpdateMultistreamTarget,
} from '../hooks/use-multistream-mutations'
import { useSession } from '../hooks/use-session'
import type { MultistreamTargetView } from '../queries/multistream-targets'

export const Route = createFileRoute('/settings/multistream')({
  component: Multistream,
})

function Multistream() {
  const { session } = useSession()
  const { data: targets = [], isLoading, isFetching, refetch, error } =
    useMultistreamTargets()
  const createMut = useCreateMultistreamTarget()
  const updateMut = useUpdateMultistreamTarget()
  const deleteMut = useDeleteMultistreamTarget()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MultistreamTargetView | undefined>(
    undefined,
  )
  const [pendingDelete, setPendingDelete] = useState<
    MultistreamTargetView | undefined
  >(undefined)
  const [togglingUri, setTogglingUri] = useState<string | null>(null)

  if (!session) {
    return (
      <p className="text-sm text-zinc-400">
        Sign in to manage multistream targets.
      </p>
    )
  }

  const handleCreate = () => {
    setEditing(undefined)
    createMut.reset()
    setFormOpen(true)
  }
  const handleEdit = (t: MultistreamTargetView) => {
    setEditing(t)
    updateMut.reset()
    setFormOpen(true)
  }

  const handleFormSubmit = (record: MultistreamTargetView['record']) => {
    if (editing) {
      updateMut.mutate(
        { uri: editing.uri, record },
        {
          onSuccess: () => {
            setFormOpen(false)
            setEditing(undefined)
          },
        },
      )
    } else {
      createMut.mutate(record, {
        onSuccess: () => setFormOpen(false),
      })
    }
  }

  const handleToggle = (t: MultistreamTargetView, next: boolean) => {
    setTogglingUri(t.uri)
    updateMut.mutate(
      { uri: t.uri, record: { ...t.record, active: next } },
      { onSettled: () => setTogglingUri(null) },
    )
  }

  const handleDelete = () => {
    if (!pendingDelete) return
    deleteMut.mutate(pendingDelete.uri, {
      onSuccess: () => setPendingDelete(undefined),
    })
  }

  const formError =
    (createMut.error instanceof Error ? createMut.error.message : null) ??
    (updateMut.error instanceof Error ? updateMut.error.message : null)
  const deleteError =
    deleteMut.error instanceof Error ? deleteMut.error.message : null

  return (
    <>
      <section className="rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Multistream targets
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Rebroadcast your live stream to RTMP / RTMPS endpoints (YouTube,
              Twitch, etc.).
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-md bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-400"
            >
              <Plus className="h-4 w-4" /> New
            </button>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh"
              className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </header>

        {isLoading && (
          <p className="mt-4 text-sm text-zinc-400">Loading targets…</p>
        )}
        {error && !isLoading && (
          <p className="mt-4 text-sm text-rose-300">
            Failed to load: {(error as Error).message}
          </p>
        )}
        {!isLoading && !error && targets.length === 0 && (
          <div className="mt-4 rounded-md border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-400">
            No targets yet. Add one with the "New" button above.
          </div>
        )}
        {targets.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {targets.map((t) => (
              <MultistreamTargetRow
                key={t.uri}
                target={t}
                isToggling={togglingUri === t.uri}
                isDeleting={deleteMut.isPending && pendingDelete?.uri === t.uri}
                onEdit={() => handleEdit(t)}
                onDelete={() => {
                  deleteMut.reset()
                  setPendingDelete(t)
                }}
                onToggle={(next) => handleToggle(t, next)}
              />
            ))}
          </ul>
        )}
      </section>

      <MultistreamTargetForm
        open={formOpen}
        target={editing}
        isLoading={createMut.isPending || updateMut.isPending}
        error={formError}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <DeleteTargetDialog
        open={!!pendingDelete}
        target={pendingDelete}
        isLoading={deleteMut.isPending}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(undefined)}
      />
    </>
  )
}

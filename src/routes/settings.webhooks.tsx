import { createFileRoute } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { WebhookRow } from '../components/webhooks/webhook-row'
import { WebhookForm } from '../components/webhooks/webhook-form'
import { DeleteWebhookDialog } from '../components/webhooks/delete-webhook-dialog'
import {
  useCreateWebhook,
  useDeleteWebhook,
  useUpdateWebhook,
  type WebhookInput,
} from '../hooks/use-webhook-mutations'
import { useWebhooks } from '../hooks/use-webhooks'
import { useSession } from '../hooks/use-session'
import type { WebhookView } from '../queries/webhooks'

export const Route = createFileRoute('/settings/webhooks')({
  component: Webhooks,
})

function Webhooks() {
  const { session } = useSession()
  const { data: webhooks = [], isLoading, isFetching, refetch, error } =
    useWebhooks()
  const createMut = useCreateWebhook()
  const updateMut = useUpdateWebhook()
  const deleteMut = useDeleteWebhook()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<WebhookView | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<WebhookView | undefined>(
    undefined,
  )
  const [togglingId, setTogglingId] = useState<string | null>(null)

  if (!session) {
    return <p className="text-sm text-zinc-400">Sign in to manage webhooks.</p>
  }

  const handleCreate = () => {
    setEditing(undefined)
    createMut.reset()
    setFormOpen(true)
  }

  const handleEdit = (w: WebhookView) => {
    setEditing(w)
    updateMut.reset()
    setFormOpen(true)
  }

  const handleFormSubmit = (input: WebhookInput) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.id, ...input },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMut.mutate(input, { onSuccess: () => setFormOpen(false) })
    }
  }

  const handleToggle = (w: WebhookView, next: boolean) => {
    setTogglingId(w.id)
    updateMut.mutate(
      { id: w.id, active: next },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const handleDelete = () => {
    if (!pendingDelete) return
    deleteMut.mutate(pendingDelete.id, {
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
              Webhooks
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Forward chat, livestream, follow, and mention events to your own
              endpoints.
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

        {isLoading && <p className="mt-4 text-sm text-zinc-400">Loading…</p>}
        {error && !isLoading && (
          <p className="mt-4 text-sm text-rose-300">
            Failed to load: {(error as Error).message}
          </p>
        )}
        {!isLoading && !error && webhooks.length === 0 && (
          <div className="mt-4 rounded-md border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-400">
            No webhooks yet. Add one with the "New" button above.
          </div>
        )}
        {webhooks.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {webhooks.map((w) => (
              <WebhookRow
                key={w.id}
                webhook={w}
                isToggling={togglingId === w.id}
                isDeleting={deleteMut.isPending && pendingDelete?.id === w.id}
                onEdit={() => handleEdit(w)}
                onDelete={() => {
                  deleteMut.reset()
                  setPendingDelete(w)
                }}
                onToggle={(next) => handleToggle(w, next)}
              />
            ))}
          </ul>
        )}
      </section>

      <WebhookForm
        open={formOpen}
        webhook={editing}
        isLoading={createMut.isPending || updateMut.isPending}
        error={formError}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <DeleteWebhookDialog
        open={!!pendingDelete}
        webhook={pendingDelete}
        isLoading={deleteMut.isPending}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(undefined)}
      />
    </>
  )
}

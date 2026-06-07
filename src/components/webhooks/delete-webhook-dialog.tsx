import { Modal } from '../modal'
import type { WebhookView } from '../../queries/webhooks'

type Props = {
  open: boolean
  webhook?: WebhookView
  isLoading: boolean
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}

function titleFor(w: WebhookView): string {
  if (w.name) return w.name
  try {
    return new URL(w.url).host
  } catch {
    return 'this webhook'
  }
}

export function DeleteWebhookDialog({
  open,
  webhook,
  isLoading,
  error,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Delete webhook" size="sm">
      <p className="text-sm text-zinc-200">
        Delete <strong>{webhook ? titleFor(webhook) : ''}</strong>?
      </p>
      <p className="mt-2 text-xs text-zinc-500">This cannot be undone.</p>
      {error && (
        <p className="mt-3 rounded-md bg-rose-950/60 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/30">
          {error}
        </p>
      )}
      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-60"
        >
          {isLoading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}

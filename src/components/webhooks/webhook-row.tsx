import { Pencil, Trash2 } from 'lucide-react'
import { ToggleSwitch } from '../toggle-switch'
import { timeAgo } from '../../lib/time-ago'
import type { WebhookView } from '../../queries/webhooks'

type Props = {
  webhook: WebhookView
  isDeleting?: boolean
  isToggling?: boolean
  onEdit: () => void
  onDelete: () => void
  onToggle: (next: boolean) => void
}

function titleFor(w: WebhookView): string {
  if (w.name) return w.name
  try {
    return new URL(w.url).host
  } catch {
    return 'Untitled webhook'
  }
}

export function WebhookRow({
  webhook,
  isDeleting,
  isToggling,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  return (
    <li className="flex flex-col gap-2 rounded-md bg-zinc-900 p-3 ring-1 ring-white/5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {titleFor(webhook)}
          </p>
          <p className="truncate font-mono text-xs text-zinc-500">
            {webhook.url}
          </p>
          {webhook.events && webhook.events.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {webhook.events.map((e) => (
                <span
                  key={e}
                  className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ToggleSwitch
            checked={webhook.active}
            disabled={isToggling || isDeleting}
            onChange={onToggle}
            ariaLabel={`Toggle ${titleFor(webhook)}`}
          />
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete"
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-300 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
        <span>Created {timeAgo(webhook.createdAt)}</span>
        {webhook.lastTriggered && (
          <span>Triggered {timeAgo(webhook.lastTriggered)}</span>
        )}
        {webhook.errorCount && webhook.errorCount > 0 ? (
          <span className="text-rose-300">
            {webhook.errorCount} consecutive errors
          </span>
        ) : null}
      </div>
    </li>
  )
}

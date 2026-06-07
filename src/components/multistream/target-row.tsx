import { Pencil, Trash2 } from 'lucide-react'
import { ToggleSwitch } from '../toggle-switch'
import { redactRtmpUrl, timeAgo } from '../../lib/time-ago'
import type { MultistreamTargetView } from '../../queries/multistream-targets'

type Props = {
  target: MultistreamTargetView
  isDeleting?: boolean
  isToggling?: boolean
  onEdit: () => void
  onDelete: () => void
  onToggle: (next: boolean) => void
}

function titleFor(target: MultistreamTargetView): string {
  if (target.record.name) return target.record.name
  try {
    return new URL(target.record.url).host
  } catch {
    return 'Untitled target'
  }
}

const statusClass: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-200 ring-amber-500/30',
  inactive: 'bg-zinc-800 text-zinc-400 ring-white/5',
  error: 'bg-rose-500/20 text-rose-300 ring-rose-500/30',
}

export function MultistreamTargetRow({
  target,
  isDeleting,
  isToggling,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  const status = target.latestEvent?.status
  return (
    <li className="flex flex-col gap-3 rounded-md bg-zinc-900 p-3 ring-1 ring-white/5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {titleFor(target)}
          </p>
          <p className="truncate font-mono text-xs text-zinc-500">
            {redactRtmpUrl(target.record.url)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ToggleSwitch
            checked={target.record.active}
            disabled={isToggling || isDeleting}
            onChange={onToggle}
            ariaLabel={`Toggle ${titleFor(target)}`}
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
        <span>Created {timeAgo(target.record.createdAt)}</span>
        {status && (
          <span
            className={`rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider ring-1 ${
              statusClass[status] ?? statusClass.inactive
            }`}
          >
            {status}
          </span>
        )}
        {target.latestEvent && (
          <span>{timeAgo(target.latestEvent.createdAt)}</span>
        )}
      </div>
    </li>
  )
}

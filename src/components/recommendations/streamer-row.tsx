import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react'
import type { ResolvedProfile } from '../../lib/streamplace'

type Props = {
  did: string
  index: number
  total: number
  profile?: ResolvedProfile
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export function StreamerRow({
  did,
  index,
  total,
  profile,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) {
  const handle = profile?.handle ?? did
  const name = profile?.displayName ?? profile?.handle ?? did

  return (
    <li className="flex items-center gap-3 rounded-md bg-zinc-900 p-2 ring-1 ring-white/5">
      <GripVertical className="h-4 w-4 shrink-0 text-zinc-600" />
      <span className="w-5 shrink-0 text-center text-xs font-semibold text-zinc-500">
        {index + 1}
      </span>
      {profile?.avatar ? (
        <img
          src={profile.avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full ring-1 ring-white/10"
        />
      ) : (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold ring-1 ring-white/10">
          {(profile?.handle ?? did)[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate text-xs text-zinc-500">
          {profile ? `@${handle}` : did}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Move up"
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-300 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Move down"
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-300 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove"
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-300 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}

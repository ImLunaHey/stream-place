import type { ResolvedProfile, TypeaheadActor } from '../lib/streamplace'

type Props = {
  actor: TypeaheadActor
  profile?: ResolvedProfile
  active?: boolean
  onClick: () => void
}

export function TypeaheadRow({ actor, profile, active, onClick }: Props) {
  const name = profile?.displayName ?? actor.handle
  return (
    <li>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          onClick()
        }}
        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
          active ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
      >
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt=""
            className="h-7 w-7 shrink-0 rounded-full ring-1 ring-white/10"
            loading="lazy"
          />
        ) : (
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-800 text-[10px] font-semibold ring-1 ring-white/10">
            {actor.handle[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-zinc-400">@{actor.handle}</p>
        </div>
      </button>
    </li>
  )
}

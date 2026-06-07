import type { ResolvedProfile, TypeaheadActor } from '../../lib/streamplace'

type Props = {
  actors: TypeaheadActor[]
  profiles: Map<string, ResolvedProfile>
  activeIndex: number
  onSelect: (handle: string) => void
  loading: boolean
}

export function MentionDropdown({
  actors,
  profiles,
  activeIndex,
  onSelect,
  loading,
}: Props) {
  return (
    <div className="absolute inset-x-0 bottom-full mb-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl">
      <ol className="max-h-56 overflow-y-auto">
        {actors.map((a, i) => {
          const profile = profiles.get(a.handle)
          const name = profile?.displayName ?? a.handle
          return (
            <li key={a.did}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect(a.handle)
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition ${
                  i === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded-full ring-1 ring-white/10"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-800 text-[10px] font-semibold ring-1 ring-white/10">
                    {a.handle[0]?.toUpperCase()}
                  </div>
                )}
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-semibold text-white">{name}</span>{' '}
                  <span className="text-xs text-zinc-500">@{a.handle}</span>
                </span>
              </button>
            </li>
          )
        })}
        {actors.length === 0 && (
          <li className="px-3 py-2 text-xs text-zinc-500">
            {loading ? 'Searching…' : 'No matches'}
          </li>
        )}
      </ol>
    </div>
  )
}

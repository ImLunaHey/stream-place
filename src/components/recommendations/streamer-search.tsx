import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDebounced } from '../../hooks/use-debounced'
import { useProfilesByHandle } from '../../hooks/use-profiles-by-handle'
import { useTypeahead } from '../../hooks/use-typeahead'

type Props = {
  existingDids: string[]
  onPick: (did: string) => void
  disabled?: boolean
}

export function StreamerSearch({ existingDids, onPick, disabled }: Props) {
  const [query, setQuery] = useState('')
  const debounced = useDebounced(query, 250)
  const { data: actors = [], isFetching } = useTypeahead(debounced.trim(), 10)
  const profiles = useProfilesByHandle(
    useMemo(() => actors.map((a) => a.handle), [actors]),
  )
  const existing = useMemo(() => new Set(existingDids), [existingDids])

  return (
    <div className="rounded-md bg-zinc-900 ring-1 ring-white/5">
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="Search streamers"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
        />
      </div>

      {debounced.trim() === '' ? (
        <p className="px-3 py-3 text-xs text-zinc-500">
          Type a handle or display name to find streamers.
        </p>
      ) : isFetching ? (
        <p className="px-3 py-3 text-xs text-zinc-500">Searching…</p>
      ) : actors.length === 0 ? (
        <p className="px-3 py-3 text-xs text-zinc-500">No results.</p>
      ) : (
        <ol className="max-h-64 overflow-y-auto">
          {actors.map((a) => {
            const profile = profiles.get(a.handle)
            const added = existing.has(a.did)
            return (
              <li key={a.did}>
                <button
                  type="button"
                  disabled={added || disabled}
                  onClick={() => {
                    onPick(a.did)
                    setQuery('')
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold ring-1 ring-white/10">
                      {a.handle[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {profile?.displayName ?? a.handle}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      @{a.handle}
                    </p>
                  </div>
                  {added && (
                    <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                      Added
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

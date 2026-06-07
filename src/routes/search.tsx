import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { StreamCard } from '../components/stream-card'
import { useLiveUsers } from '../hooks/use-live-users'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'
import { useTypeahead } from '../hooks/use-typeahead'
import { liveUsersQuery } from '../queries/live-users'
import { typeaheadQuery } from '../queries/typeahead'

type SearchParams = { q: string }

export const Route = createFileRoute('/search')({
  validateSearch: (raw: Record<string, unknown>): SearchParams => ({
    q: typeof raw.q === 'string' ? raw.q : '',
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ context, deps }) => {
    void context.queryClient.ensureQueryData(liveUsersQuery(50))
    if (deps.q.trim().length > 0)
      await context.queryClient.ensureQueryData(typeaheadQuery(deps.q, 25))
  },
  component: SearchResults,
})

function SearchResults() {
  const { q } = Route.useSearch()
  const trimmed = q.trim()
  const { data: actors = [] } = useTypeahead(trimmed, 25)
  const { data: liveStreams } = useLiveUsers(50)
  const profiles = useProfilesByHandle(
    useMemo(() => actors.map((a) => a.handle), [actors]),
  )

  const lower = trimmed.toLowerCase()
  const liveMatches = useMemo(() => {
    if (!trimmed) return []
    return liveStreams.filter((s) => {
      const handle = s.author.handle.toLowerCase()
      const title = s.record.title.toLowerCase()
      const tags = s.record.tags?.join(' ').toLowerCase() ?? ''
      return (
        handle.includes(lower) || title.includes(lower) || tags.includes(lower)
      )
    })
  }, [liveStreams, trimmed, lower])

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {trimmed ? <>Results for "{trimmed}"</> : 'Search'}
        </h1>

        {!trimmed && (
          <p className="mt-3 text-sm text-zinc-400">
            Type a query in the top bar to search channels.
          </p>
        )}

        {trimmed && liveMatches.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Live now ({liveMatches.length})
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liveMatches.map((s) => (
                <StreamCard
                  key={s.uri}
                  stream={s}
                  profile={profiles.get(s.author.handle)}
                />
              ))}
            </div>
          </section>
        )}

        {trimmed && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Channels
            </h2>
            {actors.length === 0 ? (
              <p className="text-sm text-zinc-400">No channels found.</p>
            ) : (
              <ul className="divide-y divide-white/5 rounded-lg bg-white/5 ring-1 ring-white/5">
                {actors.map((a) => {
                  const p = profiles.get(a.handle)
                  return (
                    <li key={a.did}>
                      <Link
                        to="/channel/$handle"
                        params={{ handle: a.handle }}
                        viewTransition
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5"
                      >
                        {p?.avatar ? (
                          <img
                            src={p.avatar}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-full ring-1 ring-white/10"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold ring-1 ring-white/10">
                            {a.handle[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {p?.displayName ?? a.handle}
                          </p>
                          <p className="truncate text-xs text-zinc-400">
                            @{a.handle}
                          </p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

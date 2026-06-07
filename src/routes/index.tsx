import { createFileRoute } from '@tanstack/react-router'
import { StreamCard } from '../components/stream-card'
import { useLiveUsers } from '../hooks/use-live-users'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'
import { liveUsersQuery } from '../queries/live-users'
import { profilesQuery } from '../queries/profiles'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const streams = await context.queryClient.ensureQueryData(liveUsersQuery(50))
    const handles = streams.map((s) => s.author.handle)
    await context.queryClient.ensureQueryData(profilesQuery(handles))
    return streams
  },
  // viewerDid is passed at runtime in the loader's context if needed
  component: Home,
  pendingComponent: () => (
    <div className="px-6 py-10 text-sm text-zinc-400">Loading live streams…</div>
  ),
})

function Home() {
  const { data: streams } = useLiveUsers(50)
  const sortedStreams = [...streams].sort(
    (a, b) => (b.viewerCount?.count ?? 0) - (a.viewerCount?.count ?? 0),
  )
  const handles = sortedStreams.map((s) => s.author.handle)
  const profiles = useProfilesByHandle(handles)

  return (
    <div className="h-full overflow-y-auto"><div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
      <section>
        <header className="mb-4 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Live now</h1>
          <span className="text-sm text-zinc-500">{streams.length} streaming</span>
        </header>
        {sortedStreams.length === 0 ? (
          <p className="text-sm text-zinc-400">No streams live right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedStreams.map((s) => (
              <StreamCard
                key={s.uri}
                stream={s}
                profile={profiles.get(s.author.handle)}
              />
            ))}
          </div>
        )}
      </section>
    </div></div>
  )
}

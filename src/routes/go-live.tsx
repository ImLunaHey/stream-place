import { createFileRoute, Link } from '@tanstack/react-router'
import { RadioTower } from 'lucide-react'
import { StreamKeysSection } from '../components/stream-keys-section'
import { useIngestUrls } from '../hooks/use-ingest-urls'
import { useProfile } from '../hooks/use-profile'
import { useSession } from '../hooks/use-session'
import { ingestUrlsQuery } from '../queries/ingest-urls'

export const Route = createFileRoute('/go-live')({
  loader: ({ context }) => context.queryClient.ensureQueryData(ingestUrlsQuery),
  component: GoLive,
})

function GoLive() {
  const { session } = useSession()
  const { data: profile } = useProfile(session?.handle)
  const { data: ingests = [] } = useIngestUrls()

  if (!session) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          <RadioTower className="mx-auto h-12 w-12 text-zinc-500" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Sign in to go live
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Streaming requires an authenticated ATProto handle.
          </p>
          <Link
            to="/login"
            viewTransition
            className="mt-6 inline-block rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Go live</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Point your encoder at one of the stream.place ingest endpoints below
          and authenticate with a signing key.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Signed in as {profile?.displayName ?? session.handle}.
        </p>

        <StreamKeysSection did={session.did} />

        <section className="mt-6 rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Ingest endpoints
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {ingests.map((i) => (
              <li
                key={`${i.type}:${i.url}`}
                className="flex items-center gap-2 rounded-md bg-zinc-900 p-3 ring-1 ring-white/5"
              >
                <span className="rounded bg-violet-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-violet-200">
                  {i.type}
                </span>
                <code className="flex-1 truncate text-xs text-zinc-200">{i.url}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(i.url)}
                  className="rounded-md bg-white/5 px-2 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-lg bg-amber-500/10 p-5 text-sm text-amber-100 ring-1 ring-amber-500/30">
          Browser-side WebRTC (WHIP) capture isn't wired up here yet. Use OBS
          or another RTMP-capable encoder with the rtmps URL + one of your
          signing keys above.
        </section>
      </div>
    </div>
  )
}

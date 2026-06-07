import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Boundary } from '../components/boundary'
import { VideoPlayer } from '../components/video-player'
import { formatActivity, formatTags } from '../lib/format-tags'
import { formatDuration } from '../lib/format-duration'
import { useProfile } from '../hooks/use-profile'
import { useUserVideos } from '../hooks/use-user-videos'
import { profileQuery } from '../queries/profile'
import { userVideosQuery } from '../queries/user-videos'
import { videoPlaylistUrl } from '../lib/streamplace'

export const Route = createFileRoute('/vod/$handle/$rkey')({
  loader: async ({ context, params }) => {
    const profile = await context.queryClient.ensureQueryData(
      profileQuery(params.handle, null),
    )
    if (profile?.did)
      void context.queryClient.ensureQueryData(userVideosQuery(profile.did))
  },
  component: VodPage,
})

function VodPage() {
  const { handle, rkey } = Route.useParams()
  const { data: profile } = useProfile(handle)
  const did = profile?.did
  const { data: videos = [] } = useUserVideos(did)

  const video = useMemo(() => {
    const target = `at://${did}/place.stream.video/${rkey}`
    return videos.find((v) => v.uri === target)
  }, [videos, did, rkey])

  const src = did ? videoPlaylistUrl(`at://${did}/place.stream.video/${rkey}`) : null
  // biome-ignore lint: dynamic record activity shape
  const activity = formatActivity((video?.value as any)?.activity)
  const tags = formatTags(video?.value.tags)

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="border-b border-white/5 bg-zinc-950 px-3 py-2 lg:px-6">
        <Link
          to="/channel/$handle"
          params={{ handle }}
          viewTransition
          className="inline-flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" /> Back to @{handle}
        </Link>
      </div>

      <div className="shrink-0 bg-black">
        {src ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Boundary id="vod-player" title="Player crashed">
              <VideoPlayer src={src} className="h-full w-full" />
            </Boundary>
          </div>
        ) : (
          <div className="grid aspect-video place-items-center text-sm text-zinc-400">
            Loading…
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
        {video ? (
          <>
            <h1 className="text-xl font-bold tracking-tight">
              {video.value.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {profile?.displayName ?? handle}{' '}
              <span className="text-zinc-500">· @{handle}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
              <span>{formatDuration(video.value.durationMs)}</span>
              <span>·</span>
              <span>{new Date(video.value.createdAt).toLocaleDateString()}</span>
              {activity && (
                <>
                  <span>·</span>
                  <span className="text-violet-300">{activity}</span>
                </>
              )}
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t.key}
                    className="rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            )}
            {video.value.description && (
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm text-zinc-300">
                {video.value.description}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-zinc-400">Video not found.</p>
        )}
      </div>
    </div>
  )
}

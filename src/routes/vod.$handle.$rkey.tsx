import { Link, createFileRoute } from '@tanstack/react-router'
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

  const src = did
    ? videoPlaylistUrl(`at://${did}/place.stream.video/${rkey}`)
    : null
  // biome-ignore lint: dynamic record activity shape
  const activity = formatActivity((video?.value as any)?.activity)
  const tags = formatTags(video?.value.tags)

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="shrink-0 bg-black">
        {src ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Boundary id="vod-player" title="Player crashed">
              <VideoPlayer src={src} live={false} className="h-full w-full" />
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
            <Link
              to="/channel/$handle"
              params={{ handle }}
              viewTransition
              className="mt-3 flex items-center gap-3 text-sm"
            >
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full ring-1 ring-white/10"
                />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-white/10">
                  {handle[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-white hover:text-violet-300">
                  {profile?.displayName ?? handle}
                </p>
                <p className="truncate text-xs text-zinc-500">@{handle}</p>
              </div>
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
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

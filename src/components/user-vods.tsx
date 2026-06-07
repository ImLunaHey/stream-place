import { Video } from 'lucide-react'
import { useUserVideos } from '../hooks/use-user-videos'
import { VodCard } from './vod-card'

type Props = {
  handle: string
  did: string | undefined
}

export function UserVods({ handle, did }: Props) {
  const { data: videos = [], isLoading, error } = useUserVideos(did)

  if (!did) return null

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          <Video className="h-4 w-4" /> Videos
        </h2>
        <p className="text-sm text-zinc-500">Loading…</p>
      </section>
    )
  }

  if (error || videos.length === 0) return null

  return (
    <section className="mt-8">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          <Video className="h-4 w-4" /> Videos
        </h2>
        <span className="text-xs text-zinc-500">{videos.length}</span>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <VodCard key={v.uri} handle={handle} did={did} video={v} />
        ))}
      </div>
    </section>
  )
}

import { Gamepad2, Heart } from 'lucide-react'
import { useFavourites } from '../hooks/use-favourites'
import { formatActivity, formatTags } from '../lib/format-tags'
import type { LivestreamView, ResolvedProfile } from '../lib/streamplace'
import { FollowButton } from './follow-button'
import { ShareButton } from './share-button'

type Props = {
  handle: string
  stream?: LivestreamView
  profile?: ResolvedProfile
}

export function ChannelHeader({ handle, stream, profile }: Props) {
  const { toggle, isFavourite } = useFavourites()
  const fav = isFavourite(handle)

  const displayName = profile?.displayName ?? stream?.author.handle ?? handle
  const avatar = profile?.avatar
  // biome-ignore lint: dynamic field shape on record
  const activity = formatActivity((stream?.record as any)?.activity)
  const tags = formatTags(stream?.record.tags)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full ring-1 ring-white/10"
          />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-zinc-800 text-lg font-semibold ring-1 ring-white/10">
            {handle[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-xl font-bold tracking-tight">
            {stream?.record.title ?? displayName}
          </h1>
          <p className="mt-1 break-words text-sm text-zinc-300">
            <span className="font-semibold text-white">{displayName}</span>{' '}
            <span className="text-zinc-500">@{handle}</span>
          </p>
          {activity && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-violet-300">
              <Gamepad2 className="h-4 w-4" />
              <span className="font-medium">{activity}</span>
            </p>
          )}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
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
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
        {profile && <FollowButton profile={profile} />}
        <button
          onClick={() => toggle({ handle, displayName, avatar })}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ring-1 transition ${
            fav
              ? 'bg-rose-500/20 text-rose-300 ring-rose-500/40 hover:bg-rose-500/30'
              : 'bg-white/5 text-zinc-200 ring-white/10 hover:bg-white/10'
          }`}
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
          {fav ? 'Favourited' : 'Favourite'}
        </button>
        <ShareButton handle={handle} title={stream?.record.title} />
      </div>
    </div>
  )
}

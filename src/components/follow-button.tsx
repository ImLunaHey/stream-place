import { Check, UserPlus } from 'lucide-react'
import { useFollow } from '../hooks/use-follow'
import { useUnfollow } from '../hooks/use-unfollow'
import { useSession } from '../hooks/use-session'
import type { ResolvedProfile } from '../lib/streamplace'

type Props = {
  profile: ResolvedProfile
}

export function FollowButton({ profile }: Props) {
  const { session } = useSession()
  const follow = useFollow()
  const unfollow = useUnfollow()

  if (!session || session.did === profile.did) return null

  const followUri = profile.viewer?.following
  const isFollowing = !!followUri
  const pending = follow.isPending || unfollow.isPending

  const onClick = () => {
    if (isFollowing && followUri) {
      unfollow.mutate({ followUri })
    } else {
      follow.mutate({
        targetDid: profile.did,
        targetHandle: profile.handle,
        viewerDid: session.did,
      })
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ring-1 transition disabled:opacity-60 ${
        isFollowing
          ? 'bg-white/5 text-zinc-200 ring-white/10 hover:bg-rose-500/10 hover:text-rose-300 hover:ring-rose-500/40'
          : 'bg-violet-500 text-white ring-violet-500/40 hover:bg-violet-400'
      }`}
    >
      {isFollowing ? (
        <>
          <Check className="h-4 w-4" /> Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Follow
        </>
      )}
    </button>
  )
}

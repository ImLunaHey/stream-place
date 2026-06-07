import { Pressable, Text } from 'react-native'
import { useFollow, useUnfollow } from '../hooks/use-follow'
import { useSession } from '../hooks/use-session'

type ProfileWithViewer = {
  did: string
  viewer?: { following?: string }
}

export function FollowButton({ profile }: { profile: ProfileWithViewer }) {
  const { session } = useSession()
  const follow = useFollow()
  const unfollow = useUnfollow()

  if (!session || session.did === profile.did) return null

  const followUri = profile.viewer?.following
  const isFollowing = !!followUri
  const pending = follow.isPending || unfollow.isPending

  const onPress = () => {
    if (isFollowing && followUri) unfollow.mutate({ followUri })
    else follow.mutate({ targetDid: profile.did })
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={pending}
      className={`flex-row items-center gap-2 rounded-md px-3 py-2 ${
        isFollowing ? 'bg-white/5' : 'bg-violet-500'
      }`}
      style={{ opacity: pending ? 0.6 : 1 }}
    >
      <Text
        className={`text-sm font-semibold ${
          isFollowing ? 'text-zinc-200' : 'text-white'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </Pressable>
  )
}

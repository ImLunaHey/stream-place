import { useLocalSearchParams } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useMemo } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { formatDuration } from '../../../lib/format-duration'
import { videoPlaylistUrl } from '../../../lib/streamplace-extra'
import { useProfile } from '../../../hooks/use-profile'
import { useUserVideos } from '../../../hooks/use-user-videos'

export default function VodPage() {
  const { handle, rkey } = useLocalSearchParams<{ handle: string; rkey: string }>()
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
  const player = useVideoPlayer(
    src ? { uri: src, contentType: 'hls' } : null,
    () => {},
  )

  return (
    <>
      <ScrollView
        className="flex-1 bg-zinc-900"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="aspect-video w-full bg-black">
          {src ? (
            <VideoView
              player={player}
              style={{ width: '100%', height: '100%' }}
              nativeControls
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <View className="h-full items-center justify-center">
              <Text className="text-sm text-zinc-400">Loading…</Text>
            </View>
          )}
        </View>

        {video && (
          <View className="px-4 py-4">
            <Text className="text-xl font-bold text-white">
              {video.value.title}
            </Text>
            <View className="mt-3 flex-row items-center gap-3">
              {profile?.avatar ? (
                <Image
                  source={{ uri: profile.avatar }}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <View className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                  <Text className="text-sm font-semibold text-white">
                    {handle?.[0]?.toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="font-semibold text-white">
                  {profile?.displayName ?? handle}
                </Text>
                <Text className="text-xs text-zinc-500">@{handle}</Text>
              </View>
            </View>
            <Text className="mt-3 text-xs text-zinc-500">
              {formatDuration(video.value.durationMs)} ·{' '}
              {new Date(video.value.createdAt).toLocaleDateString()}
            </Text>
            {video.value.description && (
              <Text className="mt-4 text-sm text-zinc-300">
                {video.value.description}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </>
  )
}

import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { ChannelPlayer } from '../../components/channel-player'
import { ChatPanel } from '../../components/chat-panel'
import { FavouriteButton } from '../../components/favourite-button'
import { FollowButton } from '../../components/follow-button'
import { ShareButton } from '../../components/share-button'
import { UserVods } from '../../components/user-vods'
import { useChatStream } from '../../hooks/use-chat-stream'
import { useLiveUsers } from '../../hooks/use-live-users'
import { useProfile } from '../../hooks/use-profile'
import { formatTags } from '../../lib/format-tags'

type Tab = 'chat' | 'about'

export default function Channel() {
  const { handle } = useLocalSearchParams<{ handle: string }>()
  const { data: profile } = useProfile(handle)
  const { data: streams = [] } = useLiveUsers(50)
  const stream = streams.find((s) => s.author.handle === handle)
  const streamerDid = profile?.did ?? stream?.author.did
  const tags = formatTags(stream?.record.tags)
  const [tab, setTab] = useState<Tab>('chat')
  const { status: chatStatus } = useChatStream(handle)

  const { width } = useWindowDimensions()
  const isDesktop = Platform.OS === 'web' && width >= 1024

  const aboutContent = (
    <View>
      <View className="px-4 pt-4">
        <View className="flex-row gap-3">
          {profile?.avatar ? (
            <Image
              source={{ uri: profile.avatar }}
              className="h-14 w-14 shrink-0 rounded-full"
            />
          ) : (
            <View className="h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-800">
              <Text className="text-lg font-bold text-white">
                {handle[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-bold text-white" numberOfLines={2}>
              {stream?.record.title ?? profile?.displayName ?? handle}
            </Text>
            <Text className="mt-0.5 text-sm text-zinc-300">
              {profile?.displayName ?? handle}{' '}
              <Text className="text-zinc-500">@{handle}</Text>
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {profile && <FollowButton profile={profile} />}
          <FavouriteButton
            handle={handle}
            displayName={profile?.displayName}
            avatar={profile?.avatar}
          />
          <ShareButton handle={handle} title={stream?.record.title} />
        </View>

        {tags.length > 0 && (
          <View className="mt-4 flex-row flex-wrap gap-1.5">
            {tags.map((t) => (
              <View key={t} className="rounded bg-white/10 px-2 py-0.5">
                <Text className="text-xs text-zinc-300">{t}</Text>
              </View>
            ))}
          </View>
        )}

        {profile?.description && (
          <Text className="mt-4 text-sm text-zinc-300">
            {profile.description}
          </Text>
        )}
      </View>

      <UserVods handle={handle} did={streamerDid} />
    </View>
  )

  if (isDesktop) {
    return (
      <View className="flex-1 flex-row bg-zinc-900">
        <View className="flex-1">
          <ChannelPlayer handle={handle} stream={stream} />
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            {aboutContent}
          </ScrollView>
        </View>
        <View className="h-full w-80 shrink-0 border-l border-white/5 bg-zinc-950">
          <ChatPanel
            streamer={handle}
            streamerDid={streamerDid}
            status={chatStatus}
          />
        </View>
      </View>
    )
  }

  return (
    <>
      <View className="flex-1 bg-zinc-900">
        <ChannelPlayer handle={handle} stream={stream} />

        <View className="flex-row border-b border-white/5 bg-zinc-950">
          {(['chat', 'about'] as const).map((t) => {
            const active = tab === t
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                className="flex-1 items-center py-3"
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: active ? '#f472b6' : 'transparent',
                }}
              >
                <Text
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    active ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {t}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {tab === 'chat' ? (
          <ChatPanel
            streamer={handle}
            streamerDid={streamerDid}
            status={chatStatus}
          />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            {aboutContent}
          </ScrollView>
        )}
      </View>
    </>
  )
}

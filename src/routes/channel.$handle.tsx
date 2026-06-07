import { createFileRoute } from '@tanstack/react-router'
import { PanelRightOpen } from 'lucide-react'
import { useState } from 'react'
import { Boundary } from '../components/boundary'
import { ChannelHeader } from '../components/channel-header'
import { ChannelPlayer } from '../components/channel-player'
import { ChannelTopStrip } from '../components/channel-top-strip'
import { ChatPanel } from '../components/chat/chat-panel'
import { UserVods } from '../components/user-vods'
import {
  MobileChannelTabs,
  type MobileTab,
} from '../components/mobile-channel-tabs'
import { useChatStream } from '../hooks/use-chat-stream'
import { useLiveUsers } from '../hooks/use-live-users'
import { useProfile } from '../hooks/use-profile'
import { liveUsersQuery } from '../queries/live-users'
import { profileQuery } from '../queries/profile'
import { globalEmotesQuery } from '../queries/emotes'

export const Route = createFileRoute('/channel/$handle')({
  loader: ({ context, params }) => {
    void context.queryClient.ensureQueryData(profileQuery(params.handle, null))
    void context.queryClient.ensureQueryData(globalEmotesQuery)
    return context.queryClient.ensureQueryData(liveUsersQuery(50))
  },
  component: Channel,
})

function Channel() {
  const { handle } = Route.useParams()
  const { data: profile } = useProfile(handle)
  const { data: liveStreams } = useLiveUsers(50)
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat')
  const [chatHidden, setChatHidden] = useState(false)

  const stream = liveStreams.find((s) => s.author.handle === handle)
  const streamerDid = profile?.did ?? stream?.author.did

  const { status: chatStatus } = useChatStream(handle)

  const aboutContent = (
    <>
      <ChannelHeader handle={handle} stream={stream} profile={profile} />
      {profile?.description && (
        <p className="mt-4 max-w-3xl whitespace-pre-line text-sm text-zinc-400">
          {profile.description}
        </p>
      )}
      <UserVods handle={handle} did={profile?.did} />
    </>
  )

  return (
    <div className="flex h-full min-h-0 w-full flex-col lg:flex-row">
      <ChannelTopStrip
        handle={handle}
        stream={stream}
        profile={profile}
        className="lg:hidden"
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 bg-black">
          <Boundary id="channel-player" title="Player crashed">
            <ChannelPlayer
              handle={handle}
              stream={stream}
              profile={profile}
            />
          </Boundary>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:hidden">
          <MobileChannelTabs active={mobileTab} onChange={setMobileTab} />
          <div
            className={`flex min-h-0 flex-1 flex-col ${
              mobileTab === 'chat' ? '' : 'hidden'
            }`}
          >
            <Boundary id="chat-panel-mobile" title="Chat crashed" compact>
              <ChatPanel
                streamer={handle}
                streamerDid={streamerDid}
                status={chatStatus}
                showHeader={false}
                className="flex-1"
              />
            </Boundary>
          </div>
          <div
            className={`flex-1 overflow-y-auto px-3 py-2 ${
              mobileTab === 'about' ? '' : 'hidden'
            }`}
          >
            {aboutContent}
          </div>
        </div>

        <div className="hidden min-h-0 flex-1 flex-col overflow-y-auto lg:flex">
          <div className="mx-auto w-full max-w-6xl px-6 py-3">
            {aboutContent}
          </div>
        </div>
      </div>

      <Boundary id="chat-panel" title="Chat crashed" compact>
        <ChatPanel
          streamer={handle}
          streamerDid={streamerDid}
          status={chatStatus}
          onHide={() => setChatHidden(true)}
          className={`hidden h-full w-80 shrink-0 border-l border-white/5 lg:flex ${
            chatHidden ? 'lg:!hidden' : ''
          }`}
        />
      </Boundary>

      {chatHidden && (
        <button
          type="button"
          onClick={() => setChatHidden(false)}
          aria-label="Show chat"
          className="fixed bottom-4 right-4 z-30 hidden items-center gap-2 rounded-md bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 backdrop-blur hover:bg-zinc-800 lg:flex"
        >
          <PanelRightOpen className="h-4 w-4" /> Chat
        </button>
      )}
    </div>
  )
}

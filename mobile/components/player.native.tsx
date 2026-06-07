import { useVideoPlayer, VideoView } from 'expo-video'
import { View } from 'react-native'

type Props = {
  src: string | null
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  live?: boolean
}

export function Player({ src, autoPlay = true, muted = true, live = true }: Props) {
  const player = useVideoPlayer(
    src ? { uri: src, contentType: 'hls' } : null,
    (p) => {
      if (src && autoPlay) p.play()
      if (src && muted !== undefined) p.muted = muted
    },
  )

  if (!src) return <View style={{ width: '100%', height: '100%' }} />

  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      nativeControls
      allowsFullscreen
      allowsPictureInPicture
    />
  )
}

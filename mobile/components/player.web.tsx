import Hls from 'hls.js'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'

type Props = {
  src: string | null
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  live?: boolean
}

export function Player({
  src,
  poster,
  autoPlay = true,
  muted = true,
  live = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    let hls: Hls | null = null
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    } else if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: live,
        liveSyncDurationCount: live ? 3 : 6,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
    } else {
      video.src = src
    }

    return () => {
      hls?.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [src, live])

  if (!src) return <View style={{ width: '100%', height: '100%' }} />

  return (
    <View style={{ width: '100%', height: '100%' }}>
      {/* @ts-expect-error HTML video element on web */}
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        controls
        poster={poster}
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      />
    </View>
  )
}

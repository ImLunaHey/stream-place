export type EmoteSource = 'bttv' | 'ffz' | '7tv'

export type Emote = {
  source: EmoteSource
  id: string
  code: string
  url: string
  width?: number
  height?: number
  zeroWidth?: boolean
}

export type EmoteMap = Map<string, Emote>

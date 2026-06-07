import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  handle: string
  title?: string
}

export function ShareButton({ handle, title }: Props) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    const url =
      typeof window === 'undefined'
        ? `https://stream.place/channel/${handle}`
        : `${window.location.origin}/channel/${handle}`
    const shareText = title ?? `Watch @${handle}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareText, url })
        return
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Share channel"
      className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" /> Copied
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" /> Share
        </>
      )}
    </button>
  )
}

import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

type Props = {
  value: string
  label?: string
}

export function SecretField({ value, label = 'Stream key' }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 ring-1 ring-white/5 focus-within:ring-violet-400/60">
        <input
          type={revealed ? 'text' : 'password'}
          value={value}
          readOnly
          aria-label={label}
          className="flex-1 truncate bg-transparent px-1 py-1 font-mono text-xs text-zinc-200 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? 'Hide stream key' : 'Show stream key'}
          className="grid h-7 w-7 shrink-0 place-items-center rounded text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          {revealed ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  )
}

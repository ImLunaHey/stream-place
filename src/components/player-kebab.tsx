import { EllipsisVertical, Flag, UserX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onReportStream: () => void
  onReportUser: () => void
}

export function PlayerKebab({ onReportStream, onReportUser }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Player settings"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/10"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onReportStream()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
          >
            <Flag className="h-4 w-4" /> Report livestream
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onReportUser()
            }}
            className="flex w-full items-center gap-2 border-t border-white/5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
          >
            <UserX className="h-4 w-4" /> Report user
          </button>
        </div>
      )}
    </div>
  )
}

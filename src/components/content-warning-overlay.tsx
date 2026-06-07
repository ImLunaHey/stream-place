import { AlertTriangle } from 'lucide-react'
import { warningLabel } from '../lib/content-warnings'

type Props = {
  warnings: string[]
  onAccept: () => void
}

export function ContentWarningOverlay({ warnings, onAccept }: Props) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/90 backdrop-blur">
      <div className="mx-4 max-w-md rounded-xl bg-zinc-900 p-6 text-center ring-1 ring-amber-500/40">
        <div className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-amber-500/20 text-amber-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-white">Content warning</h2>
        <p className="mt-1 text-sm text-zinc-300">
          This stream contains content some viewers may find distressing or
          offensive.
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {warnings.map((w) => (
            <li
              key={w}
              className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-500/30"
            >
              {warningLabel(w)}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onAccept}
          className="mt-5 w-full rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
        >
          OK, show stream
        </button>
      </div>
    </div>
  )
}

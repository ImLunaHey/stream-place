import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = {
  error: Error
  reset?: () => void
  title?: string
  compact?: boolean
}

export function ErrorFallback({ error, reset, title, compact }: Props) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-950/40 text-rose-100 ${
        compact ? 'p-4' : 'm-6 p-6'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2 text-rose-300">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-semibold">
          {title ?? 'Something went wrong'}
        </span>
      </div>
      <pre className="max-w-full overflow-auto whitespace-pre-wrap break-words text-xs text-rose-200/80">
        {error.message}
      </pre>
      {reset && (
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 ring-1 ring-rose-500/40 hover:bg-rose-500/30"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      )}
    </div>
  )
}

type Props = {
  behindLive: boolean
  lagSeconds: number
  onGoLive: () => void
}

export function LiveIndicator({ behindLive, lagSeconds, onGoLive }: Props) {
  if (behindLive) {
    return (
      <button
        onClick={onGoLive}
        type="button"
        className="flex items-center gap-1.5 rounded bg-zinc-700/80 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-200 ring-1 ring-white/10 hover:bg-zinc-600"
        title="Go to live edge"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        <span>-{Math.round(lagSeconds)}s · Go live</span>
      </button>
    )
  }
  return (
    <div className="flex items-center gap-1.5 rounded bg-rose-600 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      Live
    </div>
  )
}

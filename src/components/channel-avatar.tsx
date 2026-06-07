import { Link } from '@tanstack/react-router'

type Props = {
  handle: string
  displayName?: string
  avatar?: string
  active?: boolean
  live?: boolean
}

export function ChannelAvatar({
  handle,
  displayName,
  avatar,
  active,
  live,
}: Props) {
  const label = displayName ?? handle
  const initial = (label[0] ?? '?').toUpperCase()
  const ring = live
    ? 'ring-2 ring-rose-500'
    : active
    ? 'ring-2 ring-violet-400'
    : 'ring-1 ring-white/5 hover:ring-violet-400/60'

  return (
    <Link
      to="/channel/$handle"
      params={{ handle }}
      viewTransition
      title={live ? `${label} — live` : label}
      aria-label={live ? `${label} (live)` : label}
      className={`group relative flex h-11 w-11 items-center justify-center overflow-visible rounded-xl bg-zinc-800 text-sm font-semibold text-white transition ${ring}`}
    >
      {active && (
        <span className="absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-violet-400" />
      )}
      <span className="block h-full w-full overflow-hidden rounded-[10px]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center">
            {initial}
          </span>
        )}
      </span>
      {live && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-rose-600 px-1 py-px text-[8px] font-black uppercase tracking-wider leading-none text-white">
          Live
        </span>
      )}
    </Link>
  )
}

import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type Props = {
  to: string
  label: string
  active?: boolean
  children: ReactNode
}

export function IconButton({ to, label, active, children }: Props) {
  return (
    <Link
      to={to}
      viewTransition
      title={label}
      aria-label={label}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
        active
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {active && (
        <span className="absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-violet-400" />
      )}
      {children}
    </Link>
  )
}

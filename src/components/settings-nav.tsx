import { Link, useRouterState } from '@tanstack/react-router'
import { Heart, Share2, Sparkles, User, Webhook } from 'lucide-react'

const items = [
  { to: '/settings', label: 'Account', icon: User, exact: true },
  { to: '/settings/profile', label: 'Profile', icon: User, exact: false },
  {
    to: '/settings/multistream',
    label: 'Multistream',
    icon: Share2,
    exact: false,
  },
  { to: '/settings/webhooks', label: 'Webhooks', icon: Webhook, exact: false },
  {
    to: '/settings/recommendations',
    label: 'Recommends',
    icon: Sparkles,
    exact: false,
  },
  { to: '/settings/favourites', label: 'Favourites', icon: Heart, exact: false },
] as const

export function SettingsNav() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  return (
    <nav className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1 ring-1 ring-white/5">
      {items.map((it) => {
        const active = it.exact ? path === it.to : path.startsWith(it.to)
        return (
          <Link
            key={it.to}
            to={it.to}
            viewTransition
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
            }`}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        )
      })}
    </nav>
  )
}

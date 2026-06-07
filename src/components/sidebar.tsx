import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { Home, Settings, HelpCircle, LogIn, RadioTower } from 'lucide-react'
import { useMemo } from 'react'
import { useFavourites } from '../hooks/use-favourites'
import { useSession } from '../hooks/use-session'
import { liveUsersQuery } from '../queries/live-users'
import { IconButton } from './icon-button'
import { ChannelAvatar } from './channel-avatar'

type Props = {
  className?: string
}

export function Sidebar({ className }: Props) {
  const { favourites } = useFavourites()
  const { session } = useSession()
  const path = useRouterState({ select: (s) => s.location.pathname })
  const { data: live = [] } = useQuery(liveUsersQuery(50))

  const liveHandles = useMemo(
    () => new Set(live.map((s) => s.author.handle)),
    [live],
  )

  const sortedFavourites = useMemo(() => {
    const liveOnes = favourites.filter((f) => liveHandles.has(f.handle))
    const offlineOnes = favourites.filter((f) => !liveHandles.has(f.handle))
    return { liveOnes, offlineOnes }
  }, [favourites, liveHandles])

  return (
    <aside
      className={`h-screen w-16 shrink-0 flex-col items-center gap-2 border-r border-white/5 bg-zinc-950 py-3 ${
        className ?? 'flex'
      }`}
    >
      <IconButton to="/" label="Home" active={path === '/'}>
        <Home className="h-5 w-5" />
      </IconButton>

      {favourites.length > 0 && <div className="my-2 h-px w-8 bg-white/10" />}

      <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto px-0.5 pt-1">
        {sortedFavourites.liveOnes.map((f) => (
          <ChannelAvatar
            key={f.handle}
            handle={f.handle}
            displayName={f.displayName}
            avatar={f.avatar}
            active={path === `/channel/${f.handle}`}
            live
          />
        ))}
        {sortedFavourites.liveOnes.length > 0 &&
          sortedFavourites.offlineOnes.length > 0 && (
            <div className="my-1 h-px w-6 bg-white/5" />
          )}
        {sortedFavourites.offlineOnes.map((f) => (
          <ChannelAvatar
            key={f.handle}
            handle={f.handle}
            displayName={f.displayName}
            avatar={f.avatar}
            active={path === `/channel/${f.handle}`}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        {session && (
          <IconButton to="/go-live" label="Go live" active={path === '/go-live'}>
            <RadioTower className="h-5 w-5" />
          </IconButton>
        )}
        {session ? (
          <IconButton
            to="/settings"
            label="Settings"
            active={path.startsWith('/settings')}
          >
            <Settings className="h-5 w-5" />
          </IconButton>
        ) : (
          <IconButton to="/login" label="Log in" active={path === '/login'}>
            <LogIn className="h-5 w-5" />
          </IconButton>
        )}
        <a
          href="https://stream.place/docs"
          target="_blank"
          rel="noreferrer"
          title="Docs"
          aria-label="Docs"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <HelpCircle className="h-5 w-5" />
        </a>
      </div>
    </aside>
  )
}

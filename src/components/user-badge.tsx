import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLogout } from '../hooks/use-logout'
import { useProfile } from '../hooks/use-profile'
import { useSession } from '../hooks/use-session'

export function UserBadge() {
  const { session } = useSession()
  const { data: profile } = useProfile(session?.handle)
  const logoutMut = useLogout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
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

  if (!session) {
    return (
      <Link
        to="/login"
        viewTransition
        className="rounded-md bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-400"
      >
        Log in
      </Link>
    )
  }

  return (
    <div ref={menuRef} className="relative flex items-center gap-1">
      <Link
        to="/channel/$handle"
        params={{ handle: session.handle }}
        viewTransition
        aria-label="Open your profile"
        className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/10 transition hover:ring-violet-400"
      >
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center bg-violet-500/30 text-xs font-semibold text-violet-100">
            {session.handle[0]?.toUpperCase()}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hidden items-center gap-1 rounded-md px-2 py-1 text-zinc-300 hover:bg-white/5 sm:flex"
      >
        <span className="max-w-[140px] truncate">
          {profile?.displayName ?? session.handle}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="grid h-7 w-7 place-items-center rounded-md text-zinc-300 hover:bg-white/5 sm:hidden"
      >
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl"
        >
          <div className="border-b border-white/5 px-3 py-2 text-xs text-zinc-500">
            Signed in as{' '}
            <span className="text-zinc-300">@{session.handle}</span>
          </div>
          <Link
            to="/settings"
            viewTransition
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              logoutMut.mutate(undefined, {
                onSuccess: () => navigate({ to: '/' }),
              })
            }}
            className="flex w-full items-center gap-2 border-t border-white/5 px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}

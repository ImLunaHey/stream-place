import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useSession } from '../hooks/use-session'
import { useLogout } from '../hooks/use-logout'

export const Route = createFileRoute('/settings/')({ component: AccountIndex })

function AccountIndex() {
  const { session } = useSession()
  const logoutMut = useLogout()
  const navigate = useNavigate()

  return (
    <section className="rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Account
      </h2>
      {session ? (
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-semibold">{session.handle}</p>
            <p className="truncate text-xs text-zinc-500">{session.did}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">
              PDS: {session.service}
            </p>
          </div>
          <button
            onClick={() =>
              logoutMut.mutate(undefined, {
                onSuccess: () => navigate({ to: '/' }),
              })
            }
            className="flex shrink-0 items-center gap-2 rounded-md bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-300 ring-1 ring-rose-500/40 hover:bg-rose-500/30"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">Not signed in.</p>
      )}
    </section>
  )
}

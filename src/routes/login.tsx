import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useSession } from '../hooks/use-session'
import { useLogin } from '../hooks/use-login'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  const { session } = useSession()
  const navigate = useNavigate()
  const loginMut = useLogin()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  if (session) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-zinc-300">
            Signed in as{' '}
            <span className="font-semibold text-white">{session.handle}</span>.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-4 rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Go home
          </button>
        </div>
      </div>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMut.mutate(
      { identifier: identifier.trim(), password },
      { onSuccess: () => navigate({ to: '/' }) },
    )
  }

  const errorMsg = loginMut.error instanceof Error ? loginMut.error.message : null

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Sign in with ATProto</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your handle and an{' '}
          <a
            href="https://bsky.app/settings/app-passwords"
            target="_blank"
            rel="noreferrer"
            className="text-violet-400 underline-offset-2 hover:underline"
          >
            app password
          </a>
          . We'll find your PDS automatically and send your password only
          there.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-zinc-300">Handle or DID</span>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="alice.bsky.social"
              autoComplete="username"
              className="rounded-md bg-zinc-800 px-3 py-2 text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-zinc-300">App password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              autoComplete="current-password"
              className="rounded-md bg-zinc-800 px-3 py-2 text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
            />
          </label>

          {errorMsg && (
            <p className="rounded-md bg-rose-950/60 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/30">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMut.isPending}
            className="mt-2 rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
          >
            {loginMut.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

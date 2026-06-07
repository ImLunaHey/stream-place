import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '../hooks/use-session'
import { useProfile } from '../hooks/use-profile'

export const Route = createFileRoute('/settings/profile')({ component: Profile })

function Profile() {
  const { session } = useSession()
  const { data: profile } = useProfile(session?.handle)

  if (!session) {
    return (
      <p className="text-sm text-zinc-400">Sign in to manage your profile.</p>
    )
  }

  return (
    <section className="rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Bluesky profile
      </h2>
      <div className="mt-4 flex items-start gap-4">
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full ring-1 ring-white/10"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-500/30 text-lg font-bold text-violet-100 ring-1 ring-white/10">
            {session.handle[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold">
            {profile?.displayName ?? session.handle}
          </p>
          <p className="text-xs text-zinc-500">@{session.handle}</p>
          {profile?.description && (
            <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">
              {profile.description}
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        Your display name, bio, and avatar come from your Bluesky profile.
        Edit them at{' '}
        <a
          href="https://bsky.app/settings/profile"
          target="_blank"
          rel="noreferrer"
          className="text-violet-400 hover:underline"
        >
          bsky.app
        </a>{' '}
        — changes sync back here automatically.
      </p>
    </section>
  )
}

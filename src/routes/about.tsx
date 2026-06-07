import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <div className="h-full overflow-y-auto"><div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">About stream.place</h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-300">
        A decentralized livestreaming front-end built on ATProto. Sign in with
        your handle + an app password — the same one you use for Bluesky.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        This is a fresh scaffold. Stream playback, chat, and the live data
        pipeline aren't wired up yet — what's here is the shell.
      </p>
    </div></div>
  )
}

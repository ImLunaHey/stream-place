import { createFileRoute } from '@tanstack/react-router'
import { useFavourites } from '../hooks/use-favourites'

export const Route = createFileRoute('/settings/favourites')({
  component: Favourites,
})

function Favourites() {
  const { favourites, toggle } = useFavourites()
  return (
    <section className="rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Favourite channels
      </h2>
      {favourites.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-400">
          No favourites yet. Open a channel and tap the heart to add it.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-white/5">
          {favourites.map((f) => (
            <li key={f.handle} className="flex items-center gap-3 py-2">
              {f.avatar && (
                <img src={f.avatar} alt="" className="h-8 w-8 rounded-full" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {f.displayName ?? f.handle}
                </p>
                <p className="truncate text-xs text-zinc-500">@{f.handle}</p>
              </div>
              <button
                onClick={() => toggle(f)}
                className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

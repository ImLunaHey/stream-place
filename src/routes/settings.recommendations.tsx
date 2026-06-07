import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ManualDidInput } from '../components/recommendations/manual-did-input'
import { StreamerRow } from '../components/recommendations/streamer-row'
import { StreamerSearch } from '../components/recommendations/streamer-search'
import { Modal } from '../components/modal'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'
import {
  useRecommendations,
  useSaveRecommendations,
} from '../hooks/use-recommendations'
import { useSession } from '../hooks/use-session'

export const Route = createFileRoute('/settings/recommendations')({
  component: Recommendations,
})

const MAX = 8

function Recommendations() {
  const { session } = useSession()
  const { data, isLoading, isFetching, refetch, error } = useRecommendations()
  const saveMut = useSaveRecommendations()
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  )

  const streamers = data?.streamers ?? []
  const profilesMap = useProfilesByHandle(streamers)
  const profileByDid = useMemo(() => {
    const m = new Map<string, ReturnType<typeof profilesMap.get>>()
    for (const p of profilesMap.values()) m.set(p.did, p)
    return m
  }, [profilesMap])

  if (!session) {
    return (
      <p className="text-sm text-zinc-400">
        Sign in to manage recommendations.
      </p>
    )
  }

  const save = (next: string[]) => saveMut.mutate(next)

  const addStreamer = (did: string) => {
    if (streamers.length >= MAX) return
    if (streamers.includes(did)) return
    save([...streamers, did])
  }

  const moveUp = (i: number) => {
    if (i <= 0) return
    const next = [...streamers]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    save(next)
  }
  const moveDown = (i: number) => {
    if (i >= streamers.length - 1) return
    const next = [...streamers]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    save(next)
  }
  const remove = (i: number) => {
    save(streamers.filter((_, idx) => idx !== i))
  }

  const atMax = streamers.length >= MAX
  const saveError =
    saveMut.error instanceof Error ? saveMut.error.message : null

  return (
    <>
      <section className="rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              <Sparkles className="h-4 w-4" /> Recommended to others
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Up to {MAX} channels you'd like to surface as recommendations.
              Drag-friendly order via the up/down arrows. Saves to your{' '}
              <code className="rounded bg-zinc-900 px-1 py-0.5 text-[11px] text-zinc-300">
                place.stream.live.recommendations
              </code>{' '}
              record.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh"
            className="grid h-8 w-8 shrink-0 place-items-center self-end rounded-md bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50 sm:self-start"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </button>
        </header>

        {!atMax && (
          <div className="mt-4">
            <StreamerSearch
              existingDids={streamers}
              onPick={addStreamer}
              disabled={saveMut.isPending}
            />
          </div>
        )}

        {isLoading && (
          <p className="mt-4 text-sm text-zinc-400">Loading…</p>
        )}
        {error && !isLoading && (
          <p className="mt-4 text-sm text-rose-300">
            Failed to load: {(error as Error).message}
          </p>
        )}

        {!isLoading && streamers.length === 0 && (
          <p className="mt-4 text-sm text-zinc-400">
            No recommendations yet. Search above or add a DID manually below.
          </p>
        )}

        {streamers.length > 0 && (
          <ol className="mt-4 flex flex-col gap-2">
            {streamers.map((did, i) => (
              <StreamerRow
                key={did + i}
                did={did}
                index={i}
                total={streamers.length}
                profile={profileByDid.get(did)}
                onMoveUp={() => moveUp(i)}
                onMoveDown={() => moveDown(i)}
                onDelete={() => setPendingDeleteIndex(i)}
              />
            ))}
          </ol>
        )}

        <div className="mt-4">
          <ManualDidInput onAdd={addStreamer} disabled={atMax || saveMut.isPending} />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>
            {streamers.length} / {MAX} used
          </span>
          {saveMut.isPending && <span>Saving…</span>}
          {saveError && (
            <span className="text-rose-300">Error: {saveError}</span>
          )}
        </div>
      </section>

      <Modal
        open={pendingDeleteIndex !== null}
        onClose={() => setPendingDeleteIndex(null)}
        title="Remove recommendation"
        size="sm"
      >
        <p className="text-sm text-zinc-200">
          Remove this streamer from your recommendations?
        </p>
        <p className="mt-2 text-xs text-zinc-500">This cannot be undone.</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPendingDeleteIndex(null)}
            className="rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (pendingDeleteIndex !== null) remove(pendingDeleteIndex)
              setPendingDeleteIndex(null)
            }}
            className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
          >
            Remove
          </button>
        </div>
      </Modal>
    </>
  )
}

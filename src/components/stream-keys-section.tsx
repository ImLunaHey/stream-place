import { Key } from 'lucide-react'
import { SecretField } from './secret-field'
import { useStreamKeys } from '../hooks/use-stream-keys'

type Props = {
  did: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export function StreamKeysSection({ did }: Props) {
  const { data: keys = [], isLoading, error } = useStreamKeys(did)

  return (
    <section className="mt-6 rounded-lg bg-white/5 p-5 ring-1 ring-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Stream keys
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        One signing key per encoder, stored as{' '}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-[11px] text-zinc-300">
          place.stream.key
        </code>{' '}
        records on your PDS.
      </p>

      {isLoading && (
        <p className="mt-4 text-sm text-zinc-400">Loading keys…</p>
      )}
      {error && (
        <p className="mt-4 text-sm text-rose-300">
          Failed to load: {(error as Error).message}
        </p>
      )}
      {!isLoading && !error && keys.length === 0 && (
        <p className="mt-4 text-sm text-zinc-400">
          No stream keys yet. Generate one in the official stream.place client.
        </p>
      )}
      {keys.length > 0 && (
        <ul className="mt-4 flex flex-col gap-4">
          {keys.map((k) => (
            <li
              key={k.uri}
              className="rounded-md bg-zinc-900 p-3 ring-1 ring-white/5"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                <Key className="h-3.5 w-3.5" />
                <span>
                  {k.value.createdBy ?? 'unknown client'} ·{' '}
                  {formatDate(k.value.createdAt)}
                </span>
              </div>
              <SecretField value={k.value.signingKey} label="Signing key" />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

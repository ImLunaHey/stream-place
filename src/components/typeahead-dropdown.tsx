import { Search } from 'lucide-react'
import type { ResolvedProfile, TypeaheadActor } from '../lib/streamplace'
import { TypeaheadRow } from './typeahead-row'

type Props = {
  query: string
  loading: boolean
  actors: TypeaheadActor[]
  profiles: Map<string, ResolvedProfile>
  activeIndex: number
  onSelectActor: (handle: string) => void
  onSelectAll: (query: string) => void
}

export function TypeaheadDropdown({
  query,
  loading,
  actors,
  profiles,
  activeIndex,
  onSelectActor,
  onSelectAll,
}: Props) {
  return (
    <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl">
      <ol className="max-h-72 overflow-y-auto">
        {actors.map((a, i) => (
          <TypeaheadRow
            key={a.did}
            actor={a}
            profile={profiles.get(a.handle)}
            active={i === activeIndex}
            onClick={() => onSelectActor(a.handle)}
          />
        ))}
        {actors.length === 0 && (
          <li className="px-3 py-3 text-xs text-zinc-500">
            {loading ? 'Searching…' : 'No matches.'}
          </li>
        )}
      </ol>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          onSelectAll(query)
        }}
        className={`flex w-full items-center gap-2 border-t border-white/5 px-3 py-2 text-left text-xs font-semibold transition ${
          activeIndex === actors.length
            ? 'bg-white/10 text-white'
            : 'text-zinc-300 hover:bg-white/5'
        }`}
      >
        <Search className="h-3.5 w-3.5" />
        See all results for "{query}"
      </button>
    </div>
  )
}

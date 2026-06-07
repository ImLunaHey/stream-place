import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useDebounced } from '../hooks/use-debounced'
import { useTypeahead } from '../hooks/use-typeahead'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'
import { TypeaheadDropdown } from './typeahead-dropdown'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const debouncedQuery = useDebounced(query, 200)
  const trimmed = debouncedQuery.trim()
  const { data: actors = [], isFetching } = useTypeahead(trimmed, 6)
  const profiles = useProfilesByHandle(
    useMemo(() => actors.map((a) => a.handle), [actors]),
  )

  const open = focused && query.trim().length > 0

  const reset = () => {
    setQuery('')
    setActiveIndex(0)
  }

  const goToChannel = (handle: string) => {
    reset()
    void navigate({ to: '/channel/$handle', params: { handle } })
  }

  const goToAll = (q: string) => {
    reset()
    void navigate({ to: '/search', search: { q } })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    const total = actors.length + 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % total)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + total) % total)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex < actors.length) goToChannel(actors[activeIndex].handle)
      else goToAll(query.trim())
    } else if (e.key === 'Escape') {
      reset()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative hidden max-w-md flex-1 sm:ml-4 sm:block"
    >
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-300 ring-1 ring-white/5 focus-within:ring-violet-400/60">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          placeholder="Search channels"
          className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>
      {open && (
        <TypeaheadDropdown
          query={query.trim()}
          loading={isFetching}
          actors={actors}
          profiles={profiles}
          activeIndex={activeIndex}
          onSelectActor={goToChannel}
          onSelectAll={goToAll}
        />
      )}
    </div>
  )
}

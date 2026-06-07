import { BrandMark } from './brand-mark'
import { SearchBar } from './search-bar'
import { UserBadge } from './user-badge'

type Props = {
  className?: string
}

export function TopBar({ className }: Props) {
  return (
    <header
      className={`relative z-30 h-14 shrink-0 items-center gap-3 border-b border-white/5 bg-zinc-950/60 px-3 backdrop-blur sm:gap-4 sm:px-6 ${
        className ?? 'flex'
      }`}
    >
      <BrandMark />
      <SearchBar />
      <div className="ml-auto flex items-center gap-3 text-sm">
        <UserBadge />
      </div>
    </header>
  )
}

import { Info, MessageSquare } from 'lucide-react'

export type MobileTab = 'chat' | 'about'

type Props = {
  active: MobileTab
  onChange: (tab: MobileTab) => void
}

const tabs: Array<{ id: MobileTab; label: string; icon: typeof Info }> = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'about', label: 'About', icon: Info },
]

export function MobileChannelTabs({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="flex shrink-0 border-b border-white/5 bg-zinc-950"
    >
      {tabs.map((t) => {
        const Icon = t.icon
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition ${
              isActive
                ? 'border-b-2 border-violet-400 text-white'
                : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

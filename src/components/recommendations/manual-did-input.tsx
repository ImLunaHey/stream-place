import { Check, Plus, X } from 'lucide-react'
import { useState } from 'react'

type Props = {
  onAdd: (did: string) => void
  disabled?: boolean
}

export function ManualDidInput({ onAdd, disabled }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setEditing(false)
    setValue('')
    setError(null)
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('DID is required')
      return
    }
    if (!trimmed.startsWith('did:')) {
      setError("DID must start with 'did:'")
      return
    }
    onAdd(trimmed)
    reset()
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add DID manually
      </button>
    )
  }

  return (
    <div className="rounded-md bg-zinc-900 p-2 ring-1 ring-white/5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          autoFocus
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            } else if (e.key === 'Escape') {
              reset()
            }
          }}
          placeholder="did:plc:…"
          className="flex-1 rounded-md bg-zinc-800 px-3 py-1.5 font-mono text-xs text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
        />
        <button
          type="button"
          onClick={submit}
          aria-label="Save"
          className="grid h-8 w-8 place-items-center rounded-md bg-violet-500 text-white hover:bg-violet-400"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Cancel"
          className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  )
}

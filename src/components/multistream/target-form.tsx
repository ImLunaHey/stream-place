import { useEffect, useState } from 'react'
import { Modal } from '../modal'
import { ToggleSwitch } from '../toggle-switch'
import { redactRtmpUrl } from '../../lib/time-ago'
import type {
  MultistreamTargetRecord,
  MultistreamTargetView,
} from '../../queries/multistream-targets'

type Props = {
  open: boolean
  target?: MultistreamTargetView
  isLoading: boolean
  error?: string | null
  onSubmit: (record: MultistreamTargetRecord) => void
  onClose: () => void
}

const RTMP_RE = /^rtmps?:\/\/.+/i

export function MultistreamTargetForm({
  open,
  target,
  isLoading,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [active, setActive] = useState(true)
  const [urlEdited, setUrlEdited] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setUrlEdited(false)
    setUrlError(null)
    if (target) {
      setName(target.record.name ?? '')
      setUrl(target.record.url)
      setActive(target.record.active)
    } else {
      setName('')
      setUrl('')
      setActive(true)
    }
  }, [open, target])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setUrlError('URL is required')
      return
    }
    if (!RTMP_RE.test(url.trim())) {
      setUrlError('URL must start with rtmp:// or rtmps://')
      return
    }
    setUrlError(null)
    onSubmit({
      name: name.trim() || undefined,
      url: url.trim(),
      active,
      createdAt: target?.record.createdAt ?? new Date().toISOString(),
    })
  }

  const displayUrl = target && !urlEdited ? '' : url
  const urlPlaceholder = target
    ? redactRtmpUrl(target.record.url)
    : 'rtmps://example.com:443/live/foo'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={target ? 'Edit target' : 'Create target'}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-zinc-300">
            Name <span className="text-zinc-500">(optional)</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="My YouTube"
            className="rounded-md bg-zinc-800 px-3 py-2 text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-zinc-300">RTMP URL *</span>
          <textarea
            value={displayUrl}
            onChange={(e) => {
              setUrlEdited(true)
              setUrl(e.target.value.trim().replace(/\n/g, ''))
            }}
            rows={2}
            placeholder={urlPlaceholder}
            className="rounded-md bg-zinc-800 px-3 py-2 font-mono text-xs text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
          />
          {urlError && (
            <span className="text-xs text-rose-300">{urlError}</span>
          )}
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Active</span>
          <ToggleSwitch
            checked={active}
            onChange={setActive}
            ariaLabel="Active"
          />
        </label>

        {error && (
          <p className="rounded-md bg-rose-950/60 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/30">
            {error}
          </p>
        )}

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
          >
            {isLoading ? 'Saving…' : target ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

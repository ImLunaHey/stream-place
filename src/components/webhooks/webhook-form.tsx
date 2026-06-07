import { useEffect, useState } from 'react'
import { Modal } from '../modal'
import { ToggleSwitch } from '../toggle-switch'
import type {
  WebhookEvent,
  WebhookView,
} from '../../queries/webhooks'
import type { WebhookInput } from '../../hooks/use-webhook-mutations'

type Props = {
  open: boolean
  webhook?: WebhookView
  isLoading: boolean
  error?: string | null
  onSubmit: (input: WebhookInput) => void
  onClose: () => void
}

const ALL_EVENTS: WebhookEvent[] = ['chat', 'livestream', 'follow', 'mention']

export function WebhookForm({
  open,
  webhook,
  isLoading,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [events, setEvents] = useState<WebhookEvent[]>(['chat'])
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setUrlError(null)
    if (webhook) {
      setUrl(webhook.url)
      setName(webhook.name ?? '')
      setDescription(webhook.description ?? '')
      setActive(webhook.active)
      setEvents(webhook.events)
    } else {
      setUrl('')
      setName('')
      setDescription('')
      setActive(true)
      setEvents(['chat'])
    }
  }, [open, webhook])

  const toggleEvent = (e: WebhookEvent) => {
    setEvents((cur) =>
      cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e],
    )
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!url.trim()) {
      setUrlError('URL is required')
      return
    }
    try {
      const u = new URL(url.trim())
      if (u.protocol !== 'https:' && u.protocol !== 'http:') {
        setUrlError('URL must be http or https')
        return
      }
    } catch {
      setUrlError('Invalid URL')
      return
    }
    if (events.length === 0) return
    setUrlError(null)
    onSubmit({
      url: url.trim(),
      name: name.trim() || undefined,
      description: description.trim() || undefined,
      active,
      events,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={webhook ? 'Edit webhook' : 'Create webhook'}
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
            placeholder="My Discord bot"
            className="rounded-md bg-zinc-800 px-3 py-2 text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-zinc-300">URL *</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/hook"
            className="rounded-md bg-zinc-800 px-3 py-2 font-mono text-xs text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
          />
          {urlError && (
            <span className="text-xs text-rose-300">{urlError}</span>
          )}
        </label>

        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="text-zinc-300">Events</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_EVENTS.map((e) => {
              const checked = events.includes(e)
              return (
                <label
                  key={e}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ${
                    checked
                      ? 'bg-violet-500/20 text-violet-100 ring-violet-500/40'
                      : 'bg-white/5 text-zinc-400 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEvent(e)}
                    className="sr-only"
                  />
                  {e}
                </label>
              )
            })}
          </div>
          {events.length === 0 && (
            <p className="text-xs text-rose-300">
              Pick at least one event.
            </p>
          )}
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-zinc-300">
            Description <span className="text-zinc-500">(optional)</span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={2}
            className="resize-none rounded-md bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/5 focus:outline-none focus:ring-violet-400"
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Active</span>
          <ToggleSwitch checked={active} onChange={setActive} ariaLabel="Active" />
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
            disabled={isLoading || events.length === 0}
            className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
          >
            {isLoading ? 'Saving…' : webhook ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

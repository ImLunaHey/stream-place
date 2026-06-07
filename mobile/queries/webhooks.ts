import { queryOptions } from '@tanstack/react-query'
import { callStreamplaceXrpc } from '../lib/streamplace-auth'

export type WebhookEvent = 'chat' | 'livestream' | 'follow' | 'mention'

export type WebhookView = {
  id: string
  url: string
  events: WebhookEvent[]
  active: boolean
  createdAt: string
  name?: string
  description?: string
  lastTriggered?: string
  errorCount?: number
}

export const WEBHOOKS_KEY = ['streamplace', 'webhooks'] as const

export const webhooksQuery = (loggedIn: boolean) =>
  queryOptions({
    queryKey: [...WEBHOOKS_KEY, loggedIn],
    queryFn: async () => {
      const data = await callStreamplaceXrpc<{ webhooks: WebhookView[] }>(
        'place.stream.server.listWebhooks',
        { params: { limit: 50 } },
      )
      return data.webhooks ?? []
    },
    enabled: loggedIn,
    staleTime: 30_000,
  })

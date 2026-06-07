import { useMutation, useQueryClient } from '@tanstack/react-query'
import { callStreamplaceXrpc } from '../lib/streamplace-xrpc'
import {
  WEBHOOKS_KEY,
  type WebhookEvent,
  type WebhookView,
} from '../queries/webhooks'

export type WebhookInput = {
  url: string
  events: WebhookEvent[]
  active: boolean
  name?: string
  description?: string
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: WEBHOOKS_KEY })
}

export function useCreateWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: WebhookInput) =>
      callStreamplaceXrpc<{ webhook: WebhookView }>(
        'place.stream.server.createWebhook',
        { method: 'POST', body: input },
      ),
    onSuccess: () => invalidate(qc),
  })
}

export function useUpdateWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string } & Partial<WebhookInput>) =>
      callStreamplaceXrpc<{ webhook: WebhookView }>(
        'place.stream.server.updateWebhook',
        { method: 'POST', body: vars },
      ),
    onSuccess: () => invalidate(qc),
  })
}

export function useDeleteWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      callStreamplaceXrpc<{ success: boolean }>(
        'place.stream.server.deleteWebhook',
        { method: 'POST', body: { id } },
      ),
    onSuccess: () => invalidate(qc),
  })
}

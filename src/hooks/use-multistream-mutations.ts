import { useMutation, useQueryClient } from '@tanstack/react-query'
import { callStreamplaceXrpc } from '../lib/streamplace-xrpc'
import {
  MULTISTREAM_KEY,
  type MultistreamTargetRecord,
  type MultistreamTargetView,
} from '../queries/multistream-targets'

function rkeyFromUri(uri: string) {
  return uri.split('/').pop() ?? ''
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: MULTISTREAM_KEY })
}

export function useCreateMultistreamTarget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (record: MultistreamTargetRecord) =>
      callStreamplaceXrpc<MultistreamTargetView>(
        'place.stream.multistream.createTarget',
        {
          method: 'POST',
          body: {
            multistreamTarget: {
              ...record,
              $type: 'place.stream.multistream.target',
              createdAt: new Date().toISOString(),
            },
          },
        },
      ),
    onSuccess: () => invalidate(qc),
  })
}

export function useUpdateMultistreamTarget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: {
      uri: string
      record: MultistreamTargetRecord
    }) =>
      callStreamplaceXrpc<MultistreamTargetView>(
        'place.stream.multistream.putTarget',
        {
          method: 'POST',
          body: {
            multistreamTarget: {
              ...vars.record,
              $type: 'place.stream.multistream.target',
            },
            rkey: rkeyFromUri(vars.uri),
          },
        },
      ),
    onSuccess: () => invalidate(qc),
  })
}

export function useDeleteMultistreamTarget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (uri: string) =>
      callStreamplaceXrpc<unknown>(
        'place.stream.multistream.deleteTarget',
        {
          method: 'POST',
          body: { rkey: rkeyFromUri(uri) },
        },
      ),
    onSuccess: () => invalidate(qc),
  })
}

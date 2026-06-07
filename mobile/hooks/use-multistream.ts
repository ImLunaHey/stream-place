import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { callStreamplaceXrpc } from '../lib/streamplace-auth'
import {
  MULTISTREAM_KEY,
  multistreamTargetsQuery,
  type MultistreamTargetRecord,
} from '../queries/multistream'
import { useSession } from './use-session'

function rkey(uri: string) {
  return uri.split('/').pop() ?? ''
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: MULTISTREAM_KEY })
}

export function useMultistreamTargets() {
  const { session } = useSession()
  return useQuery(multistreamTargetsQuery(!!session))
}

export function useCreateMultistream() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (record: MultistreamTargetRecord) =>
      callStreamplaceXrpc('place.stream.multistream.createTarget', {
        method: 'POST',
        body: {
          multistreamTarget: {
            ...record,
            $type: 'place.stream.multistream.target',
            createdAt: new Date().toISOString(),
          },
        },
      }),
    onSuccess: () => invalidate(qc),
  })
}

export function useUpdateMultistream() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { uri: string; record: MultistreamTargetRecord }) =>
      callStreamplaceXrpc('place.stream.multistream.putTarget', {
        method: 'POST',
        body: {
          multistreamTarget: {
            ...vars.record,
            $type: 'place.stream.multistream.target',
          },
          rkey: rkey(vars.uri),
        },
      }),
    onSuccess: () => invalidate(qc),
  })
}

export function useDeleteMultistream() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uri: string) =>
      callStreamplaceXrpc('place.stream.multistream.deleteTarget', {
        method: 'POST',
        body: { rkey: rkey(uri) },
      }),
    onSuccess: () => invalidate(qc),
  })
}

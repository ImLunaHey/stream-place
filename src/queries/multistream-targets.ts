import { queryOptions } from '@tanstack/react-query'
import { callStreamplaceXrpc } from '../lib/streamplace-xrpc'

export type MultistreamTargetRecord = {
  $type?: 'place.stream.multistream.target'
  url: string
  active: boolean
  createdAt: string
  name?: string
}

export type MultistreamEvent = {
  message: string
  status: 'inactive' | 'pending' | 'active' | 'error'
  createdAt: string
}

export type MultistreamTargetView = {
  uri: string
  cid: string
  record: MultistreamTargetRecord
  latestEvent?: MultistreamEvent
}

export const MULTISTREAM_KEY = ['streamplace', 'multistream', 'targets'] as const

export const multistreamTargetsQuery = (loggedIn: boolean) =>
  queryOptions({
    queryKey: [...MULTISTREAM_KEY, loggedIn],
    queryFn: async (): Promise<MultistreamTargetView[]> => {
      const data = await callStreamplaceXrpc<{
        targets: MultistreamTargetView[]
      }>('place.stream.multistream.listTargets', { params: { limit: 50 } })
      return data.targets ?? []
    },
    enabled: loggedIn,
    staleTime: 30_000,
  })

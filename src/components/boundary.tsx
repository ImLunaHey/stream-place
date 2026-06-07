import { CatchBoundary, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ErrorFallback } from './error-fallback'

type Props = {
  id: string
  title?: string
  compact?: boolean
  children: ReactNode
}

export function Boundary({ id, title, compact, children }: Props) {
  const resetKey = useRouterState({ select: (s) => s.location.pathname })
  return (
    <CatchBoundary
      getResetKey={() => `${id}:${resetKey}`}
      errorComponent={({ error, reset }) => (
        <ErrorFallback
          error={error}
          reset={reset}
          title={title}
          compact={compact}
        />
      )}
    >
      {children}
    </CatchBoundary>
  )
}

import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import { navigate } from '../lib/navigate'

type Props = {
  href: string
  children: ReactNode
  className?: string
}

export function TransitionLink({ href, children, className }: Props) {
  return (
    <Pressable onPress={() => navigate(href)} className={className}>
      {children}
    </Pressable>
  )
}

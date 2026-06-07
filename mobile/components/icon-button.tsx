import { Link } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

type Props = {
  href: string
  active?: boolean
  children: ReactNode
}

export function IconButton({ href, active, children }: Props) {
  return (
    <Link href={href} asChild>
      <Pressable
        className="relative h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        }}
      >
        {active && (
          <View
            className="absolute h-6 w-1 rounded-r-full bg-pink-400"
            style={{ left: -8, top: '50%', transform: [{ translateY: -12 }] }}
          />
        )}
        {children}
      </Pressable>
    </Link>
  )
}

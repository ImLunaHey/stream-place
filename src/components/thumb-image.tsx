import { useState } from 'react'

type Props = {
  src: string
  alt: string
  onError?: () => void
}

export function ThumbImage({ src, alt, onError }: Props) {
  const [errored, setErrored] = useState(false)
  if (errored) return null
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
      loading="lazy"
      onError={() => {
        setErrored(true)
        onError?.()
      }}
    />
  )
}

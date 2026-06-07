import { Link } from '@tanstack/react-router'

export function BrandMark() {
  return (
    <Link
      to="/"
      viewTransition
      className="flex shrink-0 items-center gap-2"
      aria-label="stream.place home"
    >
      <img
        src="/streamplace-logo.svg"
        alt=""
        className="h-7 w-7 shrink-0"
      />
      <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
        stream.place
      </span>
    </Link>
  )
}

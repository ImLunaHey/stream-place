const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
]

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function timeAgo(input: string | Date | number): string {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSec)
  for (const [unit, secs] of UNITS) {
    if (abs >= secs || unit === 'second')
      return rtf.format(Math.round(diffSec / secs), unit)
  }
  return rtf.format(diffSec, 'second')
}

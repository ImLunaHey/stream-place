const LABELS: Record<string, string> = {
  death: 'Death',
  drugUse: 'Drug use',
  fantasyViolence: 'Fantasy violence',
  flashingLights: 'Flashing lights',
  language: 'Strong language',
  nudity: 'Nudity',
  PII: 'Personal information',
  sexuality: 'Sexuality',
  suffering: 'Suffering',
  violence: 'Violence',
}

const ALIASES: Record<string, string> = {
  drugs: 'drugUse',
  flashing: 'flashingLights',
  pii: 'PII',
}

export function warningLabel(token: string): string {
  let id = token
  if (token.startsWith('cwarn:')) id = token.slice('cwarn:'.length)
  else if (token.includes('#')) id = token.split('#').pop() ?? token
  id = ALIASES[id] ?? id
  return LABELS[id] ?? id
}

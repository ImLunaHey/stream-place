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

export function warningLabel(token: string): string {
  const id = token.split('#').pop() ?? token
  return LABELS[id] ?? id
}

export type ThemeMode = "light" | "dark" | "both"

export interface ThemeTokens {
  bg: string
  bgAccent: string
  bgElevated: string
  bgHover: string

  panel: string
  panelStrong: string

  card: string
  cardFg: string

  text: string
  textStrong: string
  muted: string
  mutedStrong: string

  border: string
  borderStrong: string
  borderHover: string

  accent: string
  accentHover?: string
  accentText?: string
  accentSubtle?: string
  accentGlow?: string
  ring?: string

  ok: string
  okSubtle?: string
  warn: string
  warnSubtle?: string
  danger: string
  dangerSubtle?: string
  info: string
  infoSubtle?: string

  chart: [string, string, string, string, string, string, string, string]

  radius?: string
}

export interface Theme {
  id: string
  name: string
  emoji: string
  mode: ThemeMode
  light: ThemeTokens
  dark: ThemeTokens
}
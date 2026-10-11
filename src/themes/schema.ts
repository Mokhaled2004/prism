import { z } from "zod"

const hex = z.string().regex(/^#[0-9A-Fa-f]{6,8}$/, "Must be hex color")

const themeTokensSchema = z.object({
  bg: hex,
  bgAccent: hex,
  bgElevated: hex,
  bgHover: hex,

  panel: hex,
  panelStrong: hex,

  card: hex,
  cardFg: hex,

  text: hex,
  textStrong: hex,
  muted: hex,
  mutedStrong: hex,

  border: hex,
  borderStrong: hex,
  borderHover: hex,

  accent: hex,
  accentHover: hex.optional(),
  accentText: hex.optional(),
  accentSubtle: hex.optional(),
  accentGlow: hex.optional(),
  ring: hex.optional(),

  ok: hex,
  okSubtle: hex.optional(),
  warn: hex,
  warnSubtle: hex.optional(),
  danger: hex,
  dangerSubtle: hex.optional(),
  info: hex,
  infoSubtle: hex.optional(),

  chart: z.tuple([hex, hex, hex, hex, hex, hex, hex, hex]),

  radius: z.string().optional(),
})

export const themeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  emoji: z.string().min(1),
  mode: z.enum(["light", "dark", "both"]),
  light: themeTokensSchema,
  dark: themeTokensSchema,
})

export type ThemeInput = z.input<typeof themeSchema>
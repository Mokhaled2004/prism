import { parse, converter, formatHex } from "culori"
import { contrastRatio } from "./contrast"
const toOklch = converter("oklch")

export interface OklchColor {
  l: number
  c: number
  h: number
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

export function parseColor(input: string): OklchColor | null {
  const parsed = parse(input)
  if (!parsed) return null
  const o = toOklch(parsed)
  if (!o) return null
  return {
    l: o.l ?? 0,
    c: o.c ?? 0,
    h: o.h ?? 0,
  }
}

export function toHex({ l, c, h }: OklchColor): string {
  return formatHex({ mode: "oklch", l, c, h }) ?? "#000000"
}

export function lighten(color: OklchColor, delta: number): OklchColor {
  return { ...color, l: clamp(color.l + delta, 0, 1) }
}

export function darken(color: OklchColor, delta: number): OklchColor {
  return { ...color, l: clamp(color.l - delta, 0, 1) }
}

export function saturate(color: OklchColor, delta: number): OklchColor {
  return { ...color, c: clamp(color.c + delta, 0, 0.4) }
}

export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").slice(0, 6)
  const a = Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()
  return `#${clean}${a}`
}

export interface AccentFamily {
  accent: string
  accentHover: string
  accentText: string
  accentSubtle: string
  accentGlow: string
  ring: string
}
export function deriveAccentFamily(
  baseHex: string,
  mode: "light" | "dark"
): AccentFamily {
  const base = parseColor(baseHex)
  if (!base) {
    throw new Error(`Cannot parse color: ${baseHex}`)
  }

  // Pick text color with the best contrast against the accent
  const accentHex = toHex(base)
  const whiteContrast = contrastRatio("#FFFFFF", accentHex)
  const blackContrast = contrastRatio("#0A0A0C", accentHex)

  const accentText =
    whiteContrast >= blackContrast ? "#FFFFFF" : "#0A0A0C"

  if (mode === "light") {
    return {
      accent: accentHex,
      accentHover: toHex(lighten(base, 0.06)),
      accentText,
      accentSubtle: withAlpha(accentHex, 0.12),
      accentGlow: withAlpha(accentHex, 0.15),
      ring: toHex(darken(base, 0.05)),
    }
  }

  return {
    accent: toHex(lighten(base, 0.08)),
    accentHover: toHex(lighten(base, 0.16)),
    accentText,
    accentSubtle: withAlpha(toHex(lighten(base, 0.08)), 0.12),
    accentGlow: withAlpha(toHex(lighten(base, 0.08)), 0.2),
    ring: toHex(lighten(base, 0.16)),
  }
}
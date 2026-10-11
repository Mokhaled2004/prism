import { parse, converter } from "culori"

const toRgb = converter("rgb")

function relativeLuminance(color: string): number {
  const parsed = parse(color)
  if (!parsed) return 0
  const rgb = toRgb(parsed)
  if (!rgb) return 0

  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return (
    0.2126 * channel(rgb.r ?? 0) +
    0.7152 * channel(rgb.g ?? 0) +
    0.0722 * channel(rgb.b ?? 0)
  )
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type ContrastLevel = "AAA" | "AA" | "AA-large" | "fail"

export function classifyContrast(ratio: number): ContrastLevel {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA-large"
  return "fail"
}

export function checkContrast(fg: string, bg: string) {
  const ratio = contrastRatio(fg, bg)
  return {
    ratio: Math.round(ratio * 100) / 100,
    level: classifyContrast(ratio),
  }
}
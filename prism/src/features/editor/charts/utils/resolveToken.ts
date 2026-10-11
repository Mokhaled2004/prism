import type { ColorValue } from "../types/common"

/**
 * Theme token names that resolve to CSS variables.
 * Anything not in this list is treated as a raw color.
 */
const TOKEN_MAP: Record<string, string> = {
  // Surfaces
  bg: "var(--bg)",
  panel: "var(--panel)",
  card: "var(--card)",
  "bg-hover": "var(--bg-hover)",
  "bg-accent": "var(--bg-accent)",

  // Text
  text: "var(--text)",
  "text-strong": "var(--text-strong)",
  muted: "var(--muted)",
  "muted-strong": "var(--muted-strong)",

  // Borders
  border: "var(--border)",
  "border-strong": "var(--border-strong)",

  // Accent
  accent: "var(--accent)",
  "accent-hover": "var(--accent-hover)",
  "accent-text": "var(--accent-text)",

  // Semantic
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  info: "var(--info)",

  // Chart palette
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
  "chart-6": "var(--chart-6)",
  "chart-7": "var(--chart-7)",
  "chart-8": "var(--chart-8)",
}

/**
 * Resolve a color value:
 *  - If it's a known token name, return the CSS variable reference
 *  - Otherwise treat it as a raw color (hex, rgb, etc.)
 */
export function resolveColor(value: ColorValue): string {
  const trimmed = value.trim()
  if (!trimmed) return "transparent"
  return TOKEN_MAP[trimmed] ?? trimmed
}

/**
 * Resolve a chart palette array.
 */
export function resolvePalette(palette: ColorValue[]): string[] {
  return palette.map(resolveColor)
}
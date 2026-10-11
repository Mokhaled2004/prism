import { themeSchema, type ThemeInput } from "./schema"
import { presets } from "./presets"
import type { Theme } from "./types"

function normalize(input: ThemeInput): Theme {
  return themeSchema.parse(input) as Theme
}

export const themeRegistry: Record<string, Theme> = Object.fromEntries(
  presets.map((p) => [p.id, normalize(p)])
)

export const defaultThemeId = "prism-violet"

export function getTheme(id: string): Theme {
  return themeRegistry[id] ?? themeRegistry[defaultThemeId]
}

export function listThemes(): Theme[] {
  return Object.values(themeRegistry)
}
import { deriveAccentFamily, withAlpha } from "@/lib/color/oklch"
import type { Theme, ThemeTokens } from "./types"

function semanticSubtle(hex: string): string {
  return withAlpha(hex, 0.1)
}

function tokenMap(tokens: ThemeTokens, mode: "light" | "dark"): Record<string, string> {
  const accent = deriveAccentFamily(tokens.accent, mode)

  return {
    "--bg": tokens.bg,
    "--bg-accent": tokens.bgAccent,
    "--bg-elevated": tokens.bgElevated,
    "--bg-hover": tokens.bgHover,

    "--panel": tokens.panel,
    "--panel-strong": tokens.panelStrong,

    "--card": tokens.card,
    "--card-fg": tokens.cardFg,

    "--text": tokens.text,
    "--text-strong": tokens.textStrong,
    "--muted": tokens.muted,
    "--muted-strong": tokens.mutedStrong,

    "--border": tokens.border,
    "--border-strong": tokens.borderStrong,
    "--border-hover": tokens.borderHover,

    "--accent": accent.accent,
    "--accent-hover": accent.accentHover,
    "--accent-text": accent.accentText,
    "--accent-subtle": accent.accentSubtle,
    "--accent-glow": accent.accentGlow,
    "--ring": accent.ring,

    "--ok": tokens.ok,
    "--ok-subtle": tokens.okSubtle ?? semanticSubtle(tokens.ok),
    "--warn": tokens.warn,
    "--warn-subtle": tokens.warnSubtle ?? semanticSubtle(tokens.warn),
    "--danger": tokens.danger,
    "--danger-subtle": tokens.dangerSubtle ?? semanticSubtle(tokens.danger),
    "--info": tokens.info,
    "--info-subtle": tokens.infoSubtle ?? semanticSubtle(tokens.info),

    "--chart-1": tokens.chart[0],
    "--chart-2": tokens.chart[1],
    "--chart-3": tokens.chart[2],
    "--chart-4": tokens.chart[3],
    "--chart-5": tokens.chart[4],
    "--chart-6": tokens.chart[5],
    "--chart-7": tokens.chart[6],
    "--chart-8": tokens.chart[7],

    ...(tokens.radius ? { "--radius": tokens.radius } : {}),
  }
}

/**
 * Apply a theme. The theme's own `mode` field decides light vs dark.
 * No separate mode parameter — the theme owns its mode.
 */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const activeMode: "light" | "dark" = theme.mode === "dark" ? "dark" : "light"
  const tokens = activeMode === "dark" ? theme.dark : theme.light
  const vars = tokenMap(tokens, activeMode)

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }

  root.classList.toggle("dark", activeMode === "dark")
  root.setAttribute("data-theme", theme.id)
  root.setAttribute("data-mode", theme.mode)
}

export function clearTheme() {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const tokens = tokenMap(getFallbackLightTokens() as ThemeTokens, "light")
  for (const key of Object.keys(tokens)) {
    root.style.removeProperty(key)
  }
  root.classList.remove("dark")
  root.removeAttribute("data-theme")
  root.removeAttribute("data-mode")
}

function getFallbackLightTokens(): Partial<ThemeTokens> {
  return {
    bg: "", bgAccent: "", bgElevated: "", bgHover: "",
    panel: "", panelStrong: "",
    card: "", cardFg: "",
    text: "", textStrong: "", muted: "", mutedStrong: "",
    border: "", borderStrong: "", borderHover: "",
    accent: "",
    ok: "", warn: "", danger: "", info: "",
    chart: ["", "", "", "", "", "", "", ""],
  }
}
"use client"

import { useEffect } from "react"
import { X, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/themes/components/ThemeProvider"
import type { Theme } from "@/themes/types"

export interface ThemesModalProps {
  open: boolean
  onClose: () => void
  onCustomize: (theme: Theme) => void
}

export function ThemesModal({ open, onClose, onCustomize }: ThemesModalProps) {
  const { themeId, themes, setThemeId } = useTheme()

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <Sparkles
                className="w-4 h-4 text-prism-accent"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-prism-text-strong">
                Themes
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                Choose a look. Changes apply instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={theme.id === themeId}
                onSelect={() => setThemeId(theme.id)}
                onCustomize={() => onCustomize(theme)}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-bg-hover shrink-0">
          <p className="text-2xs text-prism-muted">
            Click a theme to apply it. Use{" "}
            <span className="text-prism-text font-medium">Customize</span> to
            edit colors and save your own version.
          </p>
        </div>
      </div>
    </div>
  )
}

function ThemeCard({
  theme,
  isActive,
  onSelect,
  onCustomize,
}: {
  theme: Theme
  isActive: boolean
  onSelect: () => void
  onCustomize: () => void
}) {
  const tokens = theme.mode === "dark" ? theme.dark : theme.light
  const accent = tokens.accent

  return (
    <div
      className={cn(
        "relative rounded-lg border overflow-hidden transition-all group",
        isActive
          ? "border-accent ring-2 ring-accent-glow"
          : "border-border hover:border-border-strong"
      )}
    >
      {/* Clickable preview area */}
      <button
        onClick={onSelect}
        className="block w-full text-left"
        title="Apply this theme"
      >
        <div
          className="h-[120px] p-3 flex flex-col gap-2"
          style={{ backgroundColor: tokens.bg }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: accent }}
              />
              <div
                className="w-12 h-1.5 rounded-full"
                style={{ backgroundColor: tokens.textStrong }}
              />
            </div>
            <div
              className="h-3 w-10 rounded-sm"
              style={{ backgroundColor: accent, opacity: 0.8 }}
            />
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-sm p-1.5"
                style={{
                  backgroundColor: tokens.panel,
                  border: `1px solid ${tokens.border}`,
                }}
              >
                <div
                  className="h-1 rounded-full mb-1"
                  style={{ backgroundColor: tokens.muted, opacity: 0.6 }}
                />
                <div
                  className="h-2 rounded-sm"
                  style={{ backgroundColor: tokens.textStrong }}
                />
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            className="flex-1 rounded-sm flex items-end gap-0.5 p-1.5"
            style={{
              backgroundColor: tokens.panel,
              border: `1px solid ${tokens.border}`,
            }}
          >
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: accent,
                  opacity: 0.5 + (i / 7) * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{
            backgroundColor: tokens.panel,
            borderTop: `1px solid ${tokens.border}`,
          }}
        >
          <span className="text-base leading-none">{theme.emoji}</span>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold leading-tight truncate"
              style={{ color: tokens.textStrong }}
            >
              {theme.name}
            </p>
            <p
              className="text-2xs uppercase tracking-wider leading-tight mt-0.5"
              style={{ color: tokens.muted }}
            >
              {theme.mode === "dark" ? "Dark" : "Light"}
            </p>
          </div>
          {isActive && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: accent }}
            >
              <Check
                className="w-3 h-3"
                strokeWidth={3}
                style={{ color: theme.mode === "dark" ? tokens.bg : "#FFFFFF" }}
              />
            </div>
          )}
        </div>
      </button>

      {/* Customize button — appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onCustomize()
        }}
        className={cn(
          "absolute top-2 right-2 h-6 px-2 rounded-md text-2xs font-medium transition-opacity",
          "bg-black/70 text-white backdrop-blur-sm hover:bg-black/80",
          "opacity-0 group-hover:opacity-100"
        )}
      >
        Customize
      </button>
    </div>
  )
}
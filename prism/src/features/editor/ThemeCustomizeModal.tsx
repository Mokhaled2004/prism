"use client"

import { useState, useEffect } from "react"
import { X, Save, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme, ThemeTokens } from "@/themes/types"

export interface ThemeCustomizeModalProps {
  theme: Theme | null
  onClose: () => void
  onSave: (theme: Theme) => void
}

interface TokenField {
  key: keyof ThemeTokens
  label: string
}

interface TokenGroup {
  title: string
  fields: TokenField[]
}

const GROUPS: TokenGroup[] = [
  {
    title: "Surfaces",
    fields: [
      { key: "bg", label: "Background" },
      { key: "bgAccent", label: "Accent background" },
      { key: "bgElevated", label: "Elevated" },
      { key: "bgHover", label: "Hover" },
      { key: "panel", label: "Panel" },
      { key: "panelStrong", label: "Panel strong" },
      { key: "card", label: "Card" },
      { key: "cardFg", label: "Card foreground" },
    ],
  },
  {
    title: "Text",
    fields: [
      { key: "text", label: "Text" },
      { key: "textStrong", label: "Text strong" },
      { key: "muted", label: "Muted" },
      { key: "mutedStrong", label: "Muted strong" },
    ],
  },
  {
    title: "Borders",
    fields: [
      { key: "border", label: "Border" },
      { key: "borderStrong", label: "Border strong" },
      { key: "borderHover", label: "Border hover" },
    ],
  },
  {
    title: "Accent",
    fields: [{ key: "accent", label: "Accent" }],
  },
  {
    title: "Semantic",
    fields: [
      { key: "ok", label: "Success" },
      { key: "warn", label: "Warning" },
      { key: "danger", label: "Danger" },
      { key: "info", label: "Info" },
    ],
  },
]

const EMOJI_OPTIONS = ["✨", "🎨", "🌙", "☀️", "🔥", "💧", "🌿", "🟣", "🔵", "🟢", "🟠", "🔴", "⚫", "⚪"]

export function ThemeCustomizeModal({
  theme,
  onClose,
  onSave,
}: ThemeCustomizeModalProps) {
  const [draft, setDraft] = useState<Theme | null>(null)
  const [mode, setMode] = useState<"light" | "dark">("light")
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("✨")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!theme) return
    setDraft(JSON.parse(JSON.stringify(theme)))
    setMode(theme.mode === "dark" ? "dark" : "light")
    setName(`${theme.name.replace(/ \(Custom\)$/, "")} Custom`)
    setEmoji(theme.emoji || "✨")
    setError(null)
  }, [theme])

  if (!theme || !draft) return null

  const resolvedMode: "light" | "dark" = mode === "dark" ? "dark" : "light"
  const tokens: ThemeTokens = draft[resolvedMode] ?? draft.light ?? draft.dark

  const updateToken = (key: keyof ThemeTokens, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [resolvedMode]: {
          ...prev[resolvedMode],
          [key]: value,
        },
      }
    })
  }

  const updateChartColor = (index: number, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev
      const source = prev[resolvedMode]
      const nextChart = [...source.chart] as ThemeTokens["chart"]
      nextChart[index] = value
      return {
        ...prev,
        [resolvedMode]: {
          ...source,
          chart: nextChart,
        },
      }
    })
  }

  const handleReset = () => {
    setDraft(JSON.parse(JSON.stringify(theme)))
    setName(`${theme.name.replace(/ \(Custom\)$/, "")} Custom`)
    setEmoji(theme.emoji || "✨")
    setError(null)
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Please enter a name for the theme")
      return
    }
    if (!draft) return

    const customTheme: Theme = {
      ...draft,
      id: `custom-${Date.now()}`,
      name: trimmedName,
      emoji: emoji || "✨",
    }
    onSave(customTheme)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[90vh] bg-panel border border-border rounded-lg shadow-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-prism-text-strong">
              Customize theme
            </h2>
            <p className="text-xs text-prism-muted mt-0.5">
              Based on{" "}
              <span className="text-prism-text font-medium">{theme.name}</span>.
              Changes preview live.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setMode("light")}
                className={cn(
                  "h-7 px-3 rounded-md text-xs font-medium transition-colors",
                  resolvedMode === "light"
                    ? "bg-accent text-prism-accent-text"
                    : "text-prism-muted hover:text-prism-text hover:bg-bg-hover"
                )}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setMode("dark")}
                className={cn(
                  "h-7 px-3 rounded-md text-xs font-medium transition-colors",
                  resolvedMode === "dark"
                    ? "bg-accent text-prism-accent-text"
                    : "text-prism-muted hover:text-prism-text hover:bg-bg-hover"
                )}
              >
                🌙 Dark
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
              title="Close"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Name + emoji bar */}
        <div className="px-6 py-4 border-b border-border shrink-0 bg-bg-hover/40">
          <div className="flex items-center gap-3">
            {/* Emoji picker trigger */}
            <div className="relative">
              <button
                onClick={() => setEmojiPickerOpen((v) => !v)}
                className="w-12 h-12 rounded-md border border-border bg-panel flex items-center justify-center text-2xl hover:bg-bg-hover transition-colors"
                title="Choose icon"
              >
                {emoji}
              </button>

              {emojiPickerOpen && (
                <div className="absolute top-full left-0 mt-1 bg-panel border border-border rounded-md shadow-lg p-2 z-10 grid grid-cols-7 gap-1 w-[280px]">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        setEmoji(e)
                        setEmojiPickerOpen(false)
                      }}
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-bg-hover transition-colors",
                        emoji === e && "bg-accent-subtle ring-2 ring-accent-glow"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Name input */}
            <div className="flex-1 min-w-0">
              <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-1.5">
                Theme name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="e.g. My Brand Theme"
                className={cn(
                  "w-full h-9 px-3 rounded-md border bg-bg text-sm text-prism-text placeholder:text-prism-muted focus:outline-none focus:ring-2",
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/30"
                    : "border-border focus:border-accent focus:ring-accent-glow"
                )}
              />
              {error && (
                <p className="text-2xs text-prism-danger mt-1">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Split */}
        <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-border">
          {/* Editor */}
          <div className="flex flex-col min-h-0">
            <div className="px-5 py-2.5 border-b border-border shrink-0 flex items-center justify-between">
              <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                Colors · {resolvedMode}
              </p>
              <button
                onClick={handleReset}
                className="h-6 px-2 rounded-md text-2xs text-prism-muted hover:text-prism-text hover:bg-bg-hover flex items-center gap-1"
                title="Reset to original"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                Reset
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
                    {group.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.fields.map((field) => (
                      <ColorRow
                        key={String(field.key)}
                        label={field.label}
                        value={String(tokens[field.key] ?? "#000000")}
                        onChange={(v) => updateToken(field.key, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
                  Chart palette
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.chart.map((color, i) => (
                    <ColorRow
                      key={i}
                      label={`Chart ${i + 1}`}
                      value={color}
                      onChange={(v) => updateChartColor(i, v)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col min-h-0">
            <div className="px-5 py-2.5 border-b border-border shrink-0">
              <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                Live preview ({resolvedMode})
              </p>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto p-6"
              style={{ backgroundColor: tokens.bg }}
            >
              <div className="space-y-4 max-w-md mx-auto">
                <div
                  className="flex items-center justify-between pb-3"
                  style={{ borderBottom: `1px solid ${tokens.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{ backgroundColor: tokens.accent }}
                    />
                    <div
                      className="text-sm font-semibold"
                      style={{ color: tokens.textStrong }}
                    >
                      Prism
                    </div>
                  </div>
                  <div
                    className="px-3 h-6 rounded-md text-2xs font-medium flex items-center text-white"
                    style={{ backgroundColor: tokens.accent }}
                  >
                    Publish
                  </div>
                </div>

                <div>
                  <div
                    className="text-lg font-semibold mb-1"
                    style={{ color: tokens.textStrong }}
                  >
                    Executive Dashboard
                  </div>
                  <div className="text-xs" style={{ color: tokens.muted }}>
                    Key performance indicators for the current period.
                  </div>
                </div>

                <div
                  className="rounded-md p-4"
                  style={{
                    backgroundColor: tokens.panel,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  <div
                    className="text-2xs uppercase tracking-wider font-semibold mb-1"
                    style={{ color: tokens.muted }}
                  >
                    Revenue
                  </div>
                  <div
                    className="text-2xl font-semibold"
                    style={{ color: tokens.textStrong }}
                  >
                    $4.8M
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <span style={{ color: tokens.ok }}>↑ 20.4%</span>
                    <span style={{ color: tokens.muted }}>vs last period</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-md p-3"
                    style={{
                      backgroundColor: tokens.card,
                      color: tokens.cardFg,
                      border: `1px solid ${tokens.border}`,
                    }}
                  >
                    <p
                      className="text-2xs uppercase tracking-wider font-semibold"
                      style={{ color: tokens.muted }}
                    >
                      Orders
                    </p>
                    <p
                      className="text-xl font-semibold mt-1"
                      style={{ color: tokens.cardFg }}
                    >
                      24,150
                    </p>
                  </div>
                  <div
                    className="rounded-md p-3"
                    style={{
                      backgroundColor: tokens.bgElevated,
                      border: `1px solid ${tokens.borderStrong}`,
                    }}
                  >
                    <p
                      className="text-2xs uppercase tracking-wider font-semibold"
                      style={{ color: tokens.mutedStrong }}
                    >
                      Margin
                    </p>
                    <p
                      className="text-xl font-semibold mt-1"
                      style={{ color: tokens.textStrong }}
                    >
                      25.7%
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-md p-4"
                  style={{
                    backgroundColor: tokens.panel,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-3"
                    style={{ color: tokens.textStrong }}
                  >
                    Monthly Revenue
                  </p>
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          backgroundColor: tokens.chart[i % tokens.chart.length],
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 h-7 rounded-md text-xs font-medium text-white"
                    style={{ backgroundColor: tokens.accent }}
                  >
                    Primary
                  </button>
                  <button
                    className="px-3 h-7 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: tokens.bgHover,
                      color: tokens.text,
                    }}
                  >
                    Hover
                  </button>
                  <button
                    className="px-3 h-7 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: tokens.bgAccent,
                      color: tokens.text,
                    }}
                  >
                    Accent bg
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge color={tokens.ok} label="Success" />
                  <Badge color={tokens.warn} label="Warning" />
                  <Badge color={tokens.danger} label="Danger" />
                  <Badge color={tokens.info} label="Info" />
                </div>

                <div
                  className="h-px w-full"
                  style={{ backgroundColor: tokens.borderHover }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-hover flex items-center justify-between shrink-0">
          <p className="text-2xs text-prism-muted">
            Save creates a new custom theme — original presets stay intact.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={2.25} />
              Save as new theme
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-2 p-2 rounded-md border border-border bg-bg hover:bg-bg-hover transition-colors cursor-pointer">
      <div className="relative w-7 h-7 rounded-md overflow-hidden border border-border shrink-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={normalizeHex(value)}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-prism-text truncate">{label}</p>
        <p className="text-2xs text-prism-muted font-mono truncate">
          {value.toUpperCase()}
        </p>
      </div>
    </label>
  )
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="text-2xs px-2 py-0.5 rounded-full font-medium"
      style={{
        backgroundColor: hexAlpha(color, 0.15),
        color,
      }}
    >
      {label}
    </span>
  )
}

function normalizeHex(hex: string): string {
  if (!hex) return "#000000"
  const stripped = hex.replace("#", "")
  if (stripped.length === 8) return `#${stripped.slice(0, 6)}`
  if (stripped.length === 6) return `#${stripped}`
  return "#000000"
}

function hexAlpha(hex: string, alpha: number): string {
  const stripped = normalizeHex(hex).replace("#", "")
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0")
  return `#${stripped}${a}`
}
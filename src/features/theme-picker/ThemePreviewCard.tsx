"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/themes/types"

export interface ThemePreviewCardProps {
  theme: Theme
  isActive: boolean
  onSelect: () => void
}

export function ThemePreviewCard({
  theme,
  isActive,
  onSelect,
}: ThemePreviewCardProps) {
  const tokens = theme.mode === "dark" ? theme.dark : theme.light
  const accent = tokens.accent
  const accentText = theme.mode === "dark" ? "#0A0A0C" : "#FFFFFF"

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative group text-left rounded-lg border transition-all overflow-hidden",
        isActive
          ? "border-accent ring-2 ring-accent-glow"
          : "border-border hover:border-border-strong"
      )}
    >
      {/* Preview — inline styles using theme tokens */}
      <div
        className="p-3 h-[140px] flex flex-col"
        style={{ backgroundColor: tokens.bg }}
      >
        {/* Mini top bar */}
        <div
          className="flex items-center justify-between mb-2 pb-2"
          style={{ borderBottom: `1px solid ${tokens.border}` }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: accent }}
            />
            <div
              className="w-10 h-1.5 rounded-full"
              style={{ backgroundColor: tokens.text }}
            />
          </div>
          <div
            className="h-3 w-8 rounded-sm"
            style={{ backgroundColor: accent }}
          />
        </div>

        {/* Mini KPI row */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md p-1.5"
              style={{
                backgroundColor: tokens.panel,
                border: `1px solid ${tokens.border}`,
              }}
            >
              <div
                className="h-1 rounded-full mb-1.5"
                style={{ backgroundColor: tokens.muted, opacity: 0.6 }}
              />
              <div
                className="h-2 rounded-sm"
                style={{ backgroundColor: tokens.textStrong }}
              />
            </div>
          ))}
        </div>

        {/* Mini chart placeholder */}
        <div
          className="flex-1 rounded-md flex items-end gap-0.5 p-1.5"
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
                opacity: 0.4 + (i / 7) * 0.6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer — theme name + checkmark */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{
          backgroundColor: tokens.panel,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{theme.emoji}</span>
          <div>
            <p
              className="text-xs font-semibold leading-tight"
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
        </div>

        {isActive && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: accent }}
          >
            <Check
              className="w-3 h-3"
              strokeWidth={3}
              style={{ color: accentText }}
            />
          </div>
        )}
      </div>
    </button>
  )
}
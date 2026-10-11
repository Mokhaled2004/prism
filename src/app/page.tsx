"use client"

import { useTheme } from "@/themes/components/ThemeProvider"

export default function Home() {
  const { themeId, themes, setThemeId } = useTheme()

  return (
    <main className="min-h-screen bg-bg p-10 space-y-6">
      <div className="flex gap-3 items-center">
        <select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          className="h-8 px-3 rounded-md border border-border bg-panel text-xs text-prism-text"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <h2 className="text-prism-text-strong text-2xl font-semibold">
          Prism test
        </h2>
        <p className="text-prism-muted text-sm">
          Muted text — readable in every theme.
        </p>
        <p className="text-prism-text text-sm">
          Regular text.
        </p>
        <div className="flex gap-2">
          <span className="px-3 h-7 flex items-center rounded-md bg-accent text-prism-accent-text text-xs font-medium">
            Accent
          </span>
          <span className="px-3 h-7 flex items-center rounded-md border border-border text-prism-text text-xs">
            Outline
          </span>
        </div>
      </div>
    </main>
  )
}
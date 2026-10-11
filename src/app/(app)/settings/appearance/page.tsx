"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTheme } from "@/themes/components/ThemeProvider"
import { ThemePreviewCard } from "@/features/theme-picker/ThemePreviewCard"

export default function AppearanceSettingsPage() {
  const { themeId, themes, setThemeId } = useTheme()

  return (
    <div className="p-8">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-xs text-prism-muted hover:text-prism-text mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Settings</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-prism-text-strong">
          Appearance
        </h1>
        <p className="text-sm text-prism-muted mt-1">
          Choose a look for your dashboards. Changes apply instantly across the app.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <ThemePreviewCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === themeId}
            onSelect={() => setThemeId(theme.id)}
          />
        ))}
      </div>

      <p className="text-2xs text-prism-muted mt-8 max-w-xl">
        Prism ships with 8 built-in themes. Custom theme creation, brand colors,
        and per-dashboard overrides are coming soon.
      </p>
    </div>
  )
}
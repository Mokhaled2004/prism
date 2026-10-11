"use client"

import { useState } from "react"
import { PrismSelect } from "@/components/ui/prism/Select"

export function SettingsSection() {
  const [refresh, setRefresh] = useState("manual")
  const [view, setView] = useState("desktop")

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Dashboard settings
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Field label="Name">
          <input
            type="text"
            defaultValue="Sales Overview"
            className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            placeholder="Optional description"
            className="w-full px-3 py-2 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow resize-none"
          />
        </Field>

        <Field label="Refresh interval">
          <PrismSelect
            value={refresh}
            onChange={setRefresh}
            options={[
              { value: "manual", label: "Manual" },
              { value: "5m", label: "Every 5 minutes" },
              { value: "15m", label: "Every 15 minutes" },
              { value: "1h", label: "Every hour" },
            ]}
          />
        </Field>

        <Field label="Default view">
          <PrismSelect
            value={view}
            onChange={setView}
            options={[
              { value: "desktop", label: "Desktop" },
              { value: "tablet", label: "Tablet" },
              { value: "mobile", label: "Mobile" },
            ]}
          />
        </Field>

        <div className="pt-4 border-t border-border">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
            Danger zone
          </p>
          <button className="w-full h-8 rounded-md border border-danger bg-danger-subtle text-prism-danger text-xs font-medium hover:brightness-95 transition-colors cursor-pointer">
            Delete dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
        {label}
      </label>
      {children}
    </div>
  )
}
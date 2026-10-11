"use client"

import { LayoutTemplate } from "lucide-react"

export function TemplatesSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Templates
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="border border-dashed border-border rounded-md p-6 text-center">
          <LayoutTemplate
            className="w-6 h-6 text-prism-muted mx-auto mb-2"
            strokeWidth={1.5}
          />
          <p className="text-xs text-prism-text mb-1">Templates coming soon</p>
          <p className="text-2xs text-prism-muted">
            Pre-built blocks for common dashboard layouts.
          </p>
        </div>
      </div>
    </div>
  )
}
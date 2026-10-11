"use client"

import {
  FileText,
  Upload,
  Send,
  AlertCircle,
  Pencil,
  UserPlus,
  UserMinus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActivityEntry } from "./report-types"

const KIND_ICON: Record<ActivityEntry["kind"], LucideIcon> = {
  created: FileText,
  generated: Upload,
  sent: Send,
  failed: AlertCircle,
  updated: Pencil,
  "recipient-added": UserPlus,
  "recipient-removed": UserMinus,
}

const KIND_TONE: Record<ActivityEntry["kind"], string> = {
  created: "bg-bg-hover text-prism-muted",
  generated: "bg-accent-subtle text-prism-accent",
  sent: "bg-ok-subtle text-prism-ok",
  failed: "bg-danger-subtle text-prism-danger",
  updated: "bg-bg-hover text-prism-muted",
  "recipient-added": "bg-bg-hover text-prism-muted",
  "recipient-removed": "bg-bg-hover text-prism-muted",
}

export function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp)

  if (sorted.length === 0) {
    return (
      <p className="text-2xs text-prism-muted py-4">No activity yet.</p>
    )
  }

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => {
        const Icon = KIND_ICON[entry.kind] ?? FileText
        const tone = KIND_TONE[entry.kind] ?? KIND_TONE.created
        const isLast = i === sorted.length - 1
        return (
          <div key={entry.id} className="flex gap-3 relative">
            {/* Icon */}
            <div className="relative flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center",
                  tone
                )}
              >
                <Icon className="w-3 h-3" strokeWidth={2} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border my-1 min-h-[16px]" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 pb-3">
              <p className="text-xs text-prism-text leading-snug">
                {entry.message}
              </p>
              <p className="text-2xs text-prism-muted mt-0.5">
                {relativeTime(entry.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
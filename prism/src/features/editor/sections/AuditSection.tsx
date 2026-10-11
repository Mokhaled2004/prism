"use client"

import {
  FileEdit,
  Upload,
  Share2,
  UserPlus,
  Trash2,
  Download,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface AuditEvent {
  id: string
  icon: LucideIcon
  action: string
  actor: string
  time: string
}

const events: AuditEvent[] = [
  { id: "e1", icon: FileEdit, action: "Edited Sales Overview", actor: "Youssef", time: "2 minutes ago" },
  { id: "e2", icon: Share2, action: "Shared dashboard link", actor: "Youssef", time: "1 hour ago" },
  { id: "e3", icon: UserPlus, action: "Invited Sara Ahmed", actor: "Youssef", time: "yesterday" },
  { id: "e4", icon: Upload, action: "Published Executive Summary", actor: "Sara", time: "2 days ago" },
  { id: "e5", icon: Download, action: "Exported data as CSV", actor: "Omar", time: "3 days ago" },
  { id: "e6", icon: Trash2, action: "Deleted Q3 Report", actor: "Youssef", time: "1 week ago" },
]

export function AuditSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Audit log
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-0.5">
          {events.map((e) => {
            const Icon = e.icon
            return (
              <div key={e.id} className="flex items-start gap-2 py-1.5">
                <div className="w-6 h-6 rounded-md bg-bg-hover flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 text-prism-muted" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-prism-text leading-snug">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-prism-muted">{e.action}</span>
                  </p>
                  <p className="text-2xs text-prism-muted mt-0.5">{e.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
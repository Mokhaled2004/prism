"use client"

import Link from "next/link"
import { LayoutGrid, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { RelativeTime } from "@/components/ui/prism/RelativeTime"
import type { Dashboard } from "./types"

export interface DashboardCardProps {
  dashboard: Dashboard
  onDelete: () => void
  onRename?: () => void
}

export function DashboardCard({ dashboard, onDelete, onRename }: DashboardCardProps) {
  const updatedTs =
    typeof dashboard.updatedAt === "number"
      ? dashboard.updatedAt
      : new Date(dashboard.updatedAt).getTime()

  return (
    <div className="relative group bg-panel border border-border rounded-md p-4 hover:border-border-strong transition-colors">
      {/* Full-card link overlay */}
      <Link
        href={`/dashboard/${dashboard.slug || dashboard.id}/edit`}
        className="absolute inset-0 rounded-md z-0"
        aria-label={`Open ${dashboard.name}`}
      />

      {/* Top row: icon + status pill */}
      <div className="relative z-10 flex items-start justify-between pointer-events-none">
        <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
        </div>

        <span
          className={cn(
            "text-2xs px-2 py-0.5 rounded-full font-medium shrink-0",
            dashboard.isPublished
              ? "bg-accent-subtle text-prism-accent"
              : "bg-bg-hover text-prism-muted"
          )}
        >
          {dashboard.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Title */}
      <h3 className="relative z-10 mt-3 text-sm font-semibold text-prism-text-strong truncate pointer-events-none">
        {dashboard.name}
      </h3>

      {/* Bottom row: timestamp left, icons right */}
      <div className="relative z-10 mt-1 flex items-center justify-between">
        <p className="text-xs text-prism-muted pointer-events-none">
          Updated <RelativeTime ts={Number.isNaN(updatedTs) ? Date.now() : updatedTs} />
        </p>

        <div className="flex items-center gap-0.5">
          {onRename ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onRename()
              }}
              title="Rename dashboard"
              className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          ) : (
            <Link
              href={`/dashboard/${dashboard.slug || dashboard.id}/edit`}
              title="Edit"
              className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          )}

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
            title="Delete dashboard"
            className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-danger hover:bg-bg-hover transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}

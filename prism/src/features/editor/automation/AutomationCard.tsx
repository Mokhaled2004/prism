"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AutomationCardProps {
  icon: LucideIcon
  iconTone?: "accent" | "danger" | "muted"
  title: string
  badge?: ReactNode
  meta: ReactNode
  right?: ReactNode
  /** Primary actions shown on the left of the action row */
  actions?: ReactNode
  /** Destructive actions shown on the right of the action row */
  destructiveActions?: ReactNode
  onClick?: () => void
  className?: string
}

export function AutomationCard({
  icon: Icon,
  iconTone = "muted",
  title,
  badge,
  meta,
  right,
  actions,
  destructiveActions,
  onClick,
  className,
}: AutomationCardProps) {
  const toneClass = {
    accent: "bg-accent-subtle text-prism-accent",
    danger: "bg-danger-subtle text-prism-danger",
    muted: "bg-bg-hover text-prism-muted",
  }[iconTone]

  const hasActions = actions || destructiveActions

  return (
    <div
      className={cn(
        "group rounded-md border border-border bg-panel transition-all",
        "hover:border-border-strong",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="p-3 flex items-start gap-2.5">
        <div
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
            toneClass
          )}
        >
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-medium text-prism-text-strong truncate">
              {title}
            </p>
            {badge}
          </div>
          <div className="mt-1 text-2xs text-prism-muted flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {meta}
          </div>
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>

      {hasActions && (
        <div className="px-2 py-1 border-t border-border flex items-center h-8">
          {/* Primary actions — left */}
          <div className="flex items-center gap-0.5">{actions}</div>

          {/* Destructive actions — right */}
          <div className="flex items-center gap-0.5 ml-auto">
            {destructiveActions}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Icon-only action with white floating tooltip ──────── */

export interface CardActionProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  tone?: "default" | "danger"
}

export function CardAction({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: CardActionProps) {
  return (
    <div className="relative group/action">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        className={cn(
          "w-7 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer",
          tone === "danger"
            ? "text-prism-muted hover:text-prism-danger hover:bg-danger-subtle"
            : "text-prism-muted hover:text-prism-text hover:bg-bg-hover"
        )}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>

      {/* White floating tooltip */}
      <span
        className={cn(
          "pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5",
          "px-2 py-1 rounded-md",
          "bg-panel border border-border shadow-md",
          "text-2xs font-medium text-prism-text-strong whitespace-nowrap",
          "opacity-0 group-hover/action:opacity-100",
          "transition-opacity duration-100",
          "z-[100]"
        )}
      >
        {label}
      </span>
    </div>
  )
}
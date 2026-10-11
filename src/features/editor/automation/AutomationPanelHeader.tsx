"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export interface AutomationPanelHeaderProps {
  title: string
  count?: number
  icon?: LucideIcon
  action?: ReactNode
  footer?: ReactNode
}

export function AutomationPanelHeader({
  title,
  count,
  icon: Icon,
  action,
}: AutomationPanelHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <div className="w-5 h-5 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
            <Icon className="w-3 h-3 text-prism-accent" strokeWidth={2} />
          </div>
        )}
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted truncate">
          {title}
          {typeof count === "number" && ` · ${count}`}
        </p>
      </div>
      {action}
    </div>
  )
}

export function PanelNewButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1 cursor-pointer shrink-0"
    >
      <svg
        className="w-2.5 h-2.5"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="6" y1="2" x2="6" y2="10" />
        <line x1="2" y1="6" x2="10" y2="6" />
      </svg>
      <span>{label}</span>
    </button>
  )
}
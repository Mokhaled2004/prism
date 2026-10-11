import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-prism-accent" strokeWidth={1.75} />
      </div>
      <h2 className="text-base font-semibold text-prism-text-strong mb-1">
        {title}
      </h2>
      <p className="text-sm text-prism-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
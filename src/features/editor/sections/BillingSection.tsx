"use client"

import { Check, ExternalLink } from "lucide-react"

export function BillingSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Billing
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="rounded-md border border-accent bg-accent-subtle/40 p-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-prism-accent">
                Current plan
              </p>
              <p className="text-sm font-semibold text-prism-text-strong mt-0.5">
                Pro
              </p>
            </div>
            <span className="text-xs font-medium text-prism-text-strong">
              $29<span className="text-prism-muted font-normal">/mo</span>
            </span>
          </div>
          <p className="text-2xs text-prism-muted">
            Renews on November 15, 2026
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            This month
          </p>
          <div className="space-y-2">
            <UsageBar label="Dashboards" used={4} total={20} />
            <UsageBar label="Datasets" used={2} total={10} />
            <UsageBar label="Team members" used={4} total={10} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Included in Pro
          </p>
          <ul className="space-y-1.5">
            <Feature>Up to 20 dashboards</Feature>
            <Feature>10 datasets per workspace</Feature>
            <Feature>Up to 10 team members</Feature>
            <Feature>PDF export and scheduling</Feature>
            <Feature>Custom themes and branding</Feature>
          </ul>
        </div>

        <div className="pt-2 border-t border-border">
          <button className="w-full h-8 rounded-md border border-border bg-panel text-prism-text text-xs font-medium hover:bg-bg-hover flex items-center justify-center gap-1.5">
            Manage billing
            <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}

function UsageBar({
  label,
  used,
  total,
}: {
  label: string
  used: number
  total: number
}) {
  const pct = Math.min(100, (used / total) * 100)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-prism-text">{label}</span>
        <span className="text-2xs text-prism-muted">
          {used} / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-hover overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <div className="w-3.5 h-3.5 rounded-full bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
        <Check className="w-2 h-2 text-prism-accent" strokeWidth={3} />
      </div>
      <span className="text-xs text-prism-text">{children}</span>
    </li>
  )
}
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard } from "lucide-react"
import { PrismButton } from "@/components/ui/prism/Button"
import { PlanBadge } from "@/features/billing/components/PlanBadge"
import { PLAN_DEFINITIONS, type PlanId } from "@/features/billing/plans"
import { upgradePlan } from "@/features/billing/services"
import { cn } from "@/lib/utils"

export default function BillingSettingsPage() {
  const [isPending, startTransition] = useTransition()
  const [activePlan, setActivePlan] = useState<PlanId>("free")
  const [feedback, setFeedback] = useState<string | null>(null)
  const orgId = "default-org"

  const currentDef = PLAN_DEFINITIONS[activePlan]

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === activePlan) return
    startTransition(async () => {
      try {
        await upgradePlan(orgId, planId)
        setActivePlan(planId)
        setFeedback(`Workspace plan successfully changed to ${PLAN_DEFINITIONS[planId].name}.`)
        setTimeout(() => setFeedback(null), 4000)
      } catch {
        setActivePlan(planId)
        setFeedback(`Plan set to ${PLAN_DEFINITIONS[planId].name}.`)
        setTimeout(() => setFeedback(null), 4000)
      }
    })
  }

  const formatLimit = (v: number) => (v === Infinity ? "Unlimited" : String(v))

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs text-prism-muted hover:text-prism-text mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Settings</span>
        </Link>

        <h1 className="text-xl font-semibold text-prism-text-strong">
          Billing & Plans
        </h1>
        <p className="text-sm text-prism-muted mt-1">
          Manage your subscription tier, limits, and team seats.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-accent-subtle text-prism-accent text-xs flex items-center gap-2 border border-accent/20">
          <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Notice about mock billing */}
      <div className="p-3.5 rounded-lg border border-border bg-panel text-xs flex items-start gap-3">
        <CreditCard className="w-4 h-4 text-prism-accent shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <p className="font-medium text-prism-text-strong">
            Payment integration coming soon. For now, plan changes apply immediately.
          </p>
          <p className="text-2xs text-prism-muted mt-0.5">
            Test upgrades and limit changes instantly without external checkout redirects.
          </p>
        </div>
      </div>

      {/* Current Plan Summary Card */}
      <div className="p-5 rounded-lg border border-border bg-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Current Tier
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <h2 className="text-lg font-semibold text-prism-text-strong">
              {currentDef.name} Plan
            </h2>
            <PlanBadge plan={activePlan} />
          </div>
          <p className="text-xs text-prism-muted mt-1">
            Includes up to {formatLimit(currentDef.maxDashboards)} dashboards,{" "}
            {formatLimit(currentDef.maxDatasources)} data sources, and{" "}
            {formatLimit(currentDef.maxSeats)} team seats.
          </p>
        </div>
        <div className="text-right sm:text-right">
          <p className="text-2xl font-bold text-prism-text-strong">
            {defPrice(currentDef.price)}
            <span className="text-xs font-normal text-prism-muted ml-1">/ month</span>
          </p>
        </div>
      </div>

      {/* Plan comparison grid */}
      <div>
        <h3 className="text-sm font-semibold text-prism-text-strong mb-3">
          Compare Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {(Object.keys(PLAN_DEFINITIONS) as PlanId[]).map((pid) => {
            const def = PLAN_DEFINITIONS[pid]
            const isCurrent = pid === activePlan

            return (
              <div
                key={pid}
                className={cn(
                  "p-4 rounded-lg border flex flex-col justify-between transition-all",
                  isCurrent
                    ? "bg-panel border-accent ring-1 ring-accent"
                    : "bg-panel border-border hover:border-border-strong"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-prism-text-strong">
                      {def.name}
                    </span>
                    {isCurrent && (
                      <span className="text-2xs font-semibold text-prism-accent uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-lg font-bold text-prism-text-strong mt-2">
                    {defPrice(def.price)}
                    <span className="text-2xs font-normal text-prism-muted ml-1">
                      {def.price !== null ? "/mo" : ""}
                    </span>
                  </p>

                  <div className="my-3 border-t border-border" />

                  <ul className="space-y-2 text-2xs text-prism-muted">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-prism-accent shrink-0" strokeWidth={2} />
                      <span>{formatLimit(def.maxDashboards)} Dashboards</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-prism-accent shrink-0" strokeWidth={2} />
                      <span>{formatLimit(def.maxDatasources)} Data Sources</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-prism-accent shrink-0" strokeWidth={2} />
                      <span>{formatLimit(def.maxSeats)} Team Seats</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <PrismButton
                    variant={isCurrent ? "outline" : "primary"}
                    size="sm"
                    className="w-full justify-center"
                    disabled={isPending || isCurrent}
                    onClick={() => handleSelectPlan(pid)}
                  >
                    {isCurrent ? "Current Plan" : `Switch to ${def.name}`}
                  </PrismButton>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function defPrice(p: number | null) {
  if (p === 0) return "$0"
  if (p === null) return "Custom"
  return `$${p}`
}

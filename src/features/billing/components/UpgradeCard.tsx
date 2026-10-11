"use client"

import { useState, useTransition } from "react"
import { Check, ArrowUpRight } from "lucide-react"
import { PlanBadge } from "./PlanBadge"
import { PLAN_DEFINITIONS, type PlanId } from "../plans"
import { upgradePlan } from "../services"
import { cn } from "@/lib/utils"

interface UpgradeCardProps {
  organizationId: string
  currentPlan: string
  usage?: {
    dashboards?: number
    datasources?: number
    seats?: number
  }
}

export function UpgradeCard({
  organizationId,
  currentPlan,
  usage = { dashboards: 4, datasources: 1, seats: 1 },
}: UpgradeCardProps) {
  const [isPending, startTransition] = useTransition()
  const [activePlan, setActivePlan] = useState<string>(currentPlan)
  const [feedback, setFeedback] = useState<string | null>(null)

  const activeKey = (activePlan as PlanId) in PLAN_DEFINITIONS ? (activePlan as PlanId) : "free"
  const currentDef = PLAN_DEFINITIONS[activeKey]

  const handleUpgrade = (targetPlan: PlanId) => {
    if (targetPlan === activeKey) return
    startTransition(async () => {
      try {
        await upgradePlan(organizationId, targetPlan)
        setActivePlan(targetPlan)
        setFeedback(`Switched to ${PLAN_DEFINITIONS[targetPlan].name} plan!`)
        setTimeout(() => setFeedback(null), 3000)
      } catch (err) {
        setFeedback(err instanceof Error ? err.message : "Failed to change plan")
      }
    })
  }

  const formatLimit = (val: number) => (val === Infinity ? "Unlimited" : val.toString())

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-prism-text-strong">
              Workspace Subscription
            </h3>
            <PlanBadge plan={activePlan} />
          </div>
          <p className="text-xs text-prism-muted mt-0.5">
            Manage your plan tier and resource allocations.
          </p>
        </div>
        {feedback && (
          <span className="text-2xs font-medium px-2.5 py-1 rounded-md bg-accent-subtle text-prism-accent animate-fade-in">
            {feedback}
          </span>
        )}
      </div>

      {/* Usage meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-md bg-bg border border-border">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Dashboards
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm font-semibold text-prism-text-strong">
              {usage.dashboards ?? 0}
            </span>
            <span className="text-2xs text-prism-muted">
              limit: {formatLimit(currentDef.maxDashboards)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-md bg-bg border border-border">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Data Sources
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm font-semibold text-prism-text-strong">
              {usage.datasources ?? 0}
            </span>
            <span className="text-2xs text-prism-muted">
              limit: {formatLimit(currentDef.maxDatasources)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-md bg-bg border border-border">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Team Seats
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm font-semibold text-prism-text-strong">
              {usage.seats ?? 0}
            </span>
            <span className="text-2xs text-prism-muted">
              limit: {formatLimit(currentDef.maxSeats)}
            </span>
          </div>
        </div>
      </div>

      {/* Plans selector buttons */}
      <div className="border-t border-border pt-4">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2.5">
          Available Plans (Instant Upgrade)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(PLAN_DEFINITIONS) as PlanId[]).map((pid) => {
            const def = PLAN_DEFINITIONS[pid]
            const isCurrent = pid === activeKey
            return (
              <button
                key={pid}
                type="button"
                disabled={isPending || isCurrent}
                onClick={() => handleUpgrade(pid)}
                className={cn(
                  "p-2.5 rounded-md border text-left transition-colors flex flex-col justify-between",
                  isCurrent
                    ? "border-accent bg-accent-subtle/30 cursor-default"
                    : "border-border bg-panel hover:bg-bg-hover hover:border-border-strong cursor-pointer",
                  isPending && "opacity-60 cursor-not-allowed"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-prism-text-strong">
                      {def.name}
                    </span>
                    {isCurrent && (
                      <Check className="w-3 h-3 text-prism-accent" strokeWidth={2.5} />
                    )}
                  </div>
                  <p className="text-2xs text-prism-muted mt-0.5">
                    {def.price === 0
                      ? "Free"
                      : def.price === null
                      ? "Custom"
                      : `$${def.price}/mo`}
                  </p>
                </div>
                <div className="mt-2 text-2xs font-medium">
                  {isCurrent ? (
                    <span className="text-prism-accent">Current plan</span>
                  ) : (
                    <span className="text-prism-text flex items-center gap-0.5">
                      Switch <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

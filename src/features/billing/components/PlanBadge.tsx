import { cn } from "@/lib/utils"
import type { PlanId } from "../plans"
import { PLAN_DEFINITIONS } from "../plans"

export function PlanBadge({ plan, className }: { plan: string; className?: string }) {
  const planKey = (plan as PlanId) in PLAN_DEFINITIONS ? (plan as PlanId) : "free"
  const planDef = PLAN_DEFINITIONS[planKey]

  const isFree = planKey === "free"
  const isEnterprise = planKey === "enterprise"

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold tracking-wide uppercase",
        isFree && "bg-bg-hover text-prism-muted border border-border",
        !isFree && !isEnterprise && "bg-accent-subtle text-prism-accent border border-accent/20",
        isEnterprise && "bg-panel-strong text-prism-text-strong border border-border-strong",
        className
      )}
    >
      {planDef.name}
    </span>
  )
}

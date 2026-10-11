import type { subscriptions } from "@/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import type { PLAN_DEFINITIONS } from "./plans"

export type Subscription = InferSelectModel<typeof subscriptions>

export type PlanId = keyof typeof PLAN_DEFINITIONS
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "inactive"

export interface PlanDefinition {
  name: string
  price: number | null
  maxDashboards: number
  maxDatasources: number
  maxSeats: number
}

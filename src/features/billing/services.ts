"use server"

import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PLAN_DEFINITIONS, type PlanId } from "./plans"
import type { Subscription } from "./types"
import { revalidatePath } from "next/cache"

export async function getSubscription(organizationId: string): Promise<Subscription> {
  if (!organizationId) {
    throw new Error("organizationId is required")
  }

  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId))
    .limit(1)

  if (existing.length > 0) {
    return existing[0]
  }

  // Create default free subscription if none exists
  const now = new Date()
  const [created] = await db
    .insert(subscriptions)
    .values({
      organizationId,
      plan: "free",
      status: "active",
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return created
}

export async function upgradePlan(organizationId: string, planId: PlanId): Promise<Subscription> {
  if (!organizationId) {
    throw new Error("organizationId is required")
  }

  const now = new Date()
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId))
    .limit(1)

  let result: Subscription
  if (existing.length > 0) {
    const [updated] = await db
      .update(subscriptions)
      .set({
        plan: planId,
        status: "active",
        updatedAt: now,
      })
      .where(eq(subscriptions.organizationId, organizationId))
      .returning()
    result = updated
  } else {
    const [created] = await db
      .insert(subscriptions)
      .values({
        organizationId,
        plan: planId,
        status: "active",
        createdAt: now,
        updatedAt: now,
      })
      .returning()
    result = created
  }

  revalidatePath("/dashboard")
  revalidatePath("/settings/billing")
  return result
}

export type GatedFeature = "dashboards" | "datasources" | "seats"

export async function canUseFeature(
  organizationId: string,
  feature: GatedFeature,
  currentCount: number = 0
): Promise<{ allowed: boolean; limit: number; current: number; plan: PlanId }> {
  const sub = await getSubscription(organizationId)
  const plan = (sub.plan as PlanId) in PLAN_DEFINITIONS ? (sub.plan as PlanId) : "free"
  const limits = PLAN_DEFINITIONS[plan]

  let limit: number
  switch (feature) {
    case "dashboards":
      limit = limits.maxDashboards
      break
    case "datasources":
      limit = limits.maxDatasources
      break
    case "seats":
      limit = limits.maxSeats
      break
  }

  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
    plan,
  }
}

"use server"

import { db } from "@/db"
import { dashboards } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/features/auth/auth"
import { getActiveOrganizationForUser } from "@/features/auth/services/organizations"
import { revalidatePath } from "next/cache"
import type { Dashboard } from "./types"

async function getAuthenticatedUserAndOrg() {
  const reqHeaders = await headers()
  const authSession = await auth.api.getSession({ headers: reqHeaders })
  if (!authSession?.user?.id) {
    throw new Error("Unauthorized")
  }
  const org = await getActiveOrganizationForUser(authSession.user.id)
  if (!org) {
    throw new Error("No active organization found")
  }
  return { user: authSession.user, org }
}

export async function listDashboards(): Promise<Dashboard[]> {
  const { org } = await getAuthenticatedUserAndOrg()
  const list = await db
    .select()
    .from(dashboards)
    .where(eq(dashboards.organizationId, org.id))
    .orderBy(desc(dashboards.updatedAt))

  return list as Dashboard[]
}

export async function getDashboard(id: string): Promise<Dashboard | null> {
  const { org } = await getAuthenticatedUserAndOrg()
  const list = await db
    .select()
    .from(dashboards)
    .where(and(eq(dashboards.id, id), eq(dashboards.organizationId, org.id)))
    .limit(1)

  return (list[0] as Dashboard) ?? null
}

export async function createDashboard(input: { name: string }): Promise<Dashboard> {
  const { user, org } = await getAuthenticatedUserAndOrg()
  const trimmed = input.name.trim()
  if (!trimmed) {
    throw new Error("Dashboard name is required")
  }

  const baseSlug =
    trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "dashboard"
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  const slug = `${baseSlug}-${randomSuffix}`

  const now = new Date()
  const [created] = await db
    .insert(dashboards)
    .values({
      id: crypto.randomUUID(),
      organizationId: org.id,
      name: trimmed,
      slug,
      description: null,
      config: {},
      isPublished: false,
      createdBy: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  revalidatePath("/dashboard")
  return created as Dashboard
}

export async function renameDashboard(input: { id: string; name: string }): Promise<Dashboard> {
  const { org } = await getAuthenticatedUserAndOrg()
  const trimmed = input.name.trim()
  if (!trimmed) {
    throw new Error("Dashboard name cannot be empty")
  }

  const existing = await db
    .select()
    .from(dashboards)
    .where(and(eq(dashboards.id, input.id), eq(dashboards.organizationId, org.id)))
    .limit(1)

  if (existing.length === 0) {
    throw new Error("Dashboard not found")
  }

  const [updated] = await db
    .update(dashboards)
    .set({
      name: trimmed,
      updatedAt: new Date(),
    })
    .where(and(eq(dashboards.id, input.id), eq(dashboards.organizationId, org.id)))
    .returning()

  revalidatePath("/dashboard")
  return updated as Dashboard
}

export async function deleteDashboard(input: { id: string }): Promise<void> {
  const { org } = await getAuthenticatedUserAndOrg()
  await db
    .delete(dashboards)
    .where(and(eq(dashboards.id, input.id), eq(dashboards.organizationId, org.id)))

  revalidatePath("/dashboard")
}

export async function togglePublish(input: { id: string }): Promise<Dashboard> {
  const { org } = await getAuthenticatedUserAndOrg()
  const existing = await db
    .select()
    .from(dashboards)
    .where(and(eq(dashboards.id, input.id), eq(dashboards.organizationId, org.id)))
    .limit(1)

  if (existing.length === 0) {
    throw new Error("Dashboard not found")
  }

  const [updated] = await db
    .update(dashboards)
    .set({
      isPublished: !existing[0].isPublished,
      updatedAt: new Date(),
    })
    .where(and(eq(dashboards.id, input.id), eq(dashboards.organizationId, org.id)))
    .returning()

  revalidatePath("/dashboard")
  return updated as Dashboard
}

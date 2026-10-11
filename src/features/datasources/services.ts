"use server"

import { db } from "@/db"
import { dataSources } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/features/auth/auth"
import { getActiveOrganizationForUser } from "@/features/auth/services/organizations"
import { revalidatePath } from "next/cache"
import type { DataSource } from "./types"

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

export async function listDataSources(): Promise<DataSource[]> {
  const { org } = await getAuthenticatedUserAndOrg()
  const list = await db
    .select()
    .from(dataSources)
    .where(eq(dataSources.organizationId, org.id))
    .orderBy(desc(dataSources.updatedAt))

  return list as DataSource[]
}

export async function createDataSource(input: { name: string; type: string }): Promise<DataSource> {
  const { user, org } = await getAuthenticatedUserAndOrg()
  const trimmed = input.name.trim()
  if (!trimmed) {
    throw new Error("Data source name is required")
  }

  const now = new Date()
  const [created] = await db
    .insert(dataSources)
    .values({
      id: crypto.randomUUID(),
      organizationId: org.id,
      name: trimmed,
      type: input.type || "csv",
      config: {},
      createdBy: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  revalidatePath("/dashboard")
  revalidatePath("/sources")
  return created as DataSource
}

export async function deleteDataSource(input: { id: string }): Promise<void> {
  const { org } = await getAuthenticatedUserAndOrg()
  await db
    .delete(dataSources)
    .where(and(eq(dataSources.id, input.id), eq(dataSources.organizationId, org.id)))

  revalidatePath("/dashboard")
  revalidatePath("/sources")
}

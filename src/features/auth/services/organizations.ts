"use server"

import { db } from "@/db"
import { organization, member, invitation, subscriptions, session as sessionTable } from "@/db/schema"
import { eq, and, count } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "../auth"
import { revalidatePath } from "next/cache"

export async function createDefaultOrganization(
  userId: string,
  userName?: string | null,
  userEmail?: string | null
) {
  const baseName = userName?.trim() || (userEmail ? userEmail.split("@")[0] : "User")
  const orgName = `${baseName}'s Organization`
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  const orgSlug = `${baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "org"}-${randomSuffix}`

  const orgId = crypto.randomUUID()
  const now = new Date()

  const [newOrg] = await db
    .insert(organization)
    .values({
      id: orgId,
      name: orgName,
      slug: orgSlug,
      createdAt: now,
    })
    .returning()

  await db.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: orgId,
    userId,
    role: "owner",
    createdAt: now,
  })

  await db.insert(subscriptions).values({
    organizationId: orgId,
    plan: "free",
    status: "active",
    createdAt: now,
    updatedAt: now,
  })

  return newOrg
}

export async function createOrganizationAction(formData: { name: string; slug?: string }) {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const name = formData.name.trim()
  if (!name) throw new Error("Organization name is required")

  const randomSuffix = Math.random().toString(36).substring(2, 7)
  const slug =
    formData.slug?.trim() ||
    `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "org"}-${randomSuffix}`

  const orgId = crypto.randomUUID()
  const now = new Date()

  const [newOrg] = await db
    .insert(organization)
    .values({
      id: orgId,
      name,
      slug,
      createdAt: now,
    })
    .returning()

  await db.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: orgId,
    userId: session.user.id,
    role: "owner",
    createdAt: now,
  })

  await db.insert(subscriptions).values({
    organizationId: orgId,
    plan: "free",
    status: "active",
    createdAt: now,
    updatedAt: now,
  })

  // Set the new organization as active
  try {
    if (session.session?.id) {
      await db
        .update(sessionTable)
        .set({ activeOrganizationId: orgId, updatedAt: new Date() })
        .where(eq(sessionTable.id, session.session.id))
    }
  } catch (e) {
    console.warn("Could not set newly created org as active on session:", e)
  }

  revalidatePath("/dashboard")
  revalidatePath("/settings/organization")
  return newOrg
}

export async function updateOrganizationAction(organizationId: string, name: string) {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const trimmed = name.trim()
  if (!trimmed) throw new Error("Organization name cannot be empty")

  const userMember = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.organizationId, organizationId),
        eq(member.userId, session.user.id)
      )
    )
    .limit(1)

  if (userMember.length === 0 || !["owner", "admin"].includes(userMember[0].role)) {
    throw new Error("Only organization owners and admins can rename the organization")
  }

  const [updated] = await db
    .update(organization)
    .set({
      name: trimmed,
    })
    .where(eq(organization.id, organizationId))
    .returning()

  revalidatePath("/settings/organization")
  revalidatePath("/dashboard")
  return updated
}

export async function inviteMemberAction(organizationId: string, email: string, role: string = "member") {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedEmail) throw new Error("Email is required")

  const [inv] = await db
    .insert(invitation)
    .values({
      id: crypto.randomUUID(),
      organizationId,
      email: trimmedEmail,
      role,
      status: "pending",
      inviterId: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    })
    .returning()

  revalidatePath("/settings/members")
  return inv
}

export async function getUserOrganizations(userId: string) {
  const members = await db
    .select({
      org: organization,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))

  return members
}

export async function getActiveOrganizationForUser(userId: string) {
  let activeOrgId: string | null = null

  try {
    const reqHeaders = await headers()
    const authSession = await auth.api.getSession({ headers: reqHeaders })
    if (authSession?.session?.activeOrganizationId) {
      activeOrgId = authSession.session.activeOrganizationId
    }
  } catch (err) {
    console.warn("Could not retrieve session headers in getActiveOrganizationForUser:", err)
  }

  if (activeOrgId) {
    const activeMember = await db
      .select({
        org: organization,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(and(eq(member.userId, userId), eq(member.organizationId, activeOrgId)))
      .limit(1)

    if (activeMember.length > 0) {
      return activeMember[0].org
    }
  }

  // Fallback to first membership
  const memberships = await db
    .select({
      org: organization,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))
    .limit(1)

  return memberships[0]?.org ?? null
}

export async function setActiveOrganization(orgId: string) {
  const reqHeaders = await headers()
  const authSession = await auth.api.getSession({ headers: reqHeaders })
  if (!authSession?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Verify membership
  const isMember = await db
    .select({ id: member.id })
    .from(member)
    .where(and(eq(member.userId, authSession.user.id), eq(member.organizationId, orgId)))
    .limit(1)

  if (isMember.length === 0) {
    throw new Error("You are not a member of this organization")
  }

  // Update session table
  if (authSession.session?.id) {
    await db
      .update(sessionTable)
      .set({
        activeOrganizationId: orgId,
        updatedAt: new Date(),
      })
      .where(eq(sessionTable.id, authSession.session.id))
  }

  // Also call Better Auth API endpoint if available
  try {
    await auth.api.setActiveOrganization({
      body: { organizationId: orgId },
      headers: reqHeaders,
    })
  } catch (err) {
    // DB update above guarantees persistence
  }

  revalidatePath("/dashboard")
  revalidatePath("/", "layout")
  return { success: true, organizationId: orgId }
}

export async function getMemberCount(organizationId: string): Promise<number> {
  const result = await db
    .select({ value: count() })
    .from(member)
    .where(eq(member.organizationId, organizationId))

  return Number(result[0]?.value ?? 0)
}

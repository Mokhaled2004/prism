import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/features/auth/auth"
import {
  getUserOrganizations,
  getActiveOrganizationForUser,
  createDefaultOrganization,
} from "@/features/auth/services/organizations"
import { getSubscription } from "@/features/billing/services"
import { AppShell } from "@/components/layout/AppShell"
import { PageLoader } from "@/components/ui/prism/PageLoader"

async function AppLayoutInner({ children }: { children: React.ReactNode }) {
  let session = null

  try {
    const reqHeaders = await headers()
    session = await auth.api.getSession({ headers: reqHeaders })
  } catch (err) {
    console.error("Auth session check error:", err)
    redirect("/sign-in")
  }

  if (!session?.user) {
    redirect("/sign-in")
  }

  let memberships: Awaited<ReturnType<typeof getUserOrganizations>> = []
  try {
    memberships = await getUserOrganizations(session.user.id)
  } catch (err) {
    console.error("Error fetching user organizations:", err)
  }

  if (memberships.length === 0) {
    try {
      const newOrg = await createDefaultOrganization(
        session.user.id,
        session.user.name,
        session.user.email
      )
      memberships = [{ org: newOrg, role: "owner" }]
    } catch {
      redirect("/welcome")
    }
  }

  let activeOrg = await getActiveOrganizationForUser(session.user.id)
  if (!activeOrg) {
    activeOrg = memberships[0].org
  }

  let subPlan = "free"

  try {
    const sub = await getSubscription(activeOrg.id)
    if (sub?.plan) subPlan = sub.plan
  } catch (err) {
    console.error("Error fetching subscription:", err)
  }

  const orgList = memberships.map((m) => ({
    id: m.org.id,
    name: m.org.name,
    plan: m.org.id === activeOrg.id ? subPlan : undefined,
  }))

  const currentOrg = {
    id: activeOrg.id,
    name: activeOrg.name,
    plan: subPlan,
  }

  return (
    <AppShell
      user={session.user}
      organization={currentOrg}
      organizations={orgList}
      activeOrganizationId={activeOrg.id}
    >
      {children}
    </AppShell>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppLayoutInner>{children}</AppLayoutInner>
    </Suspense>
  )
}

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/features/auth/auth"
import { getActiveOrganizationForUser } from "@/features/auth/services/organizations"
import { getSubscription } from "@/features/billing/services"
import { BillingPageClient } from "./BillingPageClient"

export default async function BillingSettingsPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const activeOrg = await getActiveOrganizationForUser(session.user.id)
  if (!activeOrg) {
    redirect("/welcome")
  }

  const sub = await getSubscription(activeOrg.id)

  return (
    <BillingPageClient
      organizationId={activeOrg.id}
      initialPlan={sub.plan}
    />
  )
}

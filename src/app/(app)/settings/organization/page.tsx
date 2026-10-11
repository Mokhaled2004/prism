import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/features/auth/auth"
import { getActiveOrganizationForUser } from "@/features/auth/services/organizations"
import { OrganizationSettingsClient } from "./OrganizationSettingsClient"

export default async function OrganizationSettingsPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const activeOrg = await getActiveOrganizationForUser(session.user.id)
  if (!activeOrg) {
    redirect("/welcome")
  }

  return <OrganizationSettingsClient organization={activeOrg} />
}

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/features/auth/auth"
import { getActiveOrganizationForUser, getMemberCount } from "@/features/auth/services/organizations"
import { listDashboards } from "@/features/dashboards/services"
import { listDataSources } from "@/features/datasources/services"
import { getSubscription } from "@/features/billing/services"
import { DashboardPageClient } from "@/features/dashboards/DashboardPageClient"

export default async function DashboardPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const activeOrg = await getActiveOrganizationForUser(session.user.id)
  if (!activeOrg) {
    redirect("/welcome")
  }

  const [dashboardsList, dataSourcesList, membersCount, sub] = await Promise.all([
    listDashboards(),
    listDataSources(),
    getMemberCount(activeOrg.id),
    getSubscription(activeOrg.id),
  ])

  return (
    <DashboardPageClient
      dashboards={dashboardsList}
      dataSources={dataSourcesList}
      memberCount={membersCount}
      subscription={sub}
      organization={activeOrg}
    />
  )
}

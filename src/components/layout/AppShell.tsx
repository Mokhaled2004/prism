import type { ReactNode } from "react"
import { AppSidebar, type AppSidebarProps } from "./AppSidebar"

export interface AppShellProps extends AppSidebarProps {
  children: ReactNode
}

export function AppShell({ children, user, organization, organizations }: AppShellProps) {
  return (
    <div className="flex h-dvh w-full bg-bg overflow-hidden">
      <AppSidebar user={user} organization={organization} organizations={organizations} />
      <main className="flex-1 min-w-0 overflow-auto bg-bg">{children}</main>
    </div>
  )
}

import type { ReactNode } from "react"
import { AppSidebar } from "./AppSidebar"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full bg-bg overflow-hidden">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto bg-bg">{children}</main>
    </div>
  )
}
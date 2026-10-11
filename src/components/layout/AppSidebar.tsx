"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import {
  LayoutGrid,
  Database,
  Table2,
  Sigma,
  Settings,
  Users,
  CreditCard,
  ScrollText,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrgSwitcher } from "./OrgSwitcher"
import { UserMenu } from "./UserMenu"

const STORAGE_KEY = "prism-sidebar-collapsed"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboards", href: "/dashboard", icon: LayoutGrid },
      { label: "Data sources", href: "/sources", icon: Database },
      { label: "Datasets", href: "/datasets", icon: Table2 },
      { label: "Calculations", href: "/calculations", icon: Sigma },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Members", href: "/settings/members", icon: Users },
      { label: "Billing", href: "/settings/billing", icon: CreditCard },
      { label: "Audit log", href: "/settings/audit", icon: ScrollText },
    ],
  },
]

export interface AppSidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  organization?: {
    id: string
    name: string
    plan?: string
  }
  organizations?: {
    id: string
    name: string
    plan?: string
  }[]
  activeOrganizationId?: string
}

function AppSidebarContent({ user, organization, organizations, activeOrganizationId }: AppSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "true") setCollapsed(true)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    window.localStorage.setItem(STORAGE_KEY, String(next))
  }

  if (!mounted) {
    return <aside className="w-[240px] shrink-0 bg-panel border-r border-border" />
  }

  return (
    <aside
      className={cn(
        "shrink-0 bg-panel border-r border-border flex flex-col transition-[width] duration-200 ease-out",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Brand + collapse toggle */}
      <div
        className={cn(
          "border-b border-border flex items-center",
          collapsed ? "h-[52px] px-2 justify-center" : "h-[52px] px-3 gap-1"
        )}
      >
        {collapsed ? (
          <button
            onClick={toggle}
            title="Expand sidebar"
            className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors"
          >
            <ChevronsRight className="w-4 h-4 text-prism-muted" strokeWidth={2} />
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-bg-hover transition-colors flex-1 min-w-0"
              title="Prism"
            >
              <img
                src="/logo.png"
                alt="Prism"
                className="w-6 h-6 shrink-0 object-contain"
              />
              <span className="text-sm font-semibold text-prism-text-strong tracking-tight truncate">
                Prism
              </span>
            </Link>
            <button
              onClick={toggle}
              title="Collapse sidebar"
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors shrink-0"
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-prism-muted" strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {/* Org switcher (expanded only) */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-border">
          <OrgSwitcher
            currentOrg={organization}
            organizations={organizations}
            activeOrganizationId={activeOrganizationId}
          />
        </div>
      )}

      {collapsed && (
        <div className="px-1.5 py-2 border-b border-border">
          <OrgSwitcher
            collapsed
            currentOrg={organization}
            organizations={organizations}
            activeOrganizationId={activeOrganizationId}
          />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map((section, i) => (
          <div key={i} className="mb-4">
            {section.title && !collapsed && (
              <p className="px-4 mb-1 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="mx-3 mb-2 h-px bg-border" />
            )}
            <div className={cn("space-y-0.5", collapsed ? "px-1.5" : "px-2")}>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "relative rounded-md flex items-center text-xs font-medium transition-colors",
                      collapsed
                        ? "h-9 w-9 mx-auto justify-center"
                        : "h-8 px-2 gap-2.5",
                      isActive
                        ? "bg-accent-subtle text-prism-accent"
                        : "text-prism-text hover:bg-bg-hover"
                    )}
                  >
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-accent" />
                    )}
                    <Icon
                      className="w-4 h-4 shrink-0"
                      strokeWidth={isActive ? 2.25 : 1.75}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className={cn("border-t border-border", collapsed ? "px-1.5 py-2" : "px-3 py-3")}>
        <UserMenu collapsed={collapsed} user={user} />
      </div>
    </aside>
  )
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Suspense fallback={<aside className="w-[240px] shrink-0 bg-panel border-r border-border" />}>
      <AppSidebarContent {...props} />
    </Suspense>
  )
}
"use client"

import {
  Layers,
  Plus,
  ListTree,
  Database,
  Sigma,
  LayoutTemplate,
  Users,
  CreditCard,
  ScrollText,
  FileText,
  CalendarClock,
  Bell,
  Sparkles,
  Settings,
  Palette,
  LogOut,
  User,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useEditor, type PanelSection } from "./store"

interface RailItem {
  id: PanelSection | "themes-modal"
  label: string
  icon: LucideIcon
}

const contentItems: RailItem[] = [
  { id: "sections", label: "Sections", icon: Layers },
  { id: "components", label: "Components", icon: Plus },
  { id: "outline", label: "Outline", icon: ListTree },
  { id: "data", label: "Data", icon: Database },
  { id: "calculations", label: "Calculations", icon: Sigma },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
]

const workspaceItems: RailItem[] = [
  { id: "members", label: "Members", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "audit", label: "Audit log", icon: ScrollText },
]

const automationItems: RailItem[] = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "scheduler", label: "Scheduler", icon: CalendarClock },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "ai", label: "AI Assistant", icon: Sparkles },
]

const bottomItems: RailItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "themes-modal", label: "Themes", icon: Palette },
]

export interface LeftRailProps {
  onOpenThemes: () => void
}

export function LeftRail({ onOpenThemes }: LeftRailProps) {
  const activeSection = useEditor((s) => s.activeSection)
  const panelOpen = useEditor((s) => s.panelOpen)
  const setSection = useEditor((s) => s.setSection)

  const handleClick = (item: RailItem) => {
    if (item.id === "themes-modal") {
      onOpenThemes()
      return
    }
    setSection(item.id as PanelSection)
  }

  const renderItem = (item: RailItem) => {
    const isActive =
      item.id !== "themes-modal" && activeSection === item.id && panelOpen
    return (
      <RailButton
        key={item.id}
        item={item}
        active={isActive}
        onClick={() => handleClick(item)}
      />
    )
  }

  return (
    <nav className="w-[56px] shrink-0 bg-panel border-r border-border flex flex-col items-center py-2">
      <div className="flex flex-col items-center gap-0.5 w-full">
        {contentItems.map(renderItem)}
      </div>

      <div className="w-6 h-px bg-border my-2" />

      <div className="flex flex-col items-center gap-0.5 w-full">
        {workspaceItems.map(renderItem)}
      </div>

      <div className="w-6 h-px bg-border my-2" />

      <div className="flex flex-col items-center gap-0.5 w-full">
        {automationItems.map(renderItem)}
      </div>

      <div className="flex-1" />

      <div className="w-6 h-px bg-border my-2" />

      <div className="flex flex-col items-center gap-0.5 w-full">
        {bottomItems.map(renderItem)}
      </div>

      <div className="mt-1">
        <UserRailMenu />
      </div>
    </nav>
  )
}

function RailButton({
  item,
  active,
  onClick,
}: {
  item: RailItem
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      title={item.label}
      className={cn(
        "relative w-10 h-10 rounded-md flex items-center justify-center transition-colors cursor-pointer",
        active
          ? "bg-accent-subtle text-prism-accent"
          : "text-prism-muted hover:text-prism-text hover:bg-bg-hover"
      )}
    >
      {active && (
        <span className="absolute -left-2 top-2 bottom-2 w-0.5 rounded-r bg-accent" />
      )}
      <Icon className="w-4 h-4" strokeWidth={active ? 2.25 : 1.75} />
    </button>
  )
}

function UserRailMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open])

  const user = { name: "Youssef", email: "youssef@acme.com", initial: "Y" }

  return (
    <div className="relative px-2" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={user.name}
        className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-accent text-prism-accent-text flex items-center justify-center text-2xs font-semibold">
          {user.initial}
        </div>
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-1 bg-panel border border-border rounded-md shadow-lg py-1 z-50 min-w-[200px]">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-prism-text-strong truncate">
              {user.name}
            </p>
            <p className="text-2xs text-prism-muted truncate">{user.email}</p>
          </div>
          <MenuItem label="Profile" icon={User} onClick={() => setOpen(false)} />
          <MenuItem
            label="Sign out"
            icon={LogOut}
            onClick={() => setOpen(false)}
            danger
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  label,
  icon: Icon,
  onClick,
  danger,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-7 px-3 flex items-center gap-2 text-xs text-left transition-colors cursor-pointer",
        danger
          ? "text-prism-danger hover:bg-bg-hover"
          : "text-prism-text hover:bg-bg-hover"
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
    </button>
  )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OrgItem {
  id: string
  name: string
  plan?: string
}

export interface OrgSwitcherProps {
  collapsed?: boolean
  organizations?: OrgItem[]
  currentOrg?: OrgItem
  onSelect?: (org: OrgItem) => void
}

const fallbackOrgs: OrgItem[] = [
  { id: "default", name: "My Workspace", plan: "Free" },
]

export function OrgSwitcher({
  collapsed = false,
  organizations = fallbackOrgs,
  currentOrg,
  onSelect,
}: OrgSwitcherProps) {
  const [open, setOpen] = useState(false)
  const list = organizations.length > 0 ? organizations : fallbackOrgs
  const [current, setCurrent] = useState<OrgItem>(currentOrg || list[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentOrg) {
      setCurrent(currentOrg)
    } else if (organizations.length > 0) {
      setCurrent(organizations[0])
    }
  }, [currentOrg, organizations])

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

  const handleSelect = (org: OrgItem) => {
    setCurrent(org)
    setOpen(false)
    onSelect?.(org)
  }

  if (collapsed) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          title={current.name}
          className="w-9 h-9 mx-auto rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold">
            {current.name.charAt(0).toUpperCase()}
          </div>
        </button>

        {open && (
          <div className="absolute left-full bottom-0 ml-1 bg-panel border border-border rounded-md shadow-lg py-1 z-50 min-w-[200px]">
            <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Organizations
            </p>
            {list.map((org) => {
              const isActive = current.id === org.id
              return (
                <button
                  key={org.id}
                  onClick={() => handleSelect(org)}
                  className={cn(
                    "w-full h-8 px-3 flex items-center gap-2 text-xs text-left transition-colors cursor-pointer",
                    isActive
                      ? "bg-accent-subtle text-prism-accent"
                      : "text-prism-text hover:bg-bg-hover"
                  )}
                >
                  <div className="w-4 h-4 rounded bg-bg-hover text-prism-text flex items-center justify-center text-2xs font-semibold shrink-0">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 truncate">{org.name}</span>
                  {isActive && <Check className="w-3 h-3 shrink-0" strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-8 px-2 rounded-md flex items-center gap-2 hover:bg-bg-hover transition-colors cursor-pointer"
      >
        <div className="w-5 h-5 rounded bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
          {current.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-medium text-prism-text-strong truncate leading-tight">
            {current.name}
          </p>
        </div>
        <ChevronsUpDown className="w-3 h-3 text-prism-muted shrink-0" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-panel border border-border rounded-md shadow-lg py-1 z-50">
          <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Organizations
          </p>
          {list.map((org) => {
            const isActive = current.id === org.id
            return (
              <button
                key={org.id}
                onClick={() => handleSelect(org)}
                className={cn(
                  "w-full h-8 px-3 flex items-center gap-2 text-xs text-left transition-colors cursor-pointer",
                  isActive
                    ? "bg-accent-subtle text-prism-accent"
                    : "text-prism-text hover:bg-bg-hover"
                )}
              >
                <div className="w-4 h-4 rounded bg-bg-hover text-prism-text flex items-center justify-center text-2xs font-semibold shrink-0">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 truncate">{org.name}</span>
                {isActive ? (
                  <Check className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                ) : (
                  org.plan && (
                    <span className="text-2xs text-prism-muted shrink-0 capitalize">
                      {org.plan}
                    </span>
                  )
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

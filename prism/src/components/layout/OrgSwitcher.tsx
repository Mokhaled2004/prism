"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Org {
  id: string
  name: string
  plan: string
}

const mockOrgs: Org[] = [
  { id: "acme", name: "Acme Inc.", plan: "Pro" },
  { id: "demo", name: "Demo Corp", plan: "Free" },
]

export function OrgSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(mockOrgs[0])
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

  if (collapsed) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          title={current.name}
          className="w-9 h-9 mx-auto rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors"
        >
          <div className="w-6 h-6 rounded bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold">
            {current.name.charAt(0)}
          </div>
        </button>

        {open && (
          <div className="absolute left-full bottom-0 ml-1 bg-panel border border-border rounded-md shadow-lg py-1 z-50 min-w-[200px]">
            <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Organizations
            </p>
            {mockOrgs.map((org) => {
              const isActive = current.id === org.id
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    setCurrent(org)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full h-8 px-3 flex items-center gap-2 text-xs text-left transition-colors",
                    isActive
                      ? "bg-accent-subtle text-prism-accent"
                      : "text-prism-text hover:bg-bg-hover"
                  )}
                >
                  <div className="w-4 h-4 rounded bg-bg-hover text-prism-text flex items-center justify-center text-2xs font-semibold shrink-0">
                    {org.name.charAt(0)}
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
        className="w-full h-8 px-2 rounded-md flex items-center gap-2 hover:bg-bg-hover transition-colors"
      >
        <div className="w-5 h-5 rounded bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
          {current.name.charAt(0)}
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
          {mockOrgs.map((org) => {
            const isActive = current.id === org.id
            return (
              <button
                key={org.id}
                onClick={() => {
                  setCurrent(org)
                  setOpen(false)
                }}
                className={cn(
                  "w-full h-8 px-3 flex items-center gap-2 text-xs text-left transition-colors",
                  isActive
                    ? "bg-accent-subtle text-prism-accent"
                    : "text-prism-text hover:bg-bg-hover"
                )}
              >
                <div className="w-4 h-4 rounded bg-bg-hover text-prism-text flex items-center justify-center text-2xs font-semibold shrink-0">
                  {org.name.charAt(0)}
                </div>
                <span className="flex-1 truncate">{org.name}</span>
                {isActive ? (
                  <Check className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                ) : (
                  <span className="text-2xs text-prism-muted shrink-0">
                    {org.plan}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
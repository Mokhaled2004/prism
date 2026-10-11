"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsUpDown, User, Settings, Keyboard, LogOut } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
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

  const user = {
    name: "Youssef",
    email: "youssef@acme.com",
    initial: "Y",
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={collapsed ? user.name : undefined}
        className={cn(
          "rounded-md flex items-center transition-colors hover:bg-bg-hover",
          collapsed
            ? "w-9 h-9 mx-auto justify-center"
            : "w-full h-9 px-2 gap-2"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-accent text-prism-accent-text flex items-center justify-center text-2xs font-semibold shrink-0">
          {user.initial}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-prism-text-strong truncate leading-tight">
                {user.name}
              </p>
              <p className="text-2xs text-prism-muted truncate leading-tight">
                {user.email}
              </p>
            </div>
            <ChevronsUpDown className="w-3 h-3 text-prism-muted shrink-0" strokeWidth={2} />
          </>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute bg-panel border border-border rounded-md shadow-lg py-1 z-50 min-w-[200px]",
            collapsed ? "left-full bottom-0 ml-1" : "left-0 right-0 bottom-full mb-1"
          )}
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-prism-text-strong truncate">
              {user.name}
            </p>
            <p className="text-2xs text-prism-muted truncate">{user.email}</p>
          </div>
          <MenuItem label="Profile" icon={User} onClick={() => setOpen(false)} />
          <MenuItem label="Preferences" icon={Settings} onClick={() => setOpen(false)} />
          <MenuItem label="Keyboard shortcuts" icon={Keyboard} onClick={() => setOpen(false)} />
          <div className="my-1 border-t border-border" />
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
        "w-full h-7 px-3 flex items-center gap-2 text-xs text-left transition-colors",
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
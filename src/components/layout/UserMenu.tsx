"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, User, Settings, LogOut } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/features/auth/auth-client"

export interface UserMenuProps {
  collapsed?: boolean
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ collapsed = false, user: propUser }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: session } = authClient.useSession()

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

  const currentUser = {
    name: propUser?.name || session?.user?.name || "User",
    email: propUser?.email || session?.user?.email || "user@prism.local",
    initial: (propUser?.name || session?.user?.name || "U").charAt(0).toUpperCase(),
  }

  const handleSignOut = async () => {
    setOpen(false)
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={collapsed ? currentUser.name : undefined}
        className={cn(
          "rounded-md flex items-center transition-colors hover:bg-bg-hover",
          collapsed
            ? "w-9 h-9 mx-auto justify-center"
            : "w-full h-9 px-2 gap-2"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-accent text-prism-accent-text flex items-center justify-center text-2xs font-semibold shrink-0">
          {currentUser.initial}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-prism-text-strong truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-2xs text-prism-muted truncate leading-tight">
                {currentUser.email}
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
              {currentUser.name}
            </p>
            <p className="text-2xs text-prism-muted truncate">{currentUser.email}</p>
          </div>
          <MenuItem
            label="Settings"
            icon={Settings}
            onClick={() => {
              setOpen(false)
              router.push("/settings")
            }}
          />
          <MenuItem
            label="Organization"
            icon={User}
            onClick={() => {
              setOpen(false)
              router.push("/settings/organization")
            }}
          />
          <div className="my-1 border-t border-border" />
          <MenuItem
            label="Sign out"
            icon={LogOut}
            onClick={handleSignOut}
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

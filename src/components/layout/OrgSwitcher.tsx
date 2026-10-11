"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { setActiveOrganization, createOrganizationAction } from "@/features/auth/services/organizations"
import { Modal } from "@/components/ui/prism/Modal"
import { PrismButton } from "@/components/ui/prism/Button"

export interface OrgItem {
  id: string
  name: string
  plan?: string
}

export interface OrgSwitcherProps {
  collapsed?: boolean
  organizations?: OrgItem[]
  currentOrg?: OrgItem
  activeOrganizationId?: string
  onSwitch?: (org: OrgItem) => void
}

const fallbackOrgs: OrgItem[] = [
  { id: "default", name: "My Workspace", plan: "Free" },
]

export function OrgSwitcher({
  collapsed = false,
  organizations = fallbackOrgs,
  currentOrg,
  activeOrganizationId,
  onSwitch,
}: OrgSwitcherProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")
  const [isPending, startTransition] = useTransition()

  const list = organizations.length > 0 ? organizations : fallbackOrgs
  const activeId = activeOrganizationId || currentOrg?.id || list[0]?.id
  const current = list.find((o) => o.id === activeId) || currentOrg || list[0]
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

  const handleSelect = (org: OrgItem) => {
    if (org.id === current.id) {
      setOpen(false)
      return
    }

    startTransition(async () => {
      try {
        await setActiveOrganization(org.id)
        setOpen(false)
        onSwitch?.(org)
        router.refresh()
      } catch (err) {
        console.error("Failed to switch organization:", err)
      }
    })
  }

  const handleCreateOrg = () => {
    const trimmed = newOrgName.trim()
    if (!trimmed || isPending) return

    startTransition(async () => {
      try {
        const created = await createOrganizationAction({ name: trimmed })
        await setActiveOrganization(created.id)
        setCreateModalOpen(false)
        setNewOrgName("")
        setOpen(false)
        router.refresh()
      } catch (err) {
        console.error("Failed to create organization:", err)
      }
    })
  }

  return (
    <>
      <div className="relative" ref={ref}>
        {collapsed ? (
          <button
            onClick={() => setOpen((v) => !v)}
            title={current.name}
            className="w-9 h-9 mx-auto rounded-md flex items-center justify-center hover:bg-bg-hover transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold">
              {current.name.charAt(0).toUpperCase()}
            </div>
          </button>
        ) : (
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
        )}

        {open && (
          <div
            className={cn(
              "absolute bg-panel border border-border rounded-md shadow-lg py-1 z-50 min-w-[220px]",
              collapsed ? "left-full bottom-0 ml-1" : "left-0 right-0 top-full mt-1"
            )}
          >
            <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Organizations
            </p>
            <div className="max-h-56 overflow-y-auto">
              {list.map((org) => {
                const isActive = org.id === current.id
                return (
                  <button
                    key={org.id}
                    disabled={isPending}
                    onClick={() => handleSelect(org)}
                    className={cn(
                      "w-full h-8 px-3 flex items-center gap-2 text-xs text-left transition-colors cursor-pointer",
                      isActive
                        ? "bg-accent-subtle text-prism-accent"
                        : "text-prism-text hover:bg-bg-hover",
                      isPending && "opacity-60 cursor-not-allowed"
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

            <div className="my-1 border-t border-border" />

            <button
              onClick={() => {
                setOpen(false)
                setCreateModalOpen(true)
              }}
              className="w-full h-8 px-3 flex items-center gap-2 text-xs text-left text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              <span>Create new organization</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create new organization"
        description="Set up a workspace for your team dashboards and data sources."
        width="sm"
        footer={
          <>
            <PrismButton onClick={() => setCreateModalOpen(false)} disabled={isPending}>
              Cancel
            </PrismButton>
            <PrismButton
              variant="primary"
              onClick={handleCreateOrg}
              disabled={!newOrgName.trim() || isPending}
            >
              {isPending ? "Creating..." : "Create organization"}
            </PrismButton>
          </>
        }
      >
        <div className="space-y-1.5">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Organization name
          </label>
          <input
            autoFocus
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateOrg()
            }}
            placeholder="e.g. Acme MENA"
            className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      </Modal>
    </>
  )
}

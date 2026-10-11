"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, LayoutGrid, Search, Database, Users } from "lucide-react"
import { PrismButton } from "@/components/ui/prism/Button"
import { Modal } from "@/components/ui/prism/Modal"
import { EmptyState } from "@/components/ui/prism/EmptyState"
import { DashboardCard } from "./DashboardCard"
import type { Dashboard } from "./types"
import type { DataSource } from "@/features/datasources/types"
import type { Subscription } from "@/features/billing/types"
import { UpgradeCard } from "@/features/billing/components/UpgradeCard"
import { PLAN_DEFINITIONS, type PlanId } from "@/features/billing/plans"
import { createDashboard, renameDashboard, deleteDashboard } from "./services"
import { cn } from "@/lib/utils"

export interface DashboardPageClientProps {
  dashboards: Dashboard[]
  dataSources: DataSource[]
  memberCount: number
  subscription: Subscription
  organization: {
    id: string
    name: string
    slug: string
  }
}

export function DashboardPageClient({
  dashboards,
  dataSources,
  memberCount,
  subscription,
  organization,
}: DashboardPageClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<Dashboard | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Dashboard | null>(null)
  const [isPending, startTransition] = useTransition()

  const planKey = (subscription?.plan as PlanId) in PLAN_DEFINITIONS ? (subscription.plan as PlanId) : "free"
  const planDef = PLAN_DEFINITIONS[planKey]
  const formatLimit = (v: number) => (v === Infinity ? "Unlimited" : String(v))

  const kpis = [
    {
      label: "Dashboards",
      value: dashboards.length,
      limit: formatLimit(planDef.maxDashboards),
      icon: LayoutGrid,
    },
    {
      label: "Data sources",
      value: dataSources.length,
      limit: formatLimit(planDef.maxDatasources),
      icon: Database,
    },
    {
      label: "Team members",
      value: memberCount,
      limit: formatLimit(planDef.maxSeats),
      icon: Users,
    },
  ]

  const filtered = dashboards.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (name: string) => {
    startTransition(async () => {
      try {
        const created = await createDashboard({ name })
        setCreateOpen(false)
        router.push(`/dashboard/${created.slug || created.id}/edit`)
      } catch (err) {
        console.error("Failed to create dashboard:", err)
      }
    })
  }

  const handleRename = (name: string) => {
    if (!renameTarget) return
    startTransition(async () => {
      try {
        await renameDashboard({ id: renameTarget.id, name })
        setRenameTarget(null)
        router.refresh()
      } catch (err) {
        console.error("Failed to rename dashboard:", err)
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteDashboard({ id })
        setDeleteTarget(null)
        router.refresh()
      } catch (err) {
        console.error("Failed to delete dashboard:", err)
      }
    })
  }

  return (
    <div className="p-8 space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-semibold text-prism-text-strong">
          {organization.name}
        </h1>
        <p className="text-sm text-prism-muted mt-1">
          Visual analytics & distribution dashboard center
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="p-4 rounded-lg bg-panel border border-border flex items-center justify-between"
            >
              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-semibold text-prism-text-strong">
                    {kpi.value}
                  </span>
                  <span className="text-2xs text-prism-muted">
                    of {kpi.limit} limit
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Upgrade / Subscription Card */}
      <UpgradeCard
        organizationId={organization.id}
        currentPlan={subscription?.plan || "free"}
        usage={{
          dashboards: dashboards.length,
          datasources: dataSources.length,
          seats: memberCount,
        }}
      />

      {/* Dashboards Section Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <h2 className="text-base font-semibold text-prism-text-strong">
            Dashboards
          </h2>
          <p className="text-xs text-prism-muted mt-0.5">
            {dashboards.length} dashboard{dashboards.length === 1 ? "" : "s"} in this workspace
          </p>
        </div>
        <PrismButton variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
          <span>New dashboard</span>
        </PrismButton>
      </div>

      {/* Empty state */}
      {dashboards.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="No dashboards yet"
          description="Create your first dashboard to visualize your data and share it with your team."
          action={
            <PrismButton variant="primary" onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
              <span>Create your first dashboard</span>
            </PrismButton>
          }
        />
      )}

      {/* Search + Grid */}
      {dashboards.length > 0 && (
        <>
          <div className="max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prism-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dashboards..."
                className="w-full h-8 pl-9 pr-3 rounded-md border border-border bg-panel text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-prism-muted">
                No dashboards match &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((d) => (
                <DashboardCard
                  key={d.id}
                  dashboard={d}
                  onRename={() => setRenameTarget(d)}
                  onDelete={() => setDeleteTarget(d)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <CreateDashboardModal
        open={createOpen}
        isPending={isPending}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      {/* Rename modal */}
      <RenameDashboardModal
        dashboard={renameTarget}
        isPending={isPending}
        onClose={() => setRenameTarget(null)}
        onRename={handleRename}
      />

      {/* Delete confirm modal */}
      <DeleteDashboardModal
        dashboard={deleteTarget}
        isPending={isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => handleDelete(id)}
      />
    </div>
  )
}

/* ─── Create modal ─────────────────────────────────────────── */

function CreateDashboardModal({
  open,
  isPending,
  onClose,
  onCreate,
}: {
  open: boolean
  isPending: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (open) setName("")
  }, [open])

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed || isPending) return
    onCreate(trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New dashboard"
      description="Give it a name. You can rename it anytime."
      width="sm"
      footer={
        <>
          <PrismButton onClick={onClose} disabled={isPending}>Cancel</PrismButton>
          <PrismButton
            variant="primary"
            onClick={submit}
            disabled={!name.trim() || isPending}
          >
            {isPending ? "Creating..." : "Create dashboard"}
          </PrismButton>
        </>
      }
    >
      <div className="space-y-1.5">
        <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Dashboard name
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="e.g. Sales Overview"
          className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>
    </Modal>
  )
}

/* ─── Rename modal ─────────────────────────────────────────── */

function RenameDashboardModal({
  dashboard,
  isPending,
  onClose,
  onRename,
}: {
  dashboard: Dashboard | null
  isPending: boolean
  onClose: () => void
  onRename: (name: string) => void
}) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (dashboard) setName(dashboard.name)
  }, [dashboard])

  if (!dashboard) return null

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed || isPending) return
    onRename(trimmed)
  }

  return (
    <Modal
      open={!!dashboard}
      onClose={onClose}
      title="Rename dashboard"
      description="Update the display name for this dashboard."
      width="sm"
      footer={
        <>
          <PrismButton onClick={onClose} disabled={isPending}>Cancel</PrismButton>
          <PrismButton
            variant="primary"
            onClick={submit}
            disabled={!name.trim() || isPending}
          >
            {isPending ? "Saving..." : "Save name"}
          </PrismButton>
        </>
      }
    >
      <div className="space-y-1.5">
        <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Dashboard name
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="e.g. Sales Overview"
          className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>
    </Modal>
  )
}

/* ─── Delete confirm modal ─────────────────────────────────── */

function DeleteDashboardModal({
  dashboard,
  isPending,
  onClose,
  onConfirm,
}: {
  dashboard: Dashboard | null
  isPending: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}) {
  const [typed, setTyped] = useState("")

  useEffect(() => {
    if (dashboard) setTyped("")
  }, [dashboard])

  const matches = dashboard
    ? typed.trim().toLowerCase() === dashboard.name.toLowerCase()
    : false

  const confirm = () => {
    if (!dashboard || !matches || isPending) return
    onConfirm(dashboard.id)
  }

  if (!dashboard) return null

  const showError = typed.length > 0 && !matches

  return (
    <Modal
      open={!!dashboard}
      onClose={onClose}
      title="Delete dashboard?"
      description={`This will permanently delete "${dashboard.name}". This action cannot be undone.`}
      width="sm"
      footer={
        <>
          <PrismButton onClick={onClose} disabled={isPending}>Cancel</PrismButton>
          <PrismButton
            variant="danger"
            onClick={confirm}
            disabled={!matches || isPending}
          >
            {isPending ? "Deleting..." : "Delete dashboard"}
          </PrismButton>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-prism-muted">
          Any shared links to this dashboard will stop working.
        </p>

        <div className="space-y-1.5">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Type{" "}
            <span className="text-prism-text-strong font-bold">
              {dashboard.name}
            </span>{" "}
            to confirm
          </label>
          <input
            autoFocus
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches) confirm()
            }}
            placeholder={dashboard.name}
            className={cn(
              "w-full h-8 px-3 rounded-md border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:ring-1",
              showError
                ? "border-danger focus:border-danger focus:ring-danger"
                : "border-border focus:border-accent focus:ring-accent"
            )}
          />
          {showError && (
            <p className="text-2xs text-prism-danger">
              Name doesn&apos;t match
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}

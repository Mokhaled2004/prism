"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, LayoutGrid, Search, Database, Users } from "lucide-react"
import { PrismButton } from "@/components/ui/prism/Button"
import { Modal } from "@/components/ui/prism/Modal"
import { EmptyState } from "@/components/ui/prism/EmptyState"
import { DashboardCard } from "@/features/dashboards/DashboardCard"
import type { Dashboard } from "@/features/dashboards/types"
import { UpgradeCard } from "@/features/billing/components/UpgradeCard"
import { PLAN_DEFINITIONS, type PlanId } from "@/features/billing/plans"
import { authClient } from "@/features/auth/auth-client"
import { cn } from "@/lib/utils"

/* ─── Mock data (temp) ─────────────────────────────────────── */

const now = Date.now()

const mockDashboards: Dashboard[] = [
  { id: "sales-overview", name: "Sales Overview", isPublished: true, updatedAt: now - 1000 * 60 * 45 },
  { id: "exec-summary", name: "Executive Summary", isPublished: true, updatedAt: now - 1000 * 60 * 60 * 5 },
  { id: "distributor-performance", name: "Distributor Performance", isPublished: false, updatedAt: now - 1000 * 60 * 60 * 24 * 2 },
  { id: "product-analytics", name: "Product Analytics", isPublished: true, updatedAt: now - 1000 * 60 * 60 * 24 * 5 },
]

export default function DashboardsPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Dashboard | null>(null)

  const [orgName, setOrgName] = useState("My Workspace")
  const [orgId, setOrgId] = useState("default-org")
  const [plan, setPlan] = useState<PlanId>("free")

  useEffect(() => {
    if (session?.user?.name) {
      setOrgName(`${session.user.name}'s Organization`)
    }
  }, [session])

  const filtered = dashboards.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (name: string) => {
    const id =
      name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      "dashboard"

    const newDashboard: Dashboard = {
      id,
      name,
      isPublished: false,
      updatedAt: Date.now(),
    }

    setDashboards((prev) => [...prev, newDashboard])
    setCreateOpen(false)
    router.push(`/dashboard/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id))
    setDeleteTarget(null)
  }

  const planDef = PLAN_DEFINITIONS[plan]
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
      value: 1,
      limit: formatLimit(planDef.maxDatasources),
      icon: Database,
    },
    {
      label: "Team members",
      value: 1,
      limit: formatLimit(planDef.maxSeats),
      icon: Users,
    },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-semibold text-prism-text-strong">
          {orgName}
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
        organizationId={orgId}
        currentPlan={plan}
        usage={{
          dashboards: dashboards.length,
          datasources: 1,
          seats: 1,
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
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      {/* Delete confirm — type the name */}
      <DeleteDashboardModal
        dashboard={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => handleDelete(id)}
      />
    </div>
  )
}

/* ─── Create modal ─────────────────────────────────────────── */

function CreateDashboardModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (open) setName("")
  }, [open])

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
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
          <PrismButton onClick={onClose}>Cancel</PrismButton>
          <PrismButton
            variant="primary"
            onClick={submit}
            disabled={!name.trim()}
          >
            Create dashboard
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
  onClose,
  onConfirm,
}: {
  dashboard: Dashboard | null
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
    if (!dashboard || !matches) return
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
          <PrismButton onClick={onClose}>Cancel</PrismButton>
          <PrismButton
            variant="danger"
            onClick={confirm}
            disabled={!matches}
          >
            Delete dashboard
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

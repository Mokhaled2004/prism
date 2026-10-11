"use client"

import { useState } from "react"
import {
  Database,
  FileSpreadsheet,
  Plus,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  Table2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { ConnectSourceModal } from "../data-sources/ConnectSourceModal"
import { SourceDetail } from "../data-sources/SourceDetail"
import type { DataSource } from "../data-sources/types"

export function DataSection() {
  const dataSources = useEditor((s) => s.dataSources)
  const datasets = useEditor((s) => s.datasets)
  const activeSourceId = useEditor((s) => s.activeSourceId)
  const setActiveSourceId = useEditor((s) => s.setActiveSourceId)
  const addDataSource = useEditor((s) => s.addDataSource)

  const [connectOpen, setConnectOpen] = useState(false)

  const activeSource = dataSources.find((s) => s.id === activeSourceId)

  if (activeSource) {
    return (
      <SourceDetail
        source={activeSource}
        datasets={datasets.filter((d) => d.sourceId === activeSource.id)}
        onBack={() => setActiveSourceId(null)}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Data · {dataSources.length}
          </p>
          <button
            onClick={() => setConnectOpen(true)}
            className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1 cursor-pointer"
            title="Connect a data source"
          >
            <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
            <span>Connect</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {dataSources.length === 0 ? (
            <EmptyState onConnect={() => setConnectOpen(true)} />
          ) : (
            <div className="p-3 space-y-4">
              <div>
                <p className="px-1 mb-2 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                  Sources
                </p>
                <div className="space-y-1">
                  {dataSources.map((s) => (
                    <SourceRow
                      key={s.id}
                      source={s}
                      onClick={() => setActiveSourceId(s.id)}
                    />
                  ))}
                </div>
              </div>

              {datasets.length > 0 && (
                <div>
                  <p className="px-1 mb-2 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                    Datasets · {datasets.length}
                  </p>
                  <div className="space-y-1">
                    {datasets.map((d) => (
                      <div
                        key={d.id}
                        className="rounded-md border border-border bg-panel px-3 py-2 flex items-center gap-2 hover:border-border-strong transition-colors cursor-pointer"
                      >
                        <Table2
                          className="w-3.5 h-3.5 text-prism-muted shrink-0"
                          strokeWidth={1.75}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-prism-text-strong truncate">
                            {d.name}
                          </p>
                          <p className="text-2xs text-prism-muted">
                            {d.fieldCount} fields ·{" "}
                            {d.rowCount.toLocaleString()} rows
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConnectSourceModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConnect={(source) => {
          addDataSource(source)
          setConnectOpen(false)
        }}
      />
    </>
  )
}

function SourceRow({
  source,
  onClick,
}: {
  source: DataSource
  onClick: () => void
}) {
  const Icon = source.kind === "file" ? FileSpreadsheet : Database
  const StatusIcon =
    source.status === "connected" || source.status === "ready"
      ? Check
      : source.status === "error"
        ? AlertCircle
        : Loader2

  const statusColor =
    source.status === "connected" || source.status === "ready"
      ? "text-prism-ok"
      : source.status === "error"
        ? "text-prism-danger"
        : "text-prism-muted"

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-md border border-border bg-panel px-3 py-2.5 flex items-center gap-2.5 hover:border-border-strong transition-colors cursor-pointer group"
    >
      <div className="w-7 h-7 rounded-md bg-bg-hover flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-prism-muted" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-prism-text-strong truncate">
            {source.name}
          </p>
          <StatusIcon
            className={cn("w-3 h-3 shrink-0", statusColor)}
            strokeWidth={2.25}
          />
        </div>
        <p className="text-2xs text-prism-muted truncate mt-0.5">
          {source.kind === "file"
            ? `${source.columns} columns · ${source.rows?.toLocaleString()} rows`
            : `${source.kind} · ${source.tableCount ?? 0} tables`}
        </p>
      </div>

      <ChevronRight
        className="w-3.5 h-3.5 text-prism-muted group-hover:text-prism-text transition-colors shrink-0"
        strokeWidth={1.75}
      />
    </button>
  )
}

function EmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <Database className="w-6 h-6 text-prism-accent" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-prism-text-strong mb-1">
        No data sources yet
      </p>
      <p className="text-xs text-prism-muted mb-4 max-w-[220px]">
        Connect a Postgres database or upload a CSV/Excel file to get started.
      </p>
      <button
        onClick={onConnect}
        className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>Connect source</span>
      </button>
    </div>
  )
}
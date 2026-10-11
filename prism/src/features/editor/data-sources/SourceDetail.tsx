"use client"

import {
  ArrowLeft,
  Database,
  FileSpreadsheet,
  Trash2,
  Plus,
  Check,
  Table2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import type { DataSource, Dataset } from "./types"

export interface SourceDetailProps {
  source: DataSource
  datasets: Dataset[]
  onBack: () => void
}

export function SourceDetail({ source, datasets, onBack }: SourceDetailProps) {
  const removeDataSource = useEditor((s) => s.removeDataSource)
  const addDataset = useEditor((s) => s.addDataset)

  const Icon = source.kind === "file" ? FileSpreadsheet : Database

  const handleDelete = () => {
    removeDataSource(source.id)
    onBack()
  }

  const handleCreateDataset = () => {
    const dataset: Dataset = {
      id: `ds_${Math.random().toString(36).slice(2, 10)}`,
      name: `${source.name} dataset`,
      sourceId: source.id,
      fieldCount: source.columns ?? 10,
      rowCount: source.rows ?? 1000,
      createdAt: Date.now(),
    }
    addDataset(dataset)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover cursor-pointer shrink-0"
          title="Back to sources"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted truncate">
          {source.kind === "file" ? "File" : "Database"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-prism-accent" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-prism-text-strong truncate">
              {source.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3 text-prism-ok" strokeWidth={2.5} />
              <span className="text-2xs text-prism-muted">
                {source.status === "connected" ? "Connected" : "Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Connection
          </p>
          <div className="rounded-md border border-border bg-bg divide-y divide-border text-xs">
            {source.kind === "file" ? (
              <>
                <Row label="File name" value={source.fileName ?? "—"} />
                <Row
                  label="Size"
                  value={
                    source.fileSize
                      ? `${(source.fileSize / 1000).toFixed(1)} KB`
                      : "—"
                  }
                />
                <Row label="Columns" value={String(source.columns ?? 0)} />
                <Row
                  label="Rows"
                  value={(source.rows ?? 0).toLocaleString()}
                />
              </>
            ) : (
              <>
                <Row label="Host" value={source.host ?? "—"} mono />
                <Row label="Port" value={String(source.port ?? 5432)} />
                <Row label="Database" value={source.database ?? "—"} />
                <Row label="User" value={source.username ?? "—"} />
                <Row label="SSL" value={source.ssl ? "Enabled" : "Disabled"} />
                <Row label="Tables" value={String(source.tableCount ?? 0)} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Datasets · {datasets.length}
            </p>
            <button
              onClick={handleCreateDataset}
              className="h-6 px-2 rounded-md text-2xs text-prism-muted hover:text-prism-text hover:bg-bg-hover flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
              <span>Create</span>
            </button>
          </div>

          {datasets.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-4 text-center">
              <p className="text-2xs text-prism-muted">
                No datasets yet — create one to use in dashboards.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="rounded-md border border-border bg-panel px-2.5 py-2 flex items-center gap-2"
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
                      {d.fieldCount} fields · {d.rowCount.toLocaleString()} rows
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border">
          <button
            onClick={handleDelete}
            className="w-full h-8 rounded-md border border-danger bg-danger-subtle text-prism-danger text-xs font-medium hover:brightness-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Disconnect source</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-prism-muted text-2xs">{label}</span>
      <span
        className={cn(
          "text-prism-text text-2xs truncate ml-2",
          mono && "font-mono"
        )}
      >
        {value}
      </span>
    </div>
  )
}
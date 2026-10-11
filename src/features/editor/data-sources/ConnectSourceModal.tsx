"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Database,
  FileSpreadsheet,
  Server,
  Cloud,
  Check,
  Upload,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DataSource, DataSourceKind } from "./types"
import { KIND_LABELS } from "./types"

export interface ConnectSourceModalProps {
  open: boolean
  onClose: () => void
  onConnect: (source: DataSource) => void
}

type Step = "pick" | "postgres" | "file" | "testing" | "done"

export function ConnectSourceModal({
  open,
  onClose,
  onConnect,
}: ConnectSourceModalProps) {
  const [step, setStep] = useState<Step>("pick")
  const [error, setError] = useState<string | null>(null)

  // Postgres form
  const [pgHost, setPgHost] = useState("")
  const [pgPort, setPgPort] = useState("5432")
  const [pgDatabase, setPgDatabase] = useState("")
  const [pgUser, setPgUser] = useState("")
  const [pgPassword, setPgPassword] = useState("")
  const [pgSsl, setPgSsl] = useState(true)
  const [pgName, setPgName] = useState("")

  // File form
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [fileColumns, setFileColumns] = useState(0)
  const [fileRows, setFileRows] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setStep("pick")
      setError(null)
      setPgHost("")
      setPgPort("5432")
      setPgDatabase("")
      setPgUser("")
      setPgPassword("")
      setPgSsl(true)
      setPgName("")
      setFileName("")
      setFileSize(0)
      setFileColumns(0)
      setFileRows(0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "testing") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, step, onClose])

  if (!open) return null

  const handlePostgresConnect = () => {
    if (!pgHost.trim() || !pgDatabase.trim() || !pgUser.trim()) {
      setError("Host, database, and username are required")
      return
    }
    setError(null)
    setStep("testing")

    // Fake test — swap for a real fetch later
    setTimeout(() => {
      const source: DataSource = {
        id: `src_${Math.random().toString(36).slice(2, 10)}`,
        name: pgName.trim() || `${pgDatabase} (Postgres)`,
        kind: "postgres",
        status: "connected",
        host: pgHost.trim(),
        port: Number(pgPort) || 5432,
        database: pgDatabase.trim(),
        username: pgUser.trim(),
        ssl: pgSsl,
        createdAt: Date.now(),
        lastTestedAt: Date.now(),
        tableCount: 12 + Math.floor(Math.random() * 20),
      }
      onConnect(source)
      setStep("done")
      setTimeout(() => onClose(), 800)
    }, 1500)
  }

  const handleFilePicked = (file: File) => {
    setFileName(file.name)
    setFileSize(file.size)
    // Fake parse
    setFileColumns(6 + Math.floor(Math.random() * 6))
    setFileRows(200 + Math.floor(Math.random() * 3000))
  }

  const handleFileConnect = () => {
    if (!fileName) {
      setError("Please choose a file first")
      return
    }
    setError(null)
    setStep("testing")

    setTimeout(() => {
      const source: DataSource = {
        id: `src_${Math.random().toString(36).slice(2, 10)}`,
        name: fileName,
        kind: "file",
        status: "ready",
        fileName,
        fileSize,
        columns: fileColumns,
        rows: fileRows,
        createdAt: Date.now(),
      }
      onConnect(source)
      setStep("done")
      setTimeout(() => onClose(), 800)
    }, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={step === "testing" ? undefined : onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {step === "postgres" || step === "file" ? (
              <button
                onClick={() => setStep("pick")}
                className="w-7 h-7 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
            ) : null}
            <div>
              <h2 className="text-sm font-semibold text-prism-text-strong">
                {step === "pick" && "Connect data source"}
                {step === "postgres" && "Connect PostgreSQL"}
                {step === "file" && "Upload CSV or Excel"}
                {step === "testing" && "Testing connection…"}
                {step === "done" && "Connected"}
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                {step === "pick" && "Choose a source to connect"}
                {step === "postgres" && "Enter your database credentials"}
                {step === "file" && "Choose a file to import"}
                {step === "testing" && "Please wait"}
                {step === "done" && "Data source added"}
              </p>
            </div>
          </div>
          {step !== "testing" && (
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0 cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {step === "pick" && (
            <div className="space-y-3">
              <SourceTile
                icon={Database}
                title="PostgreSQL"
                description="Connect to a Postgres database"
                badge="Available"
                onClick={() => setStep("postgres")}
              />
              <SourceTile
                icon={FileSpreadsheet}
                title="CSV / Excel"
                description="Upload a .csv, .xlsx, or .xls file"
                badge="Available"
                onClick={() => setStep("file")}
              />
              <div className="pt-3 mt-3 border-t border-border">
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  Coming soon
                </p>
                <div className="space-y-2">
                  <SourceTile
                    icon={Server}
                    title="MySQL"
                    description="Not available yet"
                    badge="Soon"
                    disabled
                  />
                  <SourceTile
                    icon={Cloud}
                    title="REST API"
                    description="Not available yet"
                    badge="Soon"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {step === "postgres" && (
            <div className="space-y-4">
              <Field label="Display name (optional)">
                <input
                  type="text"
                  value={pgName}
                  onChange={(e) => setPgName(e.target.value)}
                  placeholder="e.g. Production DB"
                  className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Field label="Host">
                    <input
                      type="text"
                      value={pgHost}
                      onChange={(e) => setPgHost(e.target.value)}
                      placeholder="db.example.com"
                      className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                    />
                  </Field>
                </div>
                <Field label="Port">
                  <input
                    type="text"
                    value={pgPort}
                    onChange={(e) => setPgPort(e.target.value)}
                    placeholder="5432"
                    className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                  />
                </Field>
              </div>

              <Field label="Database">
                <input
                  type="text"
                  value={pgDatabase}
                  onChange={(e) => setPgDatabase(e.target.value)}
                  placeholder="analytics"
                  className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                />
              </Field>

              <Field label="Username">
                <input
                  type="text"
                  value={pgUser}
                  onChange={(e) => setPgUser(e.target.value)}
                  placeholder="readonly"
                  className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  value={pgPassword}
                  onChange={(e) => setPgPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                />
              </Field>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pgSsl}
                  onChange={(e) => setPgSsl(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-border accent-[var(--accent)]"
                />
                <span className="text-xs text-prism-text">
                  Use SSL / TLS
                </span>
              </label>

              {error && (
                <p className="text-2xs text-prism-danger">{error}</p>
              )}
            </div>
          )}

          {step === "file" && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFilePicked(f)
                }}
              />

              {!fileName ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-accent-subtle/30 transition-colors p-8 flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                    <Upload className="w-5 h-5 text-prism-muted" strokeWidth={1.75} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-prism-text-strong">
                      Drop a file or click to browse
                    </p>
                    <p className="text-2xs text-prism-muted mt-1">
                      .csv, .xlsx, or .xls · Max 50 MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="rounded-lg border border-border bg-bg p-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-prism-text-strong truncate">
                        {fileName}
                      </p>
                      <p className="text-2xs text-prism-muted">
                        {(fileSize / 1000).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFileName("")
                        setFileSize(0)
                      }}
                      className="text-2xs text-prism-muted hover:text-prism-danger cursor-pointer"
                    >
                      Replace
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <Stat label="Columns" value={String(fileColumns)} />
                    <Stat label="Rows (est.)" value={String(fileRows)} />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-2xs text-prism-danger">{error}</p>
              )}
            </div>
          )}

          {step === "testing" && (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader2
                className="w-8 h-8 text-prism-accent animate-spin"
                strokeWidth={2}
              />
              <p className="text-xs text-prism-text">Testing connection…</p>
              <p className="text-2xs text-prism-muted">
                This usually takes a second
              </p>
            </div>
          )}

          {step === "done" && (
            <div className="py-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center">
                <Check className="w-6 h-6 text-prism-accent" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-medium text-prism-text-strong">
                Data source connected
              </p>
              <p className="text-2xs text-prism-muted">
                It's now available in your Data panel
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {(step === "postgres" || step === "file") && (
          <div className="px-5 py-3 border-t border-border bg-bg-hover flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={() => setStep("pick")}
              className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={step === "postgres" ? handlePostgresConnect : handleFileConnect}
              className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover cursor-pointer"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
        {label}
      </label>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xs text-prism-muted">{label}</p>
      <p className="text-xs font-medium text-prism-text-strong">{value}</p>
    </div>
  )
}

function SourceTile({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
  disabled,
}: {
  icon: any
  title: string
  description: string
  badge?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-lg border border-border bg-panel p-3 transition-colors flex items-center gap-3",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-accent hover:bg-accent-subtle cursor-pointer"
      )}
    >
      <div className="w-9 h-9 rounded-md bg-bg-hover flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-prism-muted" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-prism-text-strong">{title}</p>
          {badge && (
            <span
              className={cn(
                "text-2xs px-1.5 py-0.5 rounded-full font-medium",
                badge === "Available"
                  ? "bg-accent-subtle text-prism-accent"
                  : "bg-bg-hover text-prism-muted"
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-2xs text-prism-muted mt-0.5">{description}</p>
      </div>
    </button>
  )
}
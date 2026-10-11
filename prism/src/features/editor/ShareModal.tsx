"use client"

import { useEffect, useState } from "react"
import { X, Link2, Copy, Check, Users, Globe, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ShareModalProps {
  open: boolean
  onClose: () => void
  dashboardName?: string
}

type Visibility = "private" | "workspace" | "public"

export function ShareModal({
  open,
  onClose,
  dashboardName = "Sales Overview",
}: ShareModalProps) {
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [copied, setCopied] = useState(false)

  const link = `https://prism.app/d/${dashboardName
    .toLowerCase()
    .replace(/\s+/g, "-")}`

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setCopied(false)
      setVisibility("private")
    }
  }, [open])

  if (!open) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-prism-text-strong">
                Share dashboard
              </h2>
              <p className="text-xs text-prism-muted mt-0.5 truncate max-w-[280px]">
                {dashboardName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
          {/* Link */}
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
              Share link
            </p>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-9 px-3 rounded-md border border-border bg-bg flex items-center gap-2 min-w-0">
                <Link2 className="w-3.5 h-3.5 text-prism-muted shrink-0" />
                <span className="text-xs text-prism-text truncate">{link}</span>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "h-9 px-3 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0",
                  copied
                    ? "border-accent bg-accent-subtle text-prism-accent"
                    : "border-border bg-panel text-prism-text hover:bg-bg-hover"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
              Who can see it
            </p>
            <div className="space-y-1">
              <VisibilityRow
                icon={Lock}
                label="Private"
                description="Only you can view"
                active={visibility === "private"}
                onClick={() => setVisibility("private")}
              />
              <VisibilityRow
                icon={Users}
                label="Workspace"
                description="Everyone in Acme Inc."
                active={visibility === "workspace"}
                onClick={() => setVisibility("workspace")}
              />
              <VisibilityRow
                icon={Globe}
                label="Public"
                description="Anyone with the link"
                active={visibility === "public"}
                onClick={() => setVisibility("public")}
              />
            </div>
          </div>

          {/* People */}
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
              People with access
            </p>
            <div className="space-y-0.5">
              <PersonRow
                initial="Y"
                name="Youssef"
                email="youssef@acme.com"
                role="Owner"
                you
              />
              <PersonRow
                initial="S"
                name="Sara Ahmed"
                email="sara@acme.com"
                role="Editor"
              />
              <PersonRow
                initial="O"
                name="Omar Khaled"
                email="omar@acme.com"
                role="Viewer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-bg-hover flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function VisibilityRow({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: any
  label: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md border p-3 flex items-start gap-3 transition-colors",
        active
          ? "border-accent bg-accent-subtle"
          : "border-border hover:bg-bg-hover"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 mt-0.5 shrink-0",
          active ? "text-prism-accent" : "text-prism-muted"
        )}
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-medium",
            active ? "text-prism-accent" : "text-prism-text-strong"
          )}
        >
          {label}
        </p>
        <p className="text-2xs text-prism-muted mt-0.5">{description}</p>
      </div>
      {active && (
        <Check
          className="w-4 h-4 text-prism-accent shrink-0 mt-0.5"
          strokeWidth={2.5}
        />
      )}
    </button>
  )
}

function PersonRow({
  initial,
  name,
  email,
  role,
  you,
}: {
  initial: string
  name: string
  email: string
  role: string
  you?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-bg-hover">
      <div className="w-7 h-7 rounded-full bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-prism-text-strong truncate">
          {name} {you && <span className="text-prism-muted">(you)</span>}
        </p>
        <p className="text-2xs text-prism-muted truncate">{email}</p>
      </div>
      <span className="text-2xs text-prism-muted shrink-0">{role}</span>
    </div>
  )
}
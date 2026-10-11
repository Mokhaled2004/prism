"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  RotateCw,
  Trash2,
  Upload,
  Layers,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { AutomationCard, CardAction } from "../automation/AutomationCard"
import { AutomationPanelHeader } from "../automation/AutomationPanelHeader"
import { GenerateReportModal } from "../automation/GenerateReportModal"

export function ReportsSection() {
  const sections = useEditor((s) => s.sections)
  const reports = useEditor((s) => s.reports)
  const selectedReportId = useEditor((s) => s.selectedReportId)
  const setSelectedReportId = useEditor((s) => s.setSelectedReportId)
  const addReport = useEditor((s) => s.addReport)
  const removeReport = useEditor((s) => s.removeReport)
  const rerunReport = useEditor((s) => s.rerunReport)
  const resendReport = useEditor((s) => s.resendReport)

  const [generateOpen, setGenerateOpen] = useState(false)

  const handleCreate = (data: {
    name: string
    format: "PDF" | "CSV"
    recipientEmails: string[]
    sectionIds: string[]
  }) => {
    const now = Date.now()
    const next = {
      id: `r_${Math.random().toString(36).slice(2, 10)}`,
      name: data.name,
      description: undefined,
      format: data.format,
      recipientEmails: data.recipientEmails,
      sectionIds: data.sectionIds,
      createdAt: now,
      sectionCountAtCreation:
        data.sectionIds.length === 0 ? sections.length : data.sectionIds.length,
      status: "sent" as const,
      lastSentAt: now,
      activity: [
        {
          id: `act_${Math.random().toString(36).slice(2, 8)}`,
          kind: "created" as const,
          message: "Report created",
          timestamp: now,
        },
        {
          id: `act_${Math.random().toString(36).slice(2, 8)}`,
          kind: "generated" as const,
          message: `${data.format} generated`,
          timestamp: now + 500,
        },
        {
          id: `act_${Math.random().toString(36).slice(2, 8)}`,
          kind: "sent" as const,
          message: `Sent to ${data.recipientEmails.length} recipient${
            data.recipientEmails.length === 1 ? "" : "s"
          }`,
          timestamp: now + 1000,
        },
      ],
    }
    addReport(next)
    setGenerateOpen(false)
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <AutomationPanelHeader
          title="Reports"
          count={reports.length}
          icon={FileText}
          action={
            <button
              onClick={() => setGenerateOpen(true)}
              className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1 cursor-pointer shrink-0"
              title="Generate a new report"
            >
              <Upload className="w-2.5 h-2.5" strokeWidth={2.5} />
              <span>New</span>
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {reports.length === 0 ? (
            <EmptyReports onCreate={() => setGenerateOpen(true)} />
          ) : (
            reports.map((r) => {
              const sectionCount =
                r.sectionIds.length === 0
                  ? r.sectionCountAtCreation
                  : r.sectionIds.length
              const isActive = r.id === selectedReportId
              return (
                <div
                  key={r.id}
                  className={cn(
                    "rounded-md transition-all",
                    isActive && "ring-2 ring-accent ring-offset-2 ring-offset-bg"
                  )}
                >
                  <AutomationCard
                    icon={FileText}
                    iconTone={r.status === "failed" ? "danger" : "muted"}
                    title={r.name}
                    badge={
                      r.status === "failed" ? (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-danger-subtle text-prism-danger font-medium shrink-0">
                          Failed
                        </span>
                      ) : undefined
                    }
                    meta={
                      <>
                        <span>{relativeTime(r.createdAt)}</span>
                        <span className="text-border">·</span>
                        <span>{r.format}</span>
                        <span className="text-border">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" strokeWidth={2} />
                          {sectionCount}{" "}
                          {sectionCount === 1 ? "section" : "sections"}
                        </span>
                        {r.recipientEmails.length > 0 && (
                          <>
                            <span className="text-border">·</span>
                            <span>
                              {r.recipientEmails.length}{" "}
                              {r.recipientEmails.length === 1
                                ? "recipient"
                                : "recipients"}
                            </span>
                          </>
                        )}
                      </>
                    }
                    onClick={() =>
                      setSelectedReportId(isActive ? null : r.id)
                    }
                    actions={
                      <>
                        <CardAction
                          icon={Download}
                          label="Download"
                          onClick={() => console.log("download", r.id)}
                        />
                        <CardAction
                          icon={RotateCw}
                          label="Re-run"
                          onClick={() => rerunReport(r.id)}
                        />
                        <CardAction
                          icon={Send}
                          label="Resend"
                          onClick={() => resendReport(r.id)}
                        />
                        <CardAction
                          icon={Trash2}
                          label="Delete"
                          tone="danger"
                          onClick={() => removeReport(r.id)}
                        />
                      </>
                    }
                  />
                </div>
              )
            })
          )}
        </div>
      </div>

      <GenerateReportModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        sections={sections.map((s) => ({ id: s.id, name: s.name }))}
        onCreate={handleCreate}
      />
    </>
  )
}

function EmptyReports({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <FileText className="w-6 h-6 text-prism-accent" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-prism-text-strong mb-1">
        No reports yet
      </p>
      <p className="text-xs text-prism-muted mb-4 max-w-[220px]">
        Generate a report to share this dashboard as a PDF or CSV.
      </p>
      <button
        onClick={onCreate}
        className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>Generate report</span>
      </button>
    </div>
  )
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
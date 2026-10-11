"use client"

import { useEffect, useRef, useState } from "react"
import {
  Send,
  ChevronDown,
  RotateCw,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface ResendDropdownProps {
  onResend: () => void
  onRerun: () => void
  onBoth: () => void
  disabled?: boolean
}

export function ResendDropdown({
  onResend,
  onRerun,
  onBoth,
  disabled,
}: ResendDropdownProps) {
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

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={onResend}
        disabled={disabled}
        className={cn(
          "h-8 pl-2.5 pr-2 rounded-l-md border border-r-0 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors",
          disabled
            ? "border-border bg-panel text-prism-muted cursor-not-allowed"
            : "border-border bg-panel text-prism-text hover:bg-bg-hover"
        )}
        title="Resend report"
      >
        <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Resend</span>
      </button>

      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "h-8 w-6 rounded-r-md border text-prism-muted flex items-center justify-center cursor-pointer transition-colors",
          disabled
            ? "border-border bg-panel cursor-not-allowed"
            : "border-border bg-panel hover:bg-bg-hover hover:text-prism-text"
        )}
        title="More options"
      >
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 min-w-[220px] bg-panel border border-border rounded-md shadow-lg py-1 z-50">
          <MenuItem
            icon={Send}
            label="Resend only"
            description="Send the existing file again"
            onClick={() => {
              onResend()
              setOpen(false)
            }}
          />
          <MenuItem
            icon={RotateCw}
            label="Re-run only"
            description="Regenerate without sending"
            onClick={() => {
              onRerun()
              setOpen(false)
            }}
          />
          <div className="my-1 border-t border-border" />
          <MenuItem
            icon={Layers}
            label="Re-run and resend"
            description="Regenerate and send to recipients"
            accent
            onClick={() => {
              onBoth()
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  description,
  onClick,
  accent,
}: {
  icon: any
  label: string
  description: string
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-1.5 text-left flex items-start gap-2.5 hover:bg-bg-hover transition-colors cursor-pointer"
    >
      <Icon
        className={cn(
          "w-3.5 h-3.5 mt-0.5 shrink-0",
          accent ? "text-prism-accent" : "text-prism-muted"
        )}
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-medium",
            accent ? "text-prism-accent" : "text-prism-text"
          )}
        >
          {label}
        </p>
        <p className="text-2xs text-prism-muted mt-0.5">{description}</p>
      </div>
    </button>
  )
}
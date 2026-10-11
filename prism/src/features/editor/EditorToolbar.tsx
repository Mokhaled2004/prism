"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  Share2,
  Upload,
  LayoutGrid,
} from "lucide-react"
import { PrismButton } from "@/components/ui/prism/Button"

export interface EditorToolbarProps {
  onOpenLayout: () => void
  onPreview: () => void
  onShare: () => void
  onPublish: () => void
}

export function EditorToolbar({
  onOpenLayout,
  onPreview,
  onShare,
  onPublish,
}: EditorToolbarProps) {
  return (
    <header className="h-12 flex items-center border-b border-border bg-panel px-3 shrink-0 gap-2">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="cursor-pointer w-8 h-8 rounded-md flex items-center justify-center shrink-0 hover:bg-bg-hover transition-colors"
        title="Prism"
      >
        <img
          src="/logo.png"
          alt="Prism"
          className="w-6 h-6 object-contain"
        />
      </Link>

      {/* Divider */}
      <div className="w-px h-5 bg-border" />

      {/* Back arrow */}
      <Link
        href="/dashboard"
        className="cursor-pointer w-7 h-7 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors shrink-0"
        title="Back to dashboards"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
      </Link>

      {/* Name + status */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-prism-text-strong truncate">
          Sales Overview
        </span>
        <span className="text-2xs px-2 py-0.5 rounded-full bg-warn-subtle text-prism-warn font-semibold uppercase tracking-wider shrink-0">
          Draft
        </span>
      </div>

      <div className="flex-1" />

      {/* Undo / redo */}
      <button
        disabled
        title="Undo"
        className="cursor-pointer w-7 h-7 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Undo2 className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
      <button
        disabled
        title="Redo"
        className="cursor-pointer w-7 h-7 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Redo2 className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Actions */}
      <PrismButton onClick={onOpenLayout}>
        <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Layout</span>
      </PrismButton>

      <PrismButton onClick={onPreview}>
        <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Preview</span>
      </PrismButton>

      <PrismButton onClick={onShare}>
        <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Share</span>
      </PrismButton>

      <PrismButton variant="primary" onClick={onPublish}>
        <Upload className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>Publish</span>
      </PrismButton>
    </header>
  )
}
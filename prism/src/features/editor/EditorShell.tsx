"use client"

import { useState, useEffect } from "react"
import { LeftRail } from "./LeftRail"
import { LeftPanel } from "./LeftPanel"
import { Canvas } from "./Canvas"
import { ReportsCanvas } from "./automation/ReportsCanvas"
import { ScheduleCanvas } from "./automation/ScheduleCanvas"
import { AlertCanvas } from "./automation/AlertCanvas"
import { EditorToolbar } from "./EditorToolbar"
import { LayoutPickerModal } from "./LayoutPickerModal"
import { ThemesModal } from "./ThemesModal"
import { ThemeCustomizeModal } from "./ThemeCustomizeModal"
import { ShareModal } from "./ShareModal"
import { PublishModal } from "./PublishModal"
import { PreviewOverlay } from "./PreviewOverlay"
import { useEditor } from "./store"
import type { Theme } from "@/themes/types"
import { Check } from "lucide-react"

export function EditorShell() {
  const panelOpen = useEditor((s) => s.panelOpen)
  const activeSection = useEditor((s) => s.activeSection)

  const [layoutModalOpen, setLayoutModalOpen] = useState(false)
  const [themesModalOpen, setThemesModalOpen] = useState(false)
  const [customizeTheme, setCustomizeTheme] = useState<Theme | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const isReportsMode = activeSection === "reports" && panelOpen
  const isSchedulerMode = activeSection === "scheduler" && panelOpen
  const isAlertsMode = activeSection === "alerts" && panelOpen

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const handleSaveCustomTheme = (customTheme: Theme) => {
    try {
      const raw = localStorage.getItem("prism-custom-themes")
      const existing: Theme[] = raw ? JSON.parse(raw) : []
      const next = [...existing, customTheme]
      localStorage.setItem("prism-custom-themes", JSON.stringify(next))

      setCustomizeTheme(null)
      setThemesModalOpen(false)
      setToast(`"${customTheme.name}" saved — reload to apply`)
    } catch (err) {
      console.error("Failed to save custom theme", err)
      setToast("Failed to save theme")
    }
  }

  const handleConfirmPublish = () => {
    setPublishModalOpen(false)
    setToast("Dashboard published successfully")
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-bg overflow-hidden">
      <EditorToolbar
        onOpenLayout={() => setLayoutModalOpen(true)}
        onPreview={() => setPreviewOpen(true)}
        onShare={() => setShareModalOpen(true)}
        onPublish={() => setPublishModalOpen(true)}
      />

      <div className="flex flex-1 min-h-0 min-w-0">
        <LeftRail onOpenThemes={() => setThemesModalOpen(true)} />
        {panelOpen && <LeftPanel />}
        {isReportsMode ? (
          <ReportsCanvas />
        ) : isSchedulerMode ? (
          <ScheduleCanvas />
        ) : isAlertsMode ? (
          <AlertCanvas />
        ) : (
          <Canvas />
        )}
      </div>

      <LayoutPickerModal
        open={layoutModalOpen}
        onClose={() => setLayoutModalOpen(false)}
      />

      <ThemesModal
        open={themesModalOpen}
        onClose={() => setThemesModalOpen(false)}
        onCustomize={(theme) => setCustomizeTheme(theme)}
      />

      <ThemeCustomizeModal
        theme={customizeTheme}
        onClose={() => setCustomizeTheme(null)}
        onSave={handleSaveCustomTheme}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
      />

      <PreviewOverlay
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border bg-panel shadow-lg">
            <div className="w-5 h-5 rounded-full bg-accent-subtle flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-prism-accent" strokeWidth={3} />
            </div>
            <p className="text-xs font-medium text-prism-text-strong">
              {toast}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
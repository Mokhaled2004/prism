"use client"

import { useEditor } from "./store"
import { SectionsPanel } from "./sections/SectionsPanel"
import { ComponentsSection } from "./sections/ComponentsSection"
import { OutlineSection } from "./sections/OutlineSection"
import { DataSection } from "./sections/DataSection"
import { CalculationsSection } from "./sections/CalculationsSection"
import { TemplatesSection } from "./sections/TemplatesSection"
import { MembersSection } from "./sections/MembersSection"
import { BillingSection } from "./sections/BillingSection"
import { AuditSection } from "./sections/AuditSection"
import { ReportsSection } from "./sections/ReportsSection"
import { SchedulerSection } from "./sections/SchedulerSection"
import { AlertsSection } from "./sections/AlertsSection"
import { AIAssistantSection } from "./sections/AIAssistantSection"
import { SettingsSection } from "./sections/SettingsSection"

export function LeftPanel() {
  const activeSection = useEditor((s) => s.activeSection)

  return (
    <aside className="w-[280px] shrink-0 bg-panel border-r border-border flex flex-col">
      {activeSection === "sections" && <SectionsPanel />}
      {activeSection === "components" && <ComponentsSection />}
      {activeSection === "outline" && <OutlineSection />}
      {activeSection === "data" && <DataSection />}
      {activeSection === "calculations" && <CalculationsSection />}
      {activeSection === "templates" && <TemplatesSection />}
      {activeSection === "members" && <MembersSection />}
      {activeSection === "billing" && <BillingSection />}
      {activeSection === "audit" && <AuditSection />}
      {activeSection === "reports" && <ReportsSection />}
      {activeSection === "scheduler" && <SchedulerSection />}
      {activeSection === "alerts" && <AlertsSection />}
      {activeSection === "ai" && <AIAssistantSection />}
      {activeSection === "settings" && <SettingsSection />}
    </aside>
  )
}
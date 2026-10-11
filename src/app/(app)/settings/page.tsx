import Link from "next/link"
import {
  Palette,
  Building2,
  Users,
  CreditCard,
  ScrollText,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SettingItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const items: SettingItem[] = [
  {
    title: "Appearance",
    description: "Choose a look for your dashboards and workspace.",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Organization",
    description: "Manage organization name, slug, and workspace details.",
    href: "/settings/organization",
    icon: Building2,
  },
  {
    title: "Members",
    description: "Invite teammates and manage their roles.",
    href: "/settings/members",
    icon: Users,
  },
  {
    title: "Billing",
    description: "Plan, usage, and invoices.",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    title: "Audit log",
    description: "Track important events in your workspace.",
    href: "/settings/audit",
    icon: ScrollText,
  },
]

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-prism-text-strong">
        Settings
      </h1>
      <p className="text-sm text-prism-muted mt-1 mb-6">
        Manage your workspace, members, and billing.
      </p>

      <div className="bg-panel border border-border rounded-md divide-y divide-border">
        {items.map((item) => (
          <SettingRow key={item.href} {...item} />
        ))}
      </div>
    </div>
  )
}

function SettingRow({ title, description, href, icon: Icon }: SettingItem) {
  return (
    <Link
      href={href}
      className="w-full p-4 text-left hover:bg-bg-hover flex items-center gap-4 transition-colors group"
    >
      <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-prism-text-strong">{title}</p>
        <p className="text-xs text-prism-muted mt-0.5">{description}</p>
      </div>
      <ArrowRight
        className="w-4 h-4 text-prism-muted group-hover:text-prism-text transition-colors"
        strokeWidth={1.75}
      />
    </Link>
  )
}
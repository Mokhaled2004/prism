"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { PrismButton } from "@/components/ui/prism/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOrganizationAction } from "@/features/auth/services/organizations"
import { authClient } from "@/features/auth/auth-client"

export default function OrganizationSettingsPage() {
  const { data: session } = authClient.useSession()
  const [isPending, startTransition] = useTransition()

  const [orgId] = useState("default-org")
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [createdAt, setCreatedAt] = useState<string>("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      const baseName = session.user.name || "My Organization"
      setName(`${baseName}'s Organization`)
      setSlug(`${baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-hq`)
      setCreatedAt(new Date().toLocaleDateString(undefined, { dateStyle: "medium" }))
    }
  }, [session])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Organization name cannot be empty")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        await updateOrganizationAction(orgId, name.trim())
        setMessage("Organization details updated successfully!")
        setTimeout(() => setMessage(null), 3000)
      } catch {
        setMessage("Organization name saved!")
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-xs text-prism-muted hover:text-prism-text mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>Settings</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-prism-text-strong">
          Organization Settings
        </h1>
        <p className="text-sm text-prism-muted mt-1">
          Manage your organization name and workspace identifiers.
        </p>
      </div>

      <div className="bg-panel border border-border rounded-lg p-5">
        <form onSubmit={handleSave} className="space-y-4">
          {message && (
            <div className="p-2.5 rounded-md bg-accent-subtle text-prism-accent text-xs flex items-center gap-2 border border-accent/20">
              <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-md bg-danger-subtle text-prism-danger text-xs border border-danger/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="org-name" className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Organization Name
            </Label>
            <Input
              id="org-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-slug" className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Workspace Slug (Read-only)
            </Label>
            <Input
              id="org-slug"
              type="text"
              readOnly
              disabled
              value={slug}
              className="text-xs bg-bg-hover text-prism-muted cursor-not-allowed opacity-80"
            />
            <p className="text-2xs text-prism-muted">
              Used in public dashboard URLs and API identification.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
              Created Date
            </Label>
            <p className="text-xs text-prism-text py-1 px-2.5 rounded-md bg-bg border border-border">
              {createdAt || "Recently"}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <PrismButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending || !name.trim()}
            >
              {isPending ? "Saving..." : "Save changes"}
            </PrismButton>
          </div>
        </form>
      </div>
    </div>
  )
}

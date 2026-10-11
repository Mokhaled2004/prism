"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/features/auth/auth-client"
import { createOrganizationAction } from "@/features/auth/services/organizations"
import { PrismButton } from "@/components/ui/prism/Button"
import { Building2 } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      const base = session.user.name || session.user.email?.split("@")[0] || "My"
      setName(`${base}'s Organization`)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Please enter an organization name")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createOrganizationAction({ name: name.trim() })
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization")
      setLoading(false)
    }
  }

  if (isPending) {
    return <div className="py-8 text-center text-xs text-prism-muted">Loading...</div>
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <div className="w-10 h-10 rounded-lg bg-accent-subtle mx-auto mb-3 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-prism-accent" strokeWidth={1.75} />
        </div>
        <h1 className="text-base font-semibold text-prism-text-strong">
          Name your organization
        </h1>
        <p className="text-xs text-prism-muted mt-1">
          Set up your workspace to begin organizing dashboards and datasets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-2.5 rounded-md bg-danger-subtle text-prism-danger text-xs border border-danger/20">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Organization name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Distributing"
            className="w-full h-8 px-3 rounded-md border border-border bg-panel text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <PrismButton
          type="submit"
          variant="primary"
          size="md"
          disabled={loading || !name.trim()}
          className="w-full justify-center mt-2"
        >
          {loading ? "Creating workspace..." : "Continue to dashboard"}
        </PrismButton>
      </form>
    </div>
  )
}

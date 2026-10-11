"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "../auth-client"
import { createDefaultOrganization } from "../services/organizations"
import { PrismButton } from "@/components/ui/prism/Button"
import { GoogleButton } from "./GoogleButton"

export function SignUpForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || "Failed to create account")
        setLoading(false)
        return
      }

      if (res.data?.user?.id) {
        try {
          await createDefaultOrganization(res.data.user.id, name, email)
        } catch (orgErr) {
          console.warn("Default org creation handled by fallback:", orgErr)
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up")
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h1 className="text-base font-semibold text-prism-text-strong">
          Create your Prism account
        </h1>
        <p className="text-xs text-prism-muted mt-1">
          Start building visual analytics for your organization
        </p>
      </div>

      <GoogleButton text="Sign up with Google" />

      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-border w-full" />
        <span className="bg-panel px-2 text-2xs uppercase tracking-wider text-prism-muted absolute">
          or sign up with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-2.5 rounded-md bg-danger-subtle text-prism-danger text-xs border border-danger/20">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Full name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Jenkins"
            className="w-full h-8 px-3 rounded-md border border-border bg-panel text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Work email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full h-8 px-3 rounded-md border border-border bg-panel text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-8 px-3 rounded-md border border-border bg-panel text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <PrismButton
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          className="w-full justify-center mt-2"
        >
          {loading ? "Creating account..." : "Create account"}
        </PrismButton>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-prism-muted">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-prism-text font-medium underline underline-offset-4 hover:text-prism-text-strong"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

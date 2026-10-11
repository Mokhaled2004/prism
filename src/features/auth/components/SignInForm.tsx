"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "../auth-client"
import { PrismButton } from "@/components/ui/prism/Button"
import { GoogleButton } from "./GoogleButton"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await authClient.signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || "Invalid email or password")
        setLoading(false)
        return
      }

      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h1 className="text-base font-semibold text-prism-text-strong">
          Sign in to Prism
        </h1>
        <p className="text-xs text-prism-muted mt-1">
          Enter your credentials to access your dashboards
        </p>
      </div>

      <GoogleButton text="Sign in with Google" />

      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-border w-full" />
        <span className="bg-panel px-2 text-2xs uppercase tracking-wider text-prism-muted absolute">
          or continue with
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
            Email address
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
            Password
          </label>
          <input
            type="password"
            required
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
          {loading ? "Signing in..." : "Sign in"}
        </PrismButton>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-prism-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-prism-text font-medium underline underline-offset-4 hover:text-prism-text-strong"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import { SignInForm } from "@/features/auth/components/SignInForm"

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-xs text-prism-muted">Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}

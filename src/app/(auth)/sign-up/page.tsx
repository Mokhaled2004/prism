import { Suspense } from "react"
import { SignUpForm } from "@/features/auth/components/SignUpForm"

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-xs text-prism-muted">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}

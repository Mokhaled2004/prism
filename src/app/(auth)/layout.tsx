import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-sm mb-6 flex flex-col items-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <Image
            src="/logo.png"
            alt="Prism"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm font-semibold text-prism-text-strong tracking-tight">
            Prism
          </span>
        </Link>
      </div>

      <div className="w-full max-w-sm bg-panel border border-border rounded-lg p-6 shadow-sm">
        {children}
      </div>

      <div className="mt-8 text-center">
        <p className="text-2xs text-prism-muted">
          Visual analytics for modern teams · MENA distributors
        </p>
      </div>
    </div>
  )
}

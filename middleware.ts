import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = getSessionCookie(req)

  // Auth pages: redirect to /dashboard if logged in
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up"

  // Protected application routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/calculations") ||
    pathname.startsWith("/datasets") ||
    pathname.startsWith("/sources")

  if (isAuthRoute) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    if (!sessionCookie) {
      const redirectUrl = new URL("/sign-in", req.url)
      redirectUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (pathname === "/welcome") {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/calculations/:path*",
    "/datasets/:path*",
    "/sources/:path*",
    "/sign-in",
    "/sign-up",
    "/welcome",
  ],
}

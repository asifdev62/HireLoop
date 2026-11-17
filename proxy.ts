import { NextResponse, type NextRequest } from "next/server"

/**
 * In Next.js 16 the middleware file is called `proxy.ts`.
 *
 * This is only an optimistic gate: it checks that a session cookie exists so
 * anonymous visitors never see the dashboard shell. The real authorization
 * happens in the role layouts and in every server action / API route, because
 * a cookie can be present but expired or forged.
 */

const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
]

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIES.some((name) =>
    request.cookies.has(name)
  )

  if (hasSessionCookie) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`

  url.pathname = "/sign-in"
  url.search = ""
  url.searchParams.set("redirectTo", redirectTo)

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
}

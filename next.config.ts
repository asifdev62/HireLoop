import type { NextConfig } from "next"

const securityHeaders = [
  // Stop the site from being framed (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Do not let browsers guess a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
]

if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  })
}

/**
 * Next.js dev blocks `/_next/*` requests (and the HMR socket) whose Origin is
 * not the hostname the server was started with. When the app is opened at
 * http://127.0.0.1:3000 (or a LAN IP) instead of http://localhost:3000, the
 * page renders but never hydrates: the sign-in form then does a native GET
 * submit, so the password lands in the URL and no request reaches Better Auth.
 *
 * `localhost` is allowed implicitly; these add the loopback aliases. Extra
 * hosts (a phone on the LAN, a tunnel) can be listed in DEV_ALLOWED_ORIGINS.
 */
const devOrigins = [
  "127.0.0.1",
  "[::1]",
  ...(process.env.DEV_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) =>
      origin
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/:\d+$/, "")
    )
    .filter(Boolean),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: Array.from(new Set(devOrigins)),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig

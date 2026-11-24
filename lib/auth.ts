import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const mongoUrl = process.env.MONGODB_URL
const secret = process.env.BETTER_AUTH_SECRET
// `.env` values can pick up trailing whitespace; a stray space here makes
// every Origin check fail with INVALID_ORIGIN.
const baseURL = (process.env.BETTER_AUTH_URL || "http://localhost:3000").trim()

/**
 * Better Auth compares the request Origin byte-for-byte against
 * `trustedOrigins`. `localhost` and `127.0.0.1` (and `[::1]`) all reach the
 * same dev server, so a session started at one of them is rejected at another.
 * Adding the aliases only in development keeps production strict.
 */
function devLoopbackOrigins(url: string) {
  if (process.env.NODE_ENV === "production") return []

  try {
    const { protocol, port } = new URL(url)

    return ["localhost", "127.0.0.1", "[::1]"].map(
      (host) => `${protocol}//${host}${port ? `:${port}` : ""}`
    )
  } catch {
    return []
  }
}

/** Extra origins (LAN IP, tunnel, preview URL) from a comma-separated env var. */
const extraTrustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!mongoUrl) {
  throw new Error("MONGODB_URL is required")
}

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is required")
}

const client = new MongoClient(mongoUrl)
const db = client.db("hireloopdb")

/**
 * Public roles a user may pick for themselves at sign-up.
 * "admin" is deliberately missing: an account can only become an admin
 * through an existing admin (or directly in the database).
 */
const SELF_ASSIGNABLE_ROLES = ["seeker", "recruiter"] as const

function sanitizeRequestedRole(value: unknown) {
  const requested = Array.isArray(value) ? value[0] : value

  return SELF_ASSIGNABLE_ROLES.includes(
    requested as (typeof SELF_ASSIGNABLE_ROLES)[number]
  )
    ? (requested as (typeof SELF_ASSIGNABLE_ROLES)[number])
    : "seeker"
}

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const auth = betterAuth({
  baseURL,
  secret,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    // 7 days, refreshed at most once per day.
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      // Derived from the URL the app is actually served from. Keying this off
      // NODE_ENV broke `npm start` over plain http: browsers drop a Secure
      // cookie on a non-loopback http origin, so sign-in "succeeded" and the
      // session was never stored.
      secure: baseURL.startsWith("https://"),
      path: "/",
    },
    // Only trust proxy headers when the deployment explicitly opts in.
    trustedProxyHeaders: process.env.TRUST_PROXY === "1",
  },
  trustedOrigins: Array.from(
    new Set([baseURL, ...devLoopbackOrigins(baseURL), ...extraTrustedOrigins])
  ),
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60, max: 5 },
      "/forget-password": { window: 60, max: 3 },
      "/reset-password": { window: 60, max: 5 },
    },
  },
  user: {
    additionalFields: {
      // The admin plugin owns the real `role` field and marks it `input: false`,
      // so it can never be sent by a client. Sign-up therefore posts this
      // separate field, which the create hook below converts into `role`.
      requestedRole: {
        type: "string",
        required: false,
        input: true,
        // Never expose it in user/session responses.
        returned: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const data = { ...(user as Record<string, unknown>) }

          // Only the admin-only endpoint may pick an arbitrary role. Every
          // other path (sign-up, OAuth callback, ...) is forced to a public role.
          if (context?.path === "/admin/create-user") {
            return { data }
          }

          data.role = sanitizeRequestedRole(data.requestedRole)
          // Store the sanitized value, not whatever the client asked for.
          data.requestedRole = data.role

          return { data }
        },
      },
      update: {
        before: async (user, context) => {
          // The admin plugin checks permissions before it reaches this hook,
          // so only those two endpoints may change a role.
          const path = context?.path ?? ""

          if (path === "/admin/set-role" || path === "/admin/update-user") {
            return { data: user }
          }

          // Every other update (including the client-facing update-user
          // endpoint) must not be able to change the role.
          const rest = { ...(user as Record<string, unknown>) }
          delete rest.role

          return { data: rest }
        },
      },
    },
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  plugins: [
    admin({
      defaultRole: "seeker",
      adminRoles: ["admin"],
    }),
  ],
})

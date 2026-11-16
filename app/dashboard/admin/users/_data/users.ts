/**
 * Display types and helpers for the admin user-management page.
 *
 * These only normalize Better Auth users, so they stay free of React and API
 * code and can be shared by the server page and the client components.
 */

export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]
export type UserRoleFilter = UserRole | "all"

export const ROLE_OPTIONS = [
  { value: "seeker", label: "Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
] as const satisfies readonly { value: UserRole; label: string }[]

export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  ...ROLE_OPTIONS,
] as const satisfies readonly { value: UserRoleFilter; label: string }[]

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
  banned: boolean
  /** ISO date string, so the value is safe to pass to client components. */
  createdAt: string
}

type BetterAuthUser = {
  id: string
  name: string
  email: string
  role?: string | null
  emailVerified?: boolean | null
  banned?: boolean | null
  createdAt: Date | string
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Unknown or missing roles fall back to the app's default account type. */
export function normalizeRole(role: unknown): UserRole {
  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : "seeker"
}

function toIsoString(value: Date | string) {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString()
}

export function toManagedUser(user: BetterAuthUser): ManagedUser {
  return {
    id: user.id,
    name: user.name?.trim() || user.email,
    email: user.email,
    role: normalizeRole(user.role),
    emailVerified: Boolean(user.emailVerified),
    banned: Boolean(user.banned),
    createdAt: toIsoString(user.createdAt),
  }
}

export function formatJoinedDate(iso: string) {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function isNewSignup(iso: string) {
  const joined = new Date(iso).getTime()

  return !Number.isNaN(joined) && Date.now() - joined <= DAY_MS
}

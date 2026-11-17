"use server"

import { apiFetch, readApiError, requireSession } from "@/lib/core/server"

const ROLES = ["seeker", "recruiter", "admin"] as const

type Role = (typeof ROLES)[number]

type RoleUpdateResult = {
  acknowledged?: boolean
  matchedCount?: number
  modifiedCount?: number
}

/** Changes another user's role. Admins only, enforced here and by the API. */
export async function updateUserRoleAction(
  userId: string,
  role: Role
): Promise<RoleUpdateResult> {
  const session = await requireSession()

  if (session.user.role !== "admin") {
    throw new Error("Only admins can change user roles")
  }

  if (typeof userId !== "string" || !/^[a-f0-9]{24}$/i.test(userId)) {
    throw new Error("Invalid user id")
  }

  if (!ROLES.includes(role)) {
    throw new Error("Invalid role")
  }

  const response = await apiFetch(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not update the role"))
  }

  return response.json()
}

/**
 * Premium status of the signed-in user.
 * The id comes from the session, so a user cannot read someone else's plan.
 */
export async function getPremiumStatusAction(): Promise<{ premium: boolean }> {
  const session = await requireSession()

  const response = await apiFetch(
    `/users/${encodeURIComponent(session.user.id)}/premium`
  )

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not read your subscription")
    )
  }

  const data = (await response.json()) as { premium?: unknown }

  return { premium: data.premium === true }
}

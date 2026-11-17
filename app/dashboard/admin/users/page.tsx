import { getusers } from "@/lib/api/users"
import { requireRole } from "@/lib/core/server"

import { UsersManagement } from "./_components/users-management"
import { toManagedUser, type ManagedUser } from "./_data/users"

// This page reads the session with `headers()`, so it must never be cached or
// prerendered with one user's data.
export const dynamic = "force-dynamic"

/**
 * Admin "Users" page.
 *
 * The Better Auth admin plugin requires the current session to be an admin.
 * Any failure is passed to the client view as a readable message instead of
 * crashing the route.
 */
export default async function AdminUsersPage() {
  // Defense in depth: the layout already checks this, but the page also
  // refuses to fetch anything for a non-admin session.
  await requireRole("admin")

  let users: ManagedUser[] = []
  let loadError: string | null = null

  try {
    const result = await getusers()

    users = result.users.map(toManagedUser)
  } catch (error) {
    console.error("Failed to load users:", error)

    loadError = error instanceof Error ? error.message : "Could not load users."
  }

  return <UsersManagement initialUsers={users} loadError={loadError} />
}

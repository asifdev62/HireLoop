import { getusers } from "@/lib/api/users"

import { UsersManagement } from "./_components/users-management"
import { toManagedUser, type ManagedUser } from "./_data/users"

/**
 * Admin "Users" page.
 *
 * The Better Auth admin plugin requires the current session to be an admin.
 * Any failure is passed to the client view as a readable message instead of
 * crashing the route.
 */
export default async function AdminUsersPage() {
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

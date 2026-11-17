import { headers } from "next/headers"

import { auth } from "../auth"
import { getSession } from "../core/server"

export const getusers = async () => {
  const session = await getSession()

  // Defence in depth: the Better Auth admin plugin checks this too, but the
  // page should not even attempt the call without an admin session.
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Only admins can list users")
  }

  const users = await auth.api.listUsers({
    query: {
      sortBy: "name",
      sortDirection: "desc",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  })

  return users
}

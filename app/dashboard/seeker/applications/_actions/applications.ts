"use server"

import {
  normalizeApplication,
  type JobApplication,
} from "@/lib/actions/applications"
import { authFetch, getSession } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Every application belonging to the signed-in seeker, newest first.
 *
 * This has to run on the server: `authFetch` reads the session token with
 * `headers()` and returns a raw `Response`, which cannot be serialized across
 * the server/client boundary. Reading the JSON here and returning normalised
 * application objects keeps the payload plain and serializable.
 */
export async function getMyApplications(): Promise<JobApplication[]> {
  const session = await getSession()
  const userId = session?.user?.id
  const userEmail = session?.user?.email?.toLowerCase()

  if (!userId) return []

  const response = await authFetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(userId)}`
  )

  if (!response.ok) {
    throw new Error(`Failed to load your applications (${response.status})`)
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) return []

  const applications = data.map((item) =>
    normalizeApplication(
      item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    )
  )

  // The API filters by `userId`, which is the primary ownership check. Rows
  // imported from the old seed data can still carry that same id with someone
  // else's details, so the applicant email must match too — otherwise only the
  // applications this user actually submitted are shown.
  if (!userEmail) return applications

  return applications.filter(
    (application) =>
      !application.applicantEmail ||
      application.applicantEmail.toLowerCase() === userEmail
  )
}

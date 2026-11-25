import "server-only"

import type { SavedJob } from "@/lib/actions/saved-jobs"
import { parseSavedJobs } from "@/lib/actions/saved-jobs"
import { apiFetch, readApiError } from "@/lib/core/server"

/**
 * Saved job reads for server components only.
 *
 * Mutations live in `lib/actions/saved-job-actions.ts` so they always run with
 * the verified session. The API derives the user id from that session and
 * never from the browser.
 */

const OBJECT_ID = /^[a-f0-9]{24}$/i

/** Every job the signed-in seeker has saved, newest first. */
export async function getSavedJobs(): Promise<SavedJob[]> {
  const response = await apiFetch("/savedJobs")

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not load saved jobs"))
  }

  return parseSavedJobs(await response.json())
}

/** The saved job ids, for the bookmark state on job lists. */
export async function getSavedJobIds(): Promise<string[]> {
  const response = await apiFetch("/savedJobs/ids")

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not load saved job ids")
    )
  }

  const data: unknown = await response.json()

  if (!data || typeof data !== "object") return []

  const jobIds = (data as { jobIds?: unknown }).jobIds

  return Array.isArray(jobIds)
    ? jobIds.filter(
        (jobId): jobId is string =>
          typeof jobId === "string" && OBJECT_ID.test(jobId)
      )
    : []
}

/** Whether the signed-in seeker already saved this job. */
export async function isJobSaved(jobId: string): Promise<boolean> {
  if (typeof jobId !== "string" || !OBJECT_ID.test(jobId)) return false

  const response = await apiFetch(`/savedJobs/${jobId}`)

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not check the saved job")
    )
  }

  const data = (await response.json()) as { saved?: unknown }

  return data.saved === true
}

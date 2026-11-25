"use server"

import { revalidatePath } from "next/cache"

import type {
  SavedJobDeleteResult,
  SavedJobInsertResult,
} from "@/lib/actions/saved-jobs"
import { apiFetch, readApiError, requireSession } from "@/lib/core/server"

const OBJECT_ID = /^[a-f0-9]{24}$/i

function assertObjectId(value: unknown): string {
  if (typeof value !== "string" || !OBJECT_ID.test(value)) {
    throw new Error("Invalid job id")
  }

  return value
}

function revalidateSavedJobPages(jobId: string) {
  revalidatePath("/dashboard/seeker/saved-jobs")
  revalidatePath("/dashboard/seeker/jobs")
  revalidatePath(`/browse-jobs/${jobId}`)
}

/**
 * Saves a job for the signed-in seeker.
 * The caller only sends the job id; the owner comes from the session.
 */
export async function saveJobAction(
  jobId: string
): Promise<SavedJobInsertResult> {
  const session = await requireSession()

  if (session.user.role !== "seeker") {
    throw new Error("Only job seekers can save jobs")
  }

  const id = assertObjectId(jobId)

  const response = await apiFetch("/savedJobs", {
    method: "POST",
    body: JSON.stringify({ jobId: id }),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not save the job"))
  }

  revalidateSavedJobPages(id)

  return response.json()
}

/** Removes a job from the signed-in seeker's saved list. */
export async function unsaveJobAction(
  jobId: string
): Promise<SavedJobDeleteResult> {
  const session = await requireSession()

  if (session.user.role !== "seeker") {
    throw new Error("Only job seekers can remove saved jobs")
  }

  const id = assertObjectId(jobId)

  const response = await apiFetch(`/savedJobs/${id}`, { method: "DELETE" })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not remove the saved job")
    )
  }

  revalidateSavedJobPages(id)

  return response.json()
}

/** Saves or removes a job based on the requested state. */
export async function toggleSavedJobAction(
  jobId: string,
  shouldSave: boolean
): Promise<SavedJobInsertResult | SavedJobDeleteResult> {
  return shouldSave ? saveJobAction(jobId) : unsaveJobAction(jobId)
}

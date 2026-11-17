"use server"

import {
  isApplicationStatus,
  normalizeApplication,
  type ApplicationInsertResult,
  type ApplicationStatus,
  type ApplicationUpdateResult,
  type JobApplication,
} from "@/lib/actions/applications"
import { apiFetch, readApiError, requireSession } from "@/lib/core/server"

const OBJECT_ID = /^[a-f0-9]{24}$/i

function assertObjectId(value: unknown, label: string): string {
  if (typeof value !== "string" || !OBJECT_ID.test(value)) {
    throw new Error(`Invalid ${label}`)
  }

  return value
}

function optionalUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined

  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined
    return url.toString().slice(0, 2048)
  } catch {
    return undefined
  }
}

/**
 * Applies to a job as the signed-in seeker.
 *
 * The caller only sends the job id. The API takes the applicant identity and
 * the job snapshot from the verified session and the database.
 */
export async function applyToJobAction(input: {
  jobId: string
  resumeUrl?: string
  coverLetter?: string
  portfolioUrl?: string
}): Promise<ApplicationInsertResult> {
  const session = await requireSession()

  if (session.user.role !== "seeker") {
    throw new Error("Only job seekers can apply to jobs")
  }

  const body = {
    jobId: assertObjectId(input?.jobId, "job id"),
    ...(optionalUrl(input?.resumeUrl)
      ? { resumeUrl: optionalUrl(input.resumeUrl) }
      : {}),
    ...(optionalUrl(input?.portfolioUrl)
      ? { portfolioUrl: optionalUrl(input.portfolioUrl) }
      : {}),
    ...(typeof input?.coverLetter === "string" && input.coverLetter.length > 0
      ? { coverLetter: input.coverLetter.slice(0, 5000) }
      : {}),
  }

  const response = await apiFetch("/applications", {
    method: "POST",
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not submit the application")
    )
  }

  return response.json()
}

/** Every application belonging to the signed-in seeker. */
export async function getMyApplicationsAction(): Promise<JobApplication[]> {
  await requireSession()

  const response = await apiFetch("/applications")

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not load your applications")
    )
  }

  const data: unknown = await response.json()

  return Array.isArray(data)
    ? data.map((item) =>
        normalizeApplication(
          item && typeof item === "object"
            ? (item as Record<string, unknown>)
            : {}
        )
      )
    : []
}

/** Number of applications sent by the signed-in seeker. */
export async function getMyApplicationsCountAction(): Promise<number> {
  await requireSession()

  const response = await apiFetch("/applications/count")

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not count your applications")
    )
  }

  const data = (await response.json()) as { count?: unknown }

  return typeof data.count === "number" ? data.count : 0
}

/**
 * Applications for the signed-in recruiter's jobs.
 * `jobIds` can only narrow the result; the API derives the ownership scope.
 */
export async function getRecruiterApplicationsAction(
  jobIds: string[] = []
): Promise<JobApplication[]> {
  await requireSession()

  const safeJobIds = jobIds
    .filter((id) => typeof id === "string" && OBJECT_ID.test(id))
    .slice(0, 200)

  const query = safeJobIds.length
    ? `?jobIds=${encodeURIComponent(safeJobIds.join(","))}`
    : ""

  const response = await apiFetch(`/applications${query}`)

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not load applications")
    )
  }

  const data: unknown = await response.json()

  return Array.isArray(data)
    ? data.map((item) =>
        normalizeApplication(
          item && typeof item === "object"
            ? (item as Record<string, unknown>)
            : {}
        )
      )
    : []
}

/** Moves one application to a new pipeline status (recruiter/admin only). */
export async function updateApplicationStatusAction(
  applicationId: string,
  status: ApplicationStatus
): Promise<ApplicationUpdateResult> {
  const session = await requireSession()

  if (session.user.role !== "recruiter" && session.user.role !== "admin") {
    throw new Error("You are not allowed to change application status")
  }

  if (!isApplicationStatus(status)) {
    throw new Error("Invalid application status")
  }

  const id = assertObjectId(applicationId, "application id")

  const response = await apiFetch(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not update the application status")
    )
  }

  return response.json()
}

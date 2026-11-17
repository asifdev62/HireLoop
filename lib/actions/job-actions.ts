"use server"

import { apiFetch, readApiError, requireSession } from "@/lib/core/server"
import type { JobData } from "@/lib/actions/jobs"

const OBJECT_ID = /^[a-f0-9]{24}$/i

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]
const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"]

type JobInsertResult = {
  acknowledged?: boolean
  insertedId?: string
}

type JobDeleteResult = {
  acknowledged?: boolean
  deletedCount?: number
}

function assertObjectId(value: unknown, label: string): string {
  if (typeof value !== "string" || !OBJECT_ID.test(value)) {
    throw new Error(`Invalid ${label}`)
  }

  return value
}

function requiredText(value: unknown, label: string, max = 200) {
  if (typeof value !== "string") throw new Error(`${label} is required`)

  const trimmed = value.trim()

  if (trimmed.length === 0) throw new Error(`${label} is required`)
  if (trimmed.length > max) throw new Error(`${label} is too long`)

  return trimmed
}

function requiredNumber(value: unknown, label: string) {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 0 || number > 1_000_000_000) {
    throw new Error(`${label} must be a valid number`)
  }

  return number
}

/**
 * Builds the only job payload the API accepts. Anything the browser adds
 * (recruiterId, recruiterEmail, _id, ...) is dropped here and the API rejects
 * unknown fields as well.
 */
function toJobPayload(data: JobData) {
  const minSalary = requiredNumber(data?.minSalary, "Minimum salary")
  const maxSalary = requiredNumber(data?.maxSalary, "Maximum salary")

  if (maxSalary < minSalary) {
    throw new Error("Maximum salary must be at least the minimum salary")
  }

  if (!JOB_TYPES.includes(data?.jobType)) throw new Error("Invalid job type")
  if (!SALARY_FREQUENCIES.includes(data?.salaryFrequency)) {
    throw new Error("Invalid salary frequency")
  }

  const deadline = requiredText(data?.deadline, "Deadline", 40)
  if (Number.isNaN(new Date(deadline).getTime())) {
    throw new Error("Deadline must be a valid date")
  }

  return {
    title: requiredText(data?.title, "Title"),
    companyName: requiredText(data?.companyName, "Company name"),
    category: requiredText(data?.category, "Category", 100),
    location: requiredText(data?.location, "Location"),
    deadline,
    minSalary,
    maxSalary,
    salaryFrequency: data.salaryFrequency,
    responsibilities: requiredText(
      data?.responsibilities,
      "Responsibilities",
      5000
    ),
    qualifications: requiredText(data?.qualifications, "Qualifications", 5000),
    jobType: data.jobType,
    isRemote: data?.isRemote === true,
  }
}

/** Creates a job for the signed-in recruiter. */
export async function createJobAction(
  data: JobData
): Promise<JobInsertResult> {
  const session = await requireSession()

  if (session.user.role !== "recruiter") {
    throw new Error("Only recruiters can create jobs")
  }

  const response = await apiFetch("/jobs", {
    method: "POST",
    body: JSON.stringify(toJobPayload(data)),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not create the job"))
  }

  return response.json()
}

/** Deletes one of the signed-in recruiter's jobs. */
export async function deleteJobAction(jobId: string): Promise<JobDeleteResult> {
  const session = await requireSession()

  if (session.user.role !== "recruiter" && session.user.role !== "admin") {
    throw new Error("You are not allowed to delete jobs")
  }

  const id = assertObjectId(jobId, "job id")

  const response = await apiFetch(`/jobs/${id}`, { method: "DELETE" })

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not delete the job"))
  }

  return response.json()
}

/** Number of jobs owned by the signed-in recruiter. */
export async function getMyJobsCountAction(): Promise<number> {
  const session = await requireSession()

  if (session.user.role !== "recruiter") {
    throw new Error("Only recruiters have job postings")
  }

  const response = await apiFetch("/jobs/count")

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not count your jobs"))
  }

  const data = (await response.json()) as { count?: unknown }

  return typeof data.count === "number" ? data.count : 0
}

/**
 * The signed-in recruiter's own jobs.
 * The recruiter id is taken from the session, not from the browser.
 */
export async function getMyJobsAction() {
  const session = await requireSession()

  if (session.user.role !== "recruiter" && session.user.role !== "admin") {
    throw new Error("You are not allowed to view these jobs")
  }

  const query =
    session.user.role === "admin"
      ? ""
      : `?recruiterId=${encodeURIComponent(session.user.id)}`

  const response = await apiFetch(`/jobs${query}`)

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not load your jobs"))
  }

  const data: unknown = await response.json()

  return Array.isArray(data) ? data : []
}

/**
 * Public job list for client components (for example the home page).
 * No private data is involved, but the query is still capped and encoded.
 */
export async function getPublicJobsAction(query = "") {
  const safeQuery = typeof query === "string" ? query.slice(0, 300) : ""

  const response = await fetch(
    `${process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/jobs?${safeQuery}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Could not load jobs")
  }

  const data: unknown = await response.json()

  return Array.isArray(data) ? data : []
}

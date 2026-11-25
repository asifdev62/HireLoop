import type { Job } from "@/app/dashboard/recruiter/_data/jobData"

/**
 * Client-safe saved job types and helpers.
 *
 * The network calls live in `lib/api/saved-jobs.ts` (server components) and
 * `lib/actions/saved-job-actions.ts` (server actions), so they always run with
 * the verified session. This file has no fetch code on purpose.
 */

/** A saved job: the job itself plus when the seeker saved it. */
export type SavedJob = Job & {
  savedAt?: string
}

/** What `POST /savedJobs` sends back. */
export type SavedJobInsertResult = {
  acknowledged?: boolean
  alreadySaved?: boolean
  savedId?: string
}

/** What `DELETE /savedJobs/:jobId` sends back. */
export type SavedJobDeleteResult = {
  acknowledged?: boolean
  deletedCount?: number
}

const OBJECT_ID = /^[a-f0-9]{24}$/i

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function readOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function readNumber(value: unknown) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

/** Turns one API row into a `SavedJob`, or null when it has no valid id. */
function normalizeSavedJob(raw: Record<string, unknown>): SavedJob | null {
  const id = readString(raw._id) || readString(raw.id)

  if (!OBJECT_ID.test(id)) return null

  return {
    _id: id,
    id: readOptionalString(raw.id),
    title: readString(raw.title),
    companyName: readString(raw.companyName),
    category: readString(raw.category),
    department: readOptionalString(raw.department),
    location: readString(raw.location),
    deadline: readString(raw.deadline),
    minSalary: readNumber(raw.minSalary),
    maxSalary: readNumber(raw.maxSalary),
    salaryFrequency: readString(raw.salaryFrequency),
    responsibilities: readOptionalString(raw.responsibilities),
    qualifications: readOptionalString(raw.qualifications),
    jobType: readString(raw.jobType, "Full-time"),
    isRemote: raw.isRemote === true,
    recruiterId: readOptionalString(raw.recruiterId),
    recruiterEmail: readOptionalString(raw.recruiterEmail),
    applicants: readNumber(raw.applicants),
    status: readOptionalString(raw.status),
    postedAgo: readOptionalString(raw.postedAgo),
    savedAt: readOptionalString(raw.savedAt),
  }
}

/** Turns an unknown API payload into normalised saved jobs. */
export function parseSavedJobs(data: unknown): SavedJob[] {
  if (!Array.isArray(data)) return []

  return data.flatMap((item) => {
    if (!item || typeof item !== "object") return []

    const job = normalizeSavedJob(item as Record<string, unknown>)

    return job ? [job] : []
  })
}

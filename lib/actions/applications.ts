/**
 * Client-safe application types and normalisation helpers.
 *
 * The network calls live in `application-actions.ts` ("use server") so they
 * always run with the verified session. This file has no fetch code on
 * purpose: it is imported by client components.
 */

/** Every stage an application can be in, in the order they usually happen. */
export const APPLICATION_STATUSES = [
  "Applied",
  "Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

/**
 * One application exactly as it is stored in the database.
 *
 * The job fields are copied when the seeker applies, so "My Applications"
 * still reads correctly after the recruiter edits or deletes the job post.
 */
export type JobApplication = {
  _id?: string

  // Who applied (the signed-in seeker). The API filters on this field.
  userId: string
  applicantName: string
  applicantEmail: string

  // Which job they applied to (snapshot of the job at apply time).
  jobId: string
  jobTitle: string
  companyName: string
  jobType: string
  location: string
  isRemote: boolean

  // What they sent with the application.
  resumeUrl?: string
  coverLetter?: string
  portfolioUrl?: string

  // Where it stands in the pipeline.
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
  archived: boolean
}

/** What `POST /applications` sends back (MongoDB `insertOne` result). */
export type ApplicationInsertResult = {
  acknowledged?: boolean
  insertedId?: string
}

/** What `PATCH /applications/:id` sends back (MongoDB `updateOne` result). */
export type ApplicationUpdateResult = {
  acknowledged?: boolean
  matchedCount?: number
  modifiedCount?: number
  status?: ApplicationStatus
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function readOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

export function isApplicationStatus(
  value: unknown
): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus)
}

/**
 * Older/other rows may carry `applicantId`/`email` instead of `userId`/
 * `applicantEmail`. Every component expects one shape, so the API response is
 * normalised here, always keyed on `userId`, before it reaches the page.
 */
export function normalizeApplication(
  raw: Record<string, unknown>
): JobApplication {
  return {
    _id: readOptionalString(raw._id),

    userId: readString(raw.userId ?? raw.applicantId),
    applicantName: readString(raw.applicantName ?? raw.name),
    applicantEmail: readString(raw.applicantEmail ?? raw.email),

    jobId: readString(raw.jobId),
    jobTitle: readString(raw.jobTitle ?? raw.title),
    companyName: readString(raw.companyName),
    jobType: readString(raw.jobType, "Full-time"),
    location: readString(raw.location, "Not specified"),
    isRemote: raw.isRemote === true,

    resumeUrl: readOptionalString(raw.resumeUrl),
    coverLetter: readOptionalString(raw.coverLetter),
    portfolioUrl: readOptionalString(raw.portfolioUrl),

    status: isApplicationStatus(raw.status) ? raw.status : "Applied",
    appliedAt: readString(raw.appliedAt ?? raw.createdAt),
    updatedAt: readOptionalString(raw.updatedAt),
    archived: raw.archived === true,
  }
}

/** Turns an unknown API payload into normalised applications. */
export function parseApplications(data: unknown): JobApplication[] {
  if (!Array.isArray(data)) return []

  return data.map((item: unknown) =>
    normalizeApplication(
      item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    )
  )
}

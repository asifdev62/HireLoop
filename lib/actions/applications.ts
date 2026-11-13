const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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

  // Who applied (the signed-in seeker).
  applicantId: string
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

/**
 * What the apply form sends. The backend adds the status ("Applied"), the
 * applied date, and `archived: false`.
 */
export type NewApplication = Omit<
  JobApplication,
  "_id" | "status" | "appliedAt" | "updatedAt" | "archived"
>

/** What `POST /applications` sends back (MongoDB `insertOne` result). */
export type ApplicationInsertResult = {
  acknowledged?: boolean
  insertedId?: string
}

/** Saves one application and returns the insert result. */
export async function applyToAJob(
  data: NewApplication
): Promise<ApplicationInsertResult> {
  const application: JobApplication = {
    ...data,
    status: "Applied",
    appliedAt: new Date().toISOString(),
    archived: false,
  }

  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })

  if (!response.ok) {
    throw new Error("Failed to submit the application")
  }

  return response.json()
}

/** Every application of one seeker, newest first. */
export async function getMyApplications(
  applicantId: string
): Promise<JobApplication[]> {
  const response = await fetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`
  )

  if (!response.ok) {
    throw new Error("Failed to load applications")
  }

  const data = await response.json()

  return Array.isArray(data) ? data : (data?.applications ?? [])
}

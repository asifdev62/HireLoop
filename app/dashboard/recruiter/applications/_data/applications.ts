import type { JobApplication } from "@/lib/actions/applications"

/**
 * One application as the recruiter review table shows it.
 * A full `JobApplication` from the API can be used directly.
 */
export type RecruiterApplication = JobApplication

/** Stable key for a row (also used for the local status override). */
export function applicationKey(application: JobApplication) {
  return application._id ?? `${application.jobId}-${application.applicantEmail}`
}

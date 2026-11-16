import type { JobApplication } from "@/lib/actions/applications"

/**
 * The fields "My Applications" needs to draw one row.
 * A full `JobApplication` from the API can be passed straight in.
 */
export type ApplicationRow = Pick<
  JobApplication,
  | "_id"
  | "jobId"
  | "jobTitle"
  | "companyName"
  | "jobType"
  | "location"
  | "appliedAt"
  | "status"
  | "archived"
>

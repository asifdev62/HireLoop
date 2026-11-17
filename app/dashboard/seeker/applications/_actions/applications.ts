"use server"

import type { JobApplication } from "@/lib/actions/applications"
import { getMyApplicationsAction } from "@/lib/actions/application-actions"

/**
 * Every application belonging to the signed-in seeker, newest first.
 *
 * The API derives the applicant id from the verified session token, so the
 * browser cannot ask for another user's applications by changing a query
 * string.
 */
export async function getMyApplications(): Promise<JobApplication[]> {
  return getMyApplicationsAction()
}

import type { Metadata } from "next"

import type { Job } from "@/app/dashboard/recruiter/_data/jobData"
import { getJobs } from "@/lib/api/jobs"

import { JobsBrowser } from "./_components/jobs-browser"

export const metadata: Metadata = {
  title: "Browse Jobs · Hireloop",
  description: "Explore every open role on Hireloop in one place.",
}

/** The API returns either an array of jobs or an object with a `jobs` array. */
function toJobList(data: unknown): Job[] {
  if (Array.isArray(data)) return data as Job[]

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { jobs?: unknown }).jobs)
  ) {
    return (data as { jobs: Job[] }).jobs
  }

  return []
}

export default async function SeekerJobsPage() {
  let jobs: Job[] = []
  let loadError: string | null = null

  try {
    jobs = toJobList(await getJobs(""))
  } catch (error) {
    // A failed request should still render the page with a friendly retry
    // message instead of crashing the whole dashboard.
    console.error("Failed to load jobs for the seeker dashboard:", error)
    loadError = "The jobs service is not responding right now."
  }

  return <JobsBrowser jobs={jobs} loadError={loadError} />
}

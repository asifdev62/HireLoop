import Navbar from "@/components/Navbar"
import { getJobs } from "@/lib/api/jobs"

import type { Job } from "@/app/dashboard/recruiter/_data/jobData"

import { BrowseJobsView } from "./_components/browse-jobs-view"

type BrowseJobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Turn the page search params into the query string the jobs API expects. */
function toQueryString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value)
    }
  }

  return query.toString()
}

export default async function BrowseJobsPage({
  searchParams,
}: BrowseJobsPageProps) {
  const params = await searchParams
  const data = await getJobs(toQueryString(params))

  const jobs: Job[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.jobs)
      ? data.jobs
      : []

  return (
    <main className="relative isolate min-h-screen bg-black text-white">
      <Navbar />
      <BrowseJobsView jobs={jobs} />
    </main>
  )
}

import Navbar from "@/components/Navbar"
import { getJobs } from "@/lib/api/jobs"

import type { Job } from "@/app/dashboard/recruiter/_data/jobData"

import { BrowseJobsView } from "./_components/browse-jobs-view"

type BrowseJobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * The query params the jobs API understands:
 * https://.../jobs?search=...&jobType=...&category=...&isRemote=true
 */
const FILTER_KEYS = ["search", "jobType", "category", "isRemote"] as const

/** Turn the page search params into the query string the jobs API expects. */
function toQueryString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams()

  for (const key of FILTER_KEYS) {
    const value = params[key]

    if (typeof value === "string" && value.length > 0) {
      query.set(key, value)
    }
  }

  return query.toString()
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

export default async function BrowseJobsPage({
  searchParams,
}: BrowseJobsPageProps) {
  const params = await searchParams
  const queryString = toQueryString(params)

  // Fetch the filtered jobs for the list, plus the unfiltered jobs for the
  // sidebar counts (so selecting "Design" does not turn every other count to 0).
  const [data, allData] = await Promise.all([
    getJobs(queryString),
    queryString ? getJobs("") : Promise.resolve(null),
  ])

  const jobs = toJobList(data)
  const allJobs = allData ? toJobList(allData) : jobs

  return (
    <main className="relative isolate min-h-screen bg-black text-white">
      <Navbar />
      <BrowseJobsView jobs={jobs} allJobs={allJobs} />
    </main>
  )
}

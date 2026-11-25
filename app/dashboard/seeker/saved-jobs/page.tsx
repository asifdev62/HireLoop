import type { Metadata } from "next"

import type { SavedJob } from "@/lib/actions/saved-jobs"
import { getSavedJobs } from "@/lib/api/saved-jobs"

import { SavedJobsBrowser } from "./_components/saved-jobs-browser"

export const metadata: Metadata = {
  title: "Saved Jobs · Hireloop",
  description: "Every job you bookmarked, ready when you are.",
}

export default async function SavedJobsPage() {
  let jobs: SavedJob[] = []
  let loadError: string | null = null

  try {
    jobs = await getSavedJobs()
  } catch (error) {
    // A failed request should still render the page with a friendly retry
    // message instead of crashing the whole dashboard.
    console.error("Failed to load saved jobs:", error)
    loadError = "The saved jobs service is not responding right now."
  }

  return <SavedJobsBrowser jobs={jobs} loadError={loadError} />
}

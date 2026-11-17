import "server-only"

import type { JobData } from "../actions/jobs"

/**
 * Public read helpers for server components only.
 *
 * Mutating calls (create/delete/count) live in `lib/actions/job-actions.ts`
 * so they always run with the verified session. They used to live here and
 * were called directly from the browser without any authentication.
 */

const BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000"

export const getJobs = async (query: string = "") => {
  const safeQuery = typeof query === "string" ? query.slice(0, 300) : ""

  const res = await fetch(`${BASE_URL}/jobs?${safeQuery}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return res.json()
}

export const getJobById = async (jobId: string) => {
  if (typeof jobId !== "string" || !/^[a-f0-9]{24}$/i.test(jobId)) {
    throw new Error("Invalid job id")
  }

  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch job")
  }

  return res.json()
}

/** Kept for type compatibility with the recruiter pages. */
export type { JobData }

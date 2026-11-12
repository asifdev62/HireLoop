import { notFound } from "next/navigation"

import { getJobs } from "@/lib/api/jobs"

import type { Job } from "@/app/dashboard/recruiter/_data/jobData"

import Navbar from "@/components/Navbar"

import { JobDetailsView } from "../_components/job-details-view"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
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

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params

  // The jobs API has no single-job endpoint, so fetch the list and pick one.
  const jobs = toJobList(await getJobs(""))

  const job = jobs.find((item) => (item._id ?? item.id) === id)

  if (!job) notFound()

  return (
    <main className="relative isolate min-h-screen bg-black text-white">
      <Navbar />
      <JobDetailsView job={job} />
    </main>
  )
}

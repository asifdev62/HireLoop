import { JobData } from "../actions/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query: string = "") => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`)

  if (!res.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return res.json()
}

//create job

export const createJob = async (data: JobData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create job")
  }

  return res.json()
}

//delete job
export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete job")
  }

  return res.json()
}

//details job
export const getJobById = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`)

  if (!res.ok) {
    throw new Error("Failed to fetch job")
  }

  return res.json()
}

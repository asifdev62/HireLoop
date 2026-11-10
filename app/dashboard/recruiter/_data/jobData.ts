/**
 * Shared job data for the recruiter pages.
 *
 * - add-jobs/page.tsx   -> imports the form type + the dropdown options
 * - manage-jobs/page.tsx -> imports the Job type + the small helper functions
 *
 * Keeping this in one file means both pages always talk about the same job
 * shape, categories, and salary units.
 */

/** A job exactly as it comes back from the API. */
export type Job = {
  _id?: string
  id?: string
  title: string
  companyName: string
  category: string
  department?: string
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  salaryFrequency: string
  responsibilities?: string
  qualifications?: string
  jobType: string
  isRemote: boolean
  // These two are added by the backend later, after candidates start applying.
  applicants?: number
  status?: string
  postedAgo?: string
}

/** What the add-job form keeps in React state (salaries are still text). */
export type JobFormData = {
  title: string
  companyName: string
  category: string
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

/** Starting values for the add-job form. */
export const EMPTY_JOB_FORM: JobFormData = {
  title: "",
  companyName: "",
  category: "",
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  salaryFrequency: "per month",
  responsibilities: "",
  qualifications: "",
}

/** Options for the "Job Category" select. */
export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing",
  "Business",
  "Finance",
  "Customer Support",
  "Other",
]

/** Options for the "Job Type" buttons. */
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]

/** Options for the "Salary Frequency" select. */
export const SALARY_FREQUENCIES = [
  { value: "per hour", label: "Per hour" },
  { value: "per day", label: "Per day" },
  { value: "per month", label: "Per month" },
  { value: "per year", label: "Per year" },
]

// ---------------------------------------------------------------------------
// Small helpers used by the manage-jobs page to display a job.
// ---------------------------------------------------------------------------

const SALARY_UNITS: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per month": "mo",
  "per year": "yr",
}

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
})

/** "Engineering & Tech" -> shown as the department under the job title. */
export function getDepartment(job: Job) {
  return job.department || job.category || "General"
}

/** Turns 25000 / 40000 into "$25k - $40k" + "mo". */
export function formatSalary(job: Job) {
  const unit = SALARY_UNITS[job.salaryFrequency] ?? job.salaryFrequency
  const min = compactNumber.format(Number(job.minSalary)).toLowerCase()
  const max = compactNumber.format(Number(job.maxSalary)).toLowerCase()

  return {
    range: `$${min} - $${max}`,
    unit,
  }
}

/** "2026-12-31" -> "Dec 31, 2026". */
export function formatDate(date: string) {
  if (!date) return "Not specified"

  const value = new Date(`${date}T00:00:00Z`)

  if (Number.isNaN(value.getTime())) return date

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** A job is expired when its deadline has passed (or the API says so). */
export function getStatus(job: Job): "Active" | "Expired" {
  if (job.deadline) {
    const deadline = new Date(`${job.deadline}T23:59:59Z`)

    if (!Number.isNaN(deadline.getTime()) && deadline < new Date()) {
      return "Expired"
    }
  }

  return job.status === "Expired" ? "Expired" : "Active"
}

/** Remote jobs show the city in brackets: "Remote (Dhaka)". */
export function formatLocation(job: Job) {
  return job.isRemote ? `Remote (${job.location})` : job.location
}

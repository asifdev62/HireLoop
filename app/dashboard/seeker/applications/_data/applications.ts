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

/** "2 hours ago", "1 day ago", "3 weeks ago", ... */
export function formatAppliedAgo(date: string) {
  const applied = new Date(date).getTime()

  if (Number.isNaN(applied)) return date

  const minutes = Math.max(0, Math.round((Date.now() - applied) / 60_000))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.round(minutes / 60)

  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.round(hours / 24)

  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  const weeks = Math.round(days / 7)

  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

  const months = Math.round(days / 30)

  return `${months} month${months === 1 ? "" : "s"} ago`
}

/** A stable colour for the company initial, based on the company name. */
const LOGO_STYLES = [
  "border-[#5C53FE]/25 bg-[#5C53FE]/10 text-[#A79EFF]",
  "border-orange-500/25 bg-orange-500/10 text-orange-400",
  "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  "border-rose-500/25 bg-rose-500/10 text-rose-400",
  "border-sky-500/25 bg-sky-500/10 text-sky-400",
  "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300",
]

export function companyLogoClass(companyName: string) {
  let hash = 0

  for (const char of companyName) {
    hash = (hash + char.charCodeAt(0)) % LOGO_STYLES.length
  }

  return LOGO_STYLES[hash]
}

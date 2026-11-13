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

// Dummy data until `getMyApplications` is wired to the API.
// Dates are relative to "now" so the "Applied" column always reads naturally.
const now = Date.now()
const hoursAgo = (hours: number) =>
  new Date(now - hours * 60 * 60 * 1000).toISOString()
const daysAgo = (days: number) => hoursAgo(days * 24)

export const DUMMY_APPLICATIONS: ApplicationRow[] = [
  {
    _id: "app-01",
    jobId: "job-01",
    jobTitle: "Senior Frontend Engineer",
    companyName: "Stark Industries",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: hoursAgo(2),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-02",
    jobId: "job-02",
    jobTitle: "Product Designer",
    companyName: "Cyberdyne Systems",
    jobType: "Contract",
    location: "Hybrid",
    appliedAt: hoursAgo(26),
    status: "Review",
    archived: false,
  },
  {
    _id: "app-03",
    jobId: "job-03",
    jobTitle: "Lead Data Scientist",
    companyName: "Wayne Enterprises",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(4),
    status: "Shortlisted",
    archived: false,
  },
  {
    _id: "app-04",
    jobId: "job-04",
    jobTitle: "Cloud Architect",
    companyName: "Oscorp Tech",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(7),
    status: "Rejected",
    archived: false,
  },
  {
    _id: "app-05",
    jobId: "job-05",
    jobTitle: "AI Research Engineer",
    companyName: "Hooli Corp",
    jobType: "Full-time",
    location: "Hybrid",
    appliedAt: daysAgo(14),
    status: "Offered",
    archived: false,
  },
  {
    _id: "app-06",
    jobId: "job-06",
    jobTitle: "Backend Engineer (Node.js)",
    companyName: "Initech",
    jobType: "Full-time",
    location: "On-site",
    appliedAt: hoursAgo(5),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-07",
    jobId: "job-07",
    jobTitle: "DevOps Engineer",
    companyName: "Umbrella Labs",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(2),
    status: "Review",
    archived: false,
  },
  {
    _id: "app-08",
    jobId: "job-08",
    jobTitle: "Mobile Engineer (React Native)",
    companyName: "Pied Piper",
    jobType: "Contract",
    location: "Remote",
    appliedAt: daysAgo(5),
    status: "Shortlisted",
    archived: false,
  },
  {
    _id: "app-09",
    jobId: "job-09",
    jobTitle: "UX Researcher",
    companyName: "Soylent Corp",
    jobType: "Part-time",
    location: "Remote",
    appliedAt: daysAgo(6),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-10",
    jobId: "job-10",
    jobTitle: "Machine Learning Engineer",
    companyName: "Massive Dynamic",
    jobType: "Full-time",
    location: "Hybrid",
    appliedAt: daysAgo(8),
    status: "Rejected",
    archived: false,
  },
  {
    _id: "app-11",
    jobId: "job-11",
    jobTitle: "Frontend Developer",
    companyName: "Globex",
    jobType: "Full-time",
    location: "On-site",
    appliedAt: daysAgo(9),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-12",
    jobId: "job-12",
    jobTitle: "Platform Engineer",
    companyName: "Vandelay Industries",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(10),
    status: "Offered",
    archived: false,
  },
  {
    _id: "app-13",
    jobId: "job-13",
    jobTitle: "Data Analyst",
    companyName: "Acme Corp",
    jobType: "Internship",
    location: "On-site",
    appliedAt: daysAgo(11),
    status: "Rejected",
    archived: false,
  },
  {
    _id: "app-14",
    jobId: "job-14",
    jobTitle: "Full Stack Developer",
    companyName: "Wonka Tech",
    jobType: "Contract",
    location: "Remote",
    appliedAt: daysAgo(12),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-15",
    jobId: "job-15",
    jobTitle: "Security Engineer",
    companyName: "Cyberdyne Systems",
    jobType: "Full-time",
    location: "Hybrid",
    appliedAt: daysAgo(13),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-16",
    jobId: "job-16",
    jobTitle: "Product Manager",
    companyName: "Stark Industries",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(15),
    status: "Review",
    archived: false,
  },
  {
    _id: "app-17",
    jobId: "job-17",
    jobTitle: "QA Automation Engineer",
    companyName: "Initech",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(16),
    status: "Shortlisted",
    archived: false,
  },
  {
    _id: "app-18",
    jobId: "job-18",
    jobTitle: "Site Reliability Engineer",
    companyName: "Hooli Corp",
    jobType: "Full-time",
    location: "Hybrid",
    appliedAt: daysAgo(18),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-19",
    jobId: "job-19",
    jobTitle: "UI Engineer",
    companyName: "Pied Piper",
    jobType: "Contract",
    location: "Remote",
    appliedAt: daysAgo(20),
    status: "Shortlisted",
    archived: false,
  },
  {
    _id: "app-20",
    jobId: "job-20",
    jobTitle: "Data Engineer",
    companyName: "Wayne Enterprises",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(22),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-21",
    jobId: "job-21",
    jobTitle: "Solutions Architect",
    companyName: "Oscorp Tech",
    jobType: "Full-time",
    location: "On-site",
    appliedAt: daysAgo(24),
    status: "Rejected",
    archived: false,
  },
  {
    _id: "app-22",
    jobId: "job-22",
    jobTitle: "Growth Engineer",
    companyName: "Acme Corp",
    jobType: "Full-time",
    location: "Remote",
    appliedAt: daysAgo(26),
    status: "Applied",
    archived: false,
  },
  {
    _id: "app-23",
    jobId: "job-23",
    jobTitle: "Technical Writer",
    companyName: "Globex",
    jobType: "Part-time",
    location: "Remote",
    appliedAt: daysAgo(28),
    status: "Shortlisted",
    archived: false,
  },
  {
    _id: "app-24",
    jobId: "job-24",
    jobTitle: "Staff Software Engineer",
    companyName: "Massive Dynamic",
    jobType: "Full-time",
    location: "Hybrid",
    appliedAt: daysAgo(30),
    status: "Offered",
    archived: false,
  },
  {
    _id: "app-25",
    jobId: "job-25",
    jobTitle: "Junior Developer",
    companyName: "Vandelay Industries",
    jobType: "Internship",
    location: "On-site",
    appliedAt: daysAgo(60),
    status: "Rejected",
    archived: true,
  },
  {
    _id: "app-26",
    jobId: "job-26",
    jobTitle: "Support Engineer",
    companyName: "Soylent Corp",
    jobType: "Part-time",
    location: "Remote",
    appliedAt: daysAgo(75),
    status: "Offered",
    archived: true,
  },
]

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

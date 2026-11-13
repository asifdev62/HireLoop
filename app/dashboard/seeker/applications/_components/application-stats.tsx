import type { ApplicationStatus } from "@/lib/actions/applications"

import type { ApplicationRow } from "../_data/applications"

// "Shortlisted" counts everything that moved past the first review.
const SHORTLISTED_STATUSES: ApplicationStatus[] = [
  "Shortlisted",
  "Interview",
  "Offered",
]

// "Interviews" counts the applications that reached an interview or an offer.
const INTERVIEW_STATUSES: ApplicationStatus[] = ["Interview", "Offered"]

export function ApplicationStats({
  applications,
}: {
  applications: ApplicationRow[]
}) {
  const total = applications.length
  const shortlisted = applications.filter((application) =>
    SHORTLISTED_STATUSES.includes(application.status)
  ).length
  const interviews = applications.filter((application) =>
    INTERVIEW_STATUSES.includes(application.status)
  ).length

  // 3 interviews out of 24 applications -> 12%.
  const successRate = total === 0 ? 0 : Math.floor((interviews / total) * 100)

  const stats = [
    { label: "Total Applied", value: String(total), tone: "text-white" },
    {
      label: "Shortlisted",
      value: String(shortlisted),
      tone: "text-white",
    },
    { label: "Interviews", value: String(interviews), tone: "text-white" },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      tone: "text-emerald-400",
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, tone }) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.07] bg-[#101014] p-4 sm:p-5"
        >
          <dt className="text-xs text-zinc-500">{label}</dt>
          <dd className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

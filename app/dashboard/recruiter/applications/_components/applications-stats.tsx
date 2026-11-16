import type { ApplicationStatus } from "@/lib/actions/applications"

import type { RecruiterApplication } from "../_data/applications"

const IN_PROGRESS_STATUSES: ApplicationStatus[] = [
  "Review",
  "Shortlisted",
  "Interview",
]

export function ApplicationsStats({
  applications,
}: {
  applications: RecruiterApplication[]
}) {
  const total = applications.length
  const fresh = applications.filter(
    (application) => application.status === "Applied"
  ).length
  const inProgress = applications.filter((application) =>
    IN_PROGRESS_STATUSES.includes(application.status)
  ).length
  const hired = applications.filter(
    (application) => application.status === "Offered"
  ).length

  const stats = [
    { label: "Total Applications", value: total, tone: "text-white" },
    { label: "New", value: fresh, tone: "text-white" },
    { label: "In Progress", value: inProgress, tone: "text-[#A79EFF]" },
    { label: "Hired", value: hired, tone: "text-emerald-400" },
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

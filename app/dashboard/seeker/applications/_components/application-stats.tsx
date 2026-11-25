import type { LucideIcon } from "lucide-react"
import { CalendarClock, ListChecks, Send, TrendingUp } from "lucide-react"

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

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-4 transition-colors hover:border-white/15">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ background: accent }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <dt className="text-[10px] font-medium tracking-[0.14em] text-zinc-500 uppercase">
          {label}
        </dt>
        <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <dd className="relative mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </dd>
      <dd className="relative mt-0.5 truncate text-[11px] text-zinc-500">
        {hint}
      </dd>
    </div>
  )
}

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
    {
      label: "Total applied",
      value: total.toLocaleString(),
      hint: "applications sent",
      icon: Send,
      accent: "rgba(124,101,255,0.55)",
    },
    {
      label: "Shortlisted",
      value: shortlisted.toLocaleString(),
      hint: "moved past review",
      icon: ListChecks,
      accent: "rgba(56,189,248,0.5)",
    },
    {
      label: "Interviews",
      value: interviews.toLocaleString(),
      hint: "interviews or offers",
      icon: CalendarClock,
      accent: "rgba(251,191,36,0.5)",
    },
    {
      label: "Success rate",
      value: `${successRate}%`,
      hint: `${interviews} of ${total} applications`,
      icon: TrendingUp,
      accent: "rgba(52,211,153,0.45)",
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
          accent={stat.accent}
        />
      ))}
    </dl>
  )
}

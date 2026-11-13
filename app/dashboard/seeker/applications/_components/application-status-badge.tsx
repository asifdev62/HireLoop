import type { ApplicationStatus } from "@/lib/actions/applications"

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-white/10 bg-white/[0.03] text-zinc-300",
  Review: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Shortlisted: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  Interview: "border-[#5C53FE]/25 bg-[#5C53FE]/10 text-[#A79EFF]",
  Offered: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Rejected: "border-rose-500/20 bg-rose-500/10 text-rose-400",
}

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
        STATUS_STYLES[status] ?? STATUS_STYLES.Applied
      }`}
    >
      {status}
    </span>
  )
}

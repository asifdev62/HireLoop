import { isNewSignup, type ManagedUser } from "../_data/users"

type Stat = {
  label: string
  value: number
  tone: string
  dotClass: string
  hint: string
}

export function UsersStats({ users }: { users: ManagedUser[] }) {
  const total = users.length
  const active = users.filter((user) => !user.banned).length
  const recruiters = users.filter((user) => user.role === "recruiter").length
  const suspended = users.filter((user) => user.banned).length
  const newSignups = users.filter((user) => isNewSignup(user.createdAt)).length

  const share = (count: number) =>
    total === 0
      ? "No accounts yet"
      : `${Math.round((count / total) * 100)}% of all accounts`

  const stats: Stat[] = [
    {
      label: "Total Active Users",
      value: active,
      tone: "text-white",
      dotClass: "bg-emerald-400",
      hint: share(active),
    },
    {
      label: "Recruiters",
      value: recruiters,
      tone: "text-[#A79EFF]",
      dotClass: "bg-[#7C65FF]",
      hint: share(recruiters),
    },
    {
      label: "Suspended Accounts",
      value: suspended,
      tone: "text-rose-400",
      dotClass: "bg-rose-400",
      hint: share(suspended),
    },
    {
      label: "New Signups (24h)",
      value: newSignups,
      tone: "text-emerald-400",
      dotClass: "bg-emerald-400",
      hint: "Joined in the last 24 hours",
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, tone, dotClass, hint }) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.07] bg-[#101014] p-4 sm:p-5"
        >
          <dt className="text-xs text-zinc-500">{label}</dt>
          <dd className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>
            {value}
          </dd>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span
              aria-hidden="true"
              className={`size-1 rounded-full ${dotClass}`}
            />
            {hint}
          </p>
        </div>
      ))}
    </dl>
  )
}

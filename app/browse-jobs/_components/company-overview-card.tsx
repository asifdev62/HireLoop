/**
 * The "Company Overview" card on the right side of the job details page.
 * It shows a placeholder cover, the company size/industry, and a website button.
 */

// The API does not have a company size yet, so the card shows fixed text.
const COMPANY_SIZE = "250 - 500 Employees"

type CompanyOverviewCardProps = {
  companyName: string
  industry: string
  department: string
}

export function CompanyOverviewCard({
  companyName,
  industry,
  department,
}: CompanyOverviewCardProps) {
  const initial = companyName.charAt(0).toUpperCase() || "J"

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#101014] p-5">
      <h2 className="text-base font-semibold text-white">Company Overview</h2>

      {/* The API has no company image yet, so this is a placeholder. */}
      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0E]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(92,83,254,0.35),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(56,189,248,0.18),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] [background-size:28px_28px] opacity-20"
        />

        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold text-white backdrop-blur-sm">
            {initial}
          </span>
          <span className="text-sm font-medium text-white/80">
            {companyName}
          </span>
          <span className="text-[11px] text-white/45">{department}</span>
        </div>
      </div>

      <dl className="mt-5 space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            Size
          </dt>
          <dd className="text-xs font-medium text-zinc-300">{COMPANY_SIZE}</dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            Industry
          </dt>
          <dd className="truncate text-xs font-medium text-zinc-300">
            {industry || "Not specified"}
          </dd>
        </div>
      </dl>

      {/* TODO: link to the company website when the API has one. */}
      <button
        type="button"
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
      >
        Visit Website
      </button>
    </section>
  )
}

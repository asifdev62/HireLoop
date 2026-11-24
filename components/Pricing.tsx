"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Lock,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type PlanRole = "seeker" | "recruiter"

type Plan = {
  role: PlanRole
  name: string
  tagline: string
  price: string
  period: string
  icon: LucideIcon
  featured?: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    role: "seeker",
    name: "Seeker Pro",
    tagline: "For candidates who apply seriously.",
    price: "$20",
    period: "one-time",
    icon: UserRound,
    featured: true,
    features: [
      "Unlimited job applications",
      "Track every application status",
      "Keep your full application history",
      "Apply with resume, cover letter & portfolio",
    ],
  },
  {
    role: "recruiter",
    name: "Recruiter Pro",
    tagline: "For teams that hire without limits.",
    price: "$50",
    period: "per month",
    icon: BriefcaseBusiness,
    features: [
      "Unlimited job postings",
      "Review every applicant per job",
      "Move candidates through the pipeline",
      "Cancel or change your plan anytime",
    ],
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

const primaryCta =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5C53FE] px-5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(92,83,254,0.4)] transition-all hover:bg-[#4f46e5] hover:shadow-[0_4px_20px_rgba(92,83,254,0.6)] focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none active:scale-[0.99]"

const mutedCta =
  "inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-5 text-center text-sm font-medium text-zinc-500"

function PlanAction({
  planRole,
  price,
  role,
  isPending,
}: {
  planRole: PlanRole
  price: string
  role?: string
  isPending: boolean
}) {
  if (isPending) {
    return (
      <div
        aria-hidden="true"
        className="mt-6 h-11 w-full animate-pulse rounded-xl bg-white/5"
      />
    )
  }

  if (!role) {
    return (
      <Link href="/sign-up" className={cn(primaryCta, "mt-6")}>
        Create a free account
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    )
  }

  if (role === planRole) {
    return (
      <Link href="/payment" className={cn(primaryCta, "mt-6")}>
        Upgrade for {price}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    )
  }

  return (
    <span className={cn(mutedCta, "mt-6")}>
      {role === "admin"
        ? "Admin accounts don't need a plan"
        : `Available for ${planRole} accounts`}
    </span>
  )
}

/**
 * The two plan cards plus the free-tier note. Shared by the home page and
 * /pricing so both always show the same prices and buttons.
 */
export function PricingCards({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession()
  const role = session?.user?.role ?? undefined

  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-2">
        {PLANS.map((plan) => {
          const Icon = plan.icon

          return (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-3xl border p-6 sm:p-8",
                plan.featured
                  ? "border-[#5C53FE]/40 bg-[#12121A] shadow-[0_30px_80px_-24px_rgba(92,83,254,0.45)]"
                  : "border-white/10 bg-white/[0.03]"
              )}
            >
              {plan.featured ? (
                <span className="absolute top-5 right-5 rounded-full border border-[#5C53FE]/30 bg-[#5C53FE]/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#A79FFF] uppercase">
                  Most popular
                </span>
              ) : null}

              <span className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#A79FFF]">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="pb-1.5 text-sm text-zinc-500">
                  {plan.period}
                </span>
              </div>

              <PlanAction
                planRole={plan.role}
                price={plan.price}
                role={role}
                isPending={isPending}
              />

              <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5C53FE]/15 text-[#A79FFF]">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.article>
          )
        })}
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-zinc-300">
          <span className="font-semibold text-white">Free forever:</span> up to
          2 applications or 2 job posts, no card required.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
        >
          Start free
        </Link>
      </div>

      <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-xs text-zinc-500 sm:flex-row sm:gap-8">
        <li className="flex items-center gap-2">
          <Lock className="size-3.5 text-zinc-600" aria-hidden="true" />
          Secure checkout with Stripe
        </li>
        <li className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-zinc-600" aria-hidden="true" />
          Instant access after payment
        </li>
        <li className="flex items-center gap-2">
          <Check className="size-3.5 text-zinc-600" aria-hidden="true" />
          No hidden fees
        </li>
      </ul>
    </div>
  )
}

/** Home page section: pricing cards right after the features grid. */
export default function Pricing() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-4 pt-8 pb-20 text-white sm:px-6 sm:pt-10 sm:pb-24 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(92,83,254,0.16),transparent)]"
      />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[#7C65FF]" />
            <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400 uppercase sm:text-xs">
              Pricing
            </span>
            <span className="size-1.5 rounded-full bg-[#7C65FF]" />
          </div>

          <h2 className="mx-auto mt-4 max-w-2xl bg-linear-to-b from-white via-white to-zinc-500 bg-clip-text text-3xl leading-tight font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Simple pricing for
            <span className="block">serious work</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Start free. Upgrade when you need more applications or more job
            posts.
          </p>
        </motion.div>

        <PricingCards className="mt-10 sm:mt-12" />
      </div>
    </section>
  )
}

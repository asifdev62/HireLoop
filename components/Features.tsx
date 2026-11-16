"use client"

import { motion } from "framer-motion"
import {
  BarChart3,
  Bookmark,
  FileText,
  LineChart,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: LineChart,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: BarChart3,
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: Sparkles,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: Target,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

const container = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { staggerChildren: 0.07, delayChildren: 0.05 },
}

const cardVariant = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE },
}

export default function Features() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-4 pt-10 pb-20 text-white sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
      {/* Ambient glow behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(92,83,254,0.12),transparent)]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
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
              Features Job
            </span>
            <span className="size-1.5 rounded-full bg-[#7C65FF]" />
          </div>

          <h2 className="mx-auto mt-4 max-w-2xl bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-3xl leading-tight font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Everything you need
            <span className="block">to succeed</span>
          </h2>
        </motion.div>

        {/* Feature grid */}
        <motion.ul
          variants={container}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <motion.li
              key={title}
              variants={cardVariant}
              className="group flex items-start gap-3.5 rounded-xl border border-white/[0.08] bg-[#0d0e13]/80 p-4 transition-colors duration-300 hover:border-white/20 hover:bg-[#121319]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors group-hover:text-white">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

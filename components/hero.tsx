"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Search } from "lucide-react"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const EASE = [0.22, 1, 0.36, 1] as const

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE },
}

const statsStaggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  },
}

const statCardVariant = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE },
}

export default function Hero() {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <section className="relative isolate overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-32 text-white">
      {/* Top subtle cosmic ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(92,83,254,0.18),transparent)]"
      />

      {/* Top Hero Container: Frame 2147234456 (784px max-width) in Figma */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {/* Top Announcement Pill: Frame 2147234462 & Frame 2147234446 */}
        <motion.div
          {...fadeInUp}
          className="flex items-center justify-center gap-3"
        >
          {/* Left gradient line */}
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-white/40" />

          {/* Pill capsule */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-gradient-to-b from-[#474747] to-[#010102] px-5 py-2 shadow-[inset_0_0_6px_rgba(0,0,0,0.4)] backdrop-blur-md">
            {/* Briefcase Icon (fi_5517030 in Figma) */}
            <span className="flex size-5 items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Handle */}
                <path
                  d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7"
                  stroke="#E0E7FF"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                {/* Body */}
                <rect
                  x="3"
                  y="7"
                  width="18"
                  height="13"
                  rx="3"
                  fill="url(#briefcase-grad)"
                  stroke="#C86D36"
                  strokeWidth="1.2"
                />
                {/* Clasp */}
                <rect x="10.5" y="11" width="3" height="3" rx="0.75" fill="#FEE45A" />
                <defs>
                  <linearGradient
                    id="briefcase-grad"
                    x1="12"
                    y1="7"
                    x2="12"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#C86D36" />
                    <stop offset="1" stopColor="#883F2E" />
                  </linearGradient>
                </defs>
              </svg>
            </span>

            {/* Pill Text */}
            <span className="font-mono text-xs sm:text-sm font-medium tracking-wide text-white">
              50,000+ new jobs this month
            </span>
          </div>

          {/* Right gradient line */}
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>

        {/* Hero Title & Subtitle: Hero Section Title in Figma */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-8 space-y-4 sm:space-y-5"
        >
          {/* Main Heading: Manrope Bold 56px */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.12]">
            Find Your Dream Job Today
          </h1>

          {/* Subtitle: Manrope Regular 20px */}
          <p className="mx-auto max-w-[784px] text-base sm:text-lg md:text-xl font-normal leading-relaxed text-zinc-300">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>
        </motion.div>

        {/* Search Bar Capsule: Frame 1 (784x64, r:16, #101010, stroke: white/0.2) in Figma */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex justify-center sm:mt-10"
        >
          <form
            onSubmit={handleSearch}
            className="w-full max-w-[784px] rounded-2xl border border-white/20 bg-[#101010] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all focus-within:border-white/35 sm:p-2.5 sm:px-5"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0">
              {/* Role / Job title input (Frame 2147234459) */}
              <div className="flex flex-1 items-center px-2 py-1 sm:py-0">
                <Search className="mr-3 size-5 shrink-0 text-white/70" strokeWidth={1.75} />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Vertical Divider (Line 1) */}
              <div className="hidden h-6 w-px bg-white/20 sm:block mx-3" />

              {/* Location input (Frame 2147234458) */}
              <div className="flex flex-1 items-center border-t border-white/10 px-2 py-1 pt-2 sm:border-t-0 sm:py-0 sm:pt-0">
                <MapPin className="mr-3 size-5 shrink-0 text-white/70" strokeWidth={1.75} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Remote"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Search Button (Buttons 48x48, r:12, #5C53FE in Figma) */}
              <button
                type="submit"
                aria-label="Search jobs"
                className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-[#5C53FE] text-white shadow-[0_0_20px_rgba(92,83,254,0.4)] transition-all hover:bg-[#4f46e5] active:scale-95 cursor-pointer"
              >
                <Search className="size-5 text-white" strokeWidth={2} />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Trending Positions: Frame 2147234453 in Figma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-sm"
        >
          <span className="font-normal text-zinc-300 mr-1">Trending Position</span>
          {trendingPositions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setRole(tag)}
              className="inline-flex h-[33px] items-center rounded-full border border-white/10 bg-[#1A1A1B] px-3.5 text-xs sm:text-sm text-white transition-all hover:border-white/25 hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Globe & Stats Section: Frame 2147234448 & Globe in Figma */}
      <div className="relative mt-14 sm:mt-20">
        {/* Globe Background Graphic & Ambient Glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-16 flex justify-center overflow-hidden sm:-top-24 md:-top-32">
          <div className="relative w-[900px] shrink-0 sm:w-[1200px] lg:w-[1440px]">
            <Image
              src="/images/globe.png"
              alt="HireLoop Global Network"
              width={1440}
              height={1882}
              priority
              className="w-full -translate-y-[38%] object-contain opacity-95"
            />
          </div>
        </div>

        {/* Headline over the Globe: Instrument Sans Medium 40px in Figma */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-4 pt-16 text-center sm:pt-24 md:pt-28"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium tracking-tight text-white/75 leading-tight">
            Assisting over{" "}
            <span className="font-bold text-white">15,000 job seekers</span>
            <br className="hidden sm:inline" />{" "}
            <span>find their dream positions.</span>
          </h2>
        </motion.div>

        {/* 4 Stats Cards: Container (1320px) & Stats 2, 7, 6, 5 in Figma */}
        <motion.div
          variants={statsStaggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 mx-auto mt-12 max-w-[1320px] px-4 sm:mt-16 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Active Jobs (Stats 2 in Figma) */}
            <motion.div
              variants={statCardVariant}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex min-h-[220px] sm:min-h-[254px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* hugeicons:job-search in Figma */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-zinc-300 transition-colors group-hover:text-white"
                  >
                    <rect width="18" height="14" x="3" y="6" rx="2" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <circle cx="12" cy="13" r="2" />
                    <path d="m13.5 14.5 2 2" />
                  </svg>
                </div>
              </div>
              <div>
                {/* 56px SemiBold */}
                <div className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-white leading-none">
                  50K
                </div>
                {/* 18px Regular */}
                <div className="mt-4 text-base sm:text-lg font-normal text-zinc-400">
                  Active Jobs
                </div>
              </div>
            </motion.div>

            {/* Card 2: Companies (Stats 7 in Figma) */}
            <motion.div
              variants={statCardVariant}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex min-h-[220px] sm:min-h-[254px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* icon-park:ranking in Figma */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-zinc-300 transition-colors group-hover:text-white"
                  >
                    <path d="M4 20h16" />
                    <rect x="4" y="10" width="4" height="10" rx="1" />
                    <rect x="10" y="4" width="4" height="16" rx="1" />
                    <rect x="16" y="13" width="4" height="7" rx="1" />
                  </svg>
                </div>
              </div>
              <div>
                {/* 56px SemiBold */}
                <div className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-white leading-none">
                  12K
                </div>
                {/* 18px Regular */}
                <div className="mt-4 text-base sm:text-lg font-normal text-zinc-400">
                  Companies
                </div>
              </div>
            </motion.div>

            {/* Card 3: Job Seekers (Stats 6 in Figma) */}
            <motion.div
              variants={statCardVariant}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex min-h-[220px] sm:min-h-[254px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* streamline-ultimate:job-search-man in Figma */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-zinc-300 transition-colors group-hover:text-white"
                  >
                    <circle cx="10" cy="8" r="4" />
                    <path d="M3 20c0-3.5 3-6 7-6" />
                    <circle cx="17.5" cy="16.5" r="3.5" />
                    <path d="m20 19 2 2" />
                  </svg>
                </div>
              </div>
              <div>
                {/* 56px SemiBold */}
                <div className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-white leading-none">
                  2M
                </div>
                {/* 18px Regular */}
                <div className="mt-4 text-base sm:text-lg font-normal text-zinc-400">
                  Job Seekers
                </div>
              </div>
            </motion.div>

            {/* Card 4: Satisfaction Rate (Stats 5 in Figma) */}
            <motion.div
              variants={statCardVariant}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex min-h-[220px] sm:min-h-[254px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* material-symbols:star-rate-outline-rounded in Figma */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-zinc-300 transition-colors group-hover:text-white"
                  >
                    <path d="m12 2.5 2.95 6.27 6.85.95-5 4.8 1.25 6.88L12 18.05l-6.05 3.35 1.25-6.88-5-4.8 6.85-.95L12 2.5z" />
                  </svg>
                </div>
              </div>
              <div>
                {/* 56px SemiBold */}
                <div className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-white leading-none">
                  97%
                </div>
                {/* 18px Regular */}
                <div className="mt-4 text-base sm:text-lg font-normal text-zinc-400">
                  Satisfaction Rate
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
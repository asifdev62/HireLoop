"use client"

import React, { useState } from "react"
import Image from "next/image"
import { MapPin, Search, Star, TrendingUp } from "lucide-react"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

export default function Hero() {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <section className="relative isolate overflow-hidden pt-6 pb-20 sm:pt-12 sm:pb-28">
      {/* Top subtle cosmic ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.18),transparent)]"
      />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-linear-to-r from-transparent to-white/20 sm:w-16" />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#15161b]/80 px-3.5 py-1 text-xs text-zinc-300 shadow-sm backdrop-blur-md">
            <span className="text-xs">💼</span>
            <span className="font-bold text-white">50,000+</span>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase sm:text-[11px]">
              NEW JOBS THIS MONTH
            </span>
          </div>
          <div className="h-px w-8 bg-linear-to-l from-transparent to-white/20 sm:w-16" />
        </div>

        {/* Main Heading */}
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search Bar Capsule */}
        <div className="mt-8 flex justify-center sm:mt-10">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121316]/90 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all focus-within:border-white/20 sm:rounded-full sm:p-2"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
              {/* Job title / skill */}
              <div className="flex flex-1 items-center px-3 py-1.5 sm:py-0">
                <Search className="mr-2.5 size-4 shrink-0 text-zinc-400 sm:size-4.5" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Vertical divider */}
              <div className="hidden h-6 w-px bg-white/10 sm:block" />

              {/* Location */}
              <div className="flex flex-1 items-center border-t border-white/5 px-3 py-1.5 sm:border-t-0 sm:py-0">
                <MapPin className="mr-2.5 size-4 shrink-0 text-zinc-400 sm:size-4.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Remote"
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                aria-label="Search jobs"
                className="flex h-10 w-full items-center justify-center rounded-xl bg-[#4f46e5] text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all hover:bg-[#4338ca] active:scale-95 sm:h-11 sm:w-11 sm:shrink-0"
              >
                <Search className="size-4.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Trending Positions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-zinc-400">
            <TrendingUp className="size-3.5 text-cyan-400" />
            <span>Trending Position</span>
          </div>
          {trendingPositions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setRole(tag)}
              className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Globe & Stats Section */}
      <div className="relative mt-10 sm:mt-14">
        {/* Globe Background Graphic & Ambient Glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-16 flex justify-center overflow-hidden sm:-top-24">
          <div className="relative w-[850px] shrink-0 sm:w-[1150px] lg:w-[1380px]">
            <Image
              src="/images/globe.png"
              alt="HireLoop Network Globe"
              width={1440}
              height={1882}
              priority
              className="w-full -translate-y-[39%] object-contain opacity-95"
            />
          </div>
        </div>

        {/* Headline over the Globe */}
        <div className="relative z-10 px-4 pt-14 text-center sm:pt-20 md:pt-24">
          <h2 className="text-xl font-medium tracking-tight text-white/95 sm:text-2xl md:text-3xl">
            Assisting over{" "}
            <span className="font-bold text-white">15,000 job seekers</span>
          </h2>
          <p className="mt-1 text-xl font-medium tracking-tight text-zinc-300 sm:text-2xl md:text-3xl">
            find their dream positions.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="relative z-10 mx-auto mt-12 max-w-6xl px-4 sm:mt-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {/* Card 1: Active Jobs */}
            <div className="group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0e13]/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#121319]/90 sm:min-h-[175px] sm:p-7">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-zinc-400 transition-colors group-hover:text-white"
                >
                  <rect width="18" height="14" x="3" y="6" rx="2" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <circle cx="12" cy="13" r="1" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  50K
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                  Active Jobs
                </div>
              </div>
            </div>

            {/* Card 2: Companies */}
            <div className="group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0e13]/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#121319]/90 sm:min-h-[175px] sm:p-7">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-zinc-400 transition-colors group-hover:text-white"
                >
                  <path d="M4 20h16" />
                  <path d="M6 20V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v14" />
                  <path d="M13 20v-8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v14" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  12K
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                  Companies
                </div>
              </div>
            </div>

            {/* Card 3: Job Seekers */}
            <div className="group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0e13]/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#121319]/90 sm:min-h-[175px] sm:p-7">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-zinc-400 transition-colors group-hover:text-white"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  2M
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                  Job Seekers
                </div>
              </div>
            </div>

            {/* Card 4: Satisfaction Rate */}
            <div className="group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0e13]/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#121319]/90 sm:min-h-[175px] sm:p-7">
              <div>
                <Star className="size-5 stroke-[1.5] text-zinc-400 transition-colors group-hover:text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  97%
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
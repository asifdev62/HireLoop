"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Job } from "../../_data/jobData"

const selectContentClass = "border-white/10 bg-[#1C1C20] text-white"

type ApplicationsToolbarProps = {
  jobs: Job[]
  jobFilter: string
  search: string
  onJobFilterChange: (jobId: string) => void
  onSearchChange: (value: string) => void
}

/** Candidate search + job filter, shown above the applications table. */
export function ApplicationsToolbar({
  jobs,
  jobFilter,
  search,
  onJobFilterChange,
  onSearchChange,
}: ApplicationsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search candidates..."
          aria-label="Search candidates"
          className="border-white/10 bg-[#1C1C20] pl-9 text-white placeholder:text-zinc-500 focus-visible:ring-[#5C53FE]"
        />
      </div>

      <div className="w-full sm:w-64">
        <Select
          value={jobFilter}
          onValueChange={(value) => onJobFilterChange(value ?? "all")}
        >
          <SelectTrigger
            className="w-full border-white/10 bg-[#1C1C20] text-white data-[placeholder]:text-zinc-500"
            aria-label="Filter by job"
          >
            <SelectValue placeholder="All jobs" />
          </SelectTrigger>

          <SelectContent className={selectContentClass}>
            <SelectItem value="all">All jobs</SelectItem>

            {jobs.map((job) => {
              const jobId = job._id || job.id

              if (!jobId) return null

              return (
                <SelectItem key={jobId} value={jobId}>
                  {job.title}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

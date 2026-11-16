"use client"

import { ChevronDown } from "lucide-react"

import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/actions/applications"

type ApplicationStatusSelectProps = {
  value: ApplicationStatus
  onChange: (status: ApplicationStatus) => void
  /** Screen-reader label, e.g. "Status for Ayesha Rahman". */
  label: string
  className?: string
}

/**
 * Status picker for one application.
 *
 * The page keeps the choice in local state for now; the database write comes
 * later, so this component only reports the selected status upwards.
 */
export function ApplicationStatusSelect({
  value,
  onChange,
  label,
  className = "",
}: ApplicationStatusSelectProps) {
  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ApplicationStatus)}
        className="h-8 w-full appearance-none rounded-lg border border-white/10 bg-[#101014] pr-8 pl-2.5 text-xs text-zinc-200 transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
      >
        {APPLICATION_STATUSES.map((status) => (
          <option key={status} value={status} className="bg-[#101014]">
            {status}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-2 size-3.5 text-zinc-500"
        aria-hidden="true"
      />
    </label>
  )
}

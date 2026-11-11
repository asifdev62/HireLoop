"use client"

/**
 * Simple page switcher for the job list. It renders nothing when everything
 * fits on a single page.
 */

import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const pageButtonClass =
  "flex size-8 items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Job list pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${pageButtonClass} border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white`}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage

        return (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`${pageButtonClass} ${
              isCurrent
                ? "bg-white text-[#09090B]"
                : "border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${pageButtonClass} border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white`}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

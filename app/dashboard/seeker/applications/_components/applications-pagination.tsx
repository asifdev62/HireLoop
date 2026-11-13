import { ChevronLeft, ChevronRight } from "lucide-react"

/** 1 … 4 5 6 … 12 */
function getPageItems(current: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = [...new Set([1, totalPages, current - 1, current, current + 1])]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b)

  const items: (number | "gap")[] = []
  let previous = 0

  for (const page of pages) {
    if (previous && page - previous > 1) items.push("gap")
    items.push(page)
    previous = page
  }

  return items
}

type ApplicationsPaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function ApplicationsPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: ApplicationsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3 sm:flex-row">
      <p className="text-[11px] text-zinc-500">
        Showing {first}-{last} of {total} application{total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-[11px] text-zinc-600"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={`flex size-7 items-center justify-center rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none ${
                item === page
                  ? "bg-white font-semibold text-[#09090B]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

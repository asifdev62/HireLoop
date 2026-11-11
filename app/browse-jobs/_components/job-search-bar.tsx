"use client"

/**
 * The search bar at the top of the browse-jobs page.
 * It only renders the input and the button; the page decides what happens
 * on submit (see browse-jobs-view.tsx).
 */

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"


export function JobSearchBar(){
  const router = useRouter();
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) =>{
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    console.log(data)
    const search = data.searchField;

    const params = new URLSearchParams();
    params.set('search', search as string)
    router.push(`/browse-jobs?${params.toString()}`)

  }


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#141418] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2.5 px-2">
        <Search className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />

        <input
        name="searchField"
          type="text"
          placeholder="Search by job title, keywords..."
          aria-label="Search by job title or keywords"
          className="h-9 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="h-9 shrink-0 rounded-lg bg-white px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        Search Jobs
      </button>
    </form>
  )
}





// type JobSearchBarProps = {
//   value: string
//   onChange: (value: string) => void
//   onSubmit: (event: FormEvent<HTMLFormElement>) => void
// }

// export function JobSearchBar({ value, onChange, onSubmit }: JobSearchBarProps) {
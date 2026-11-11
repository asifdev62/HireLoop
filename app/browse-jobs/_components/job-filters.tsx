"use client"

/**
 * The filter sidebar. It is a "dumb" component: the page builds the groups
 * (Job Type, Category, Work Mode) and this file only draws them.
 *
 * Each group is single-select: choosing another option replaces the current
 * one, and clicking the selected option again clears it.
 */

export type FilterOption = {
  value: string
  label: string
  count: number
  checked: boolean
}

export type FilterGroup = {
  id: string
  title: string
  options: FilterOption[]
}

type JobFiltersProps = {
  groups: FilterGroup[]
  onToggle: (groupId: string, value: string) => void
}

export function JobFilters({ groups, onToggle }: JobFiltersProps) {
  return (
    <aside className="h-fit rounded-xl border border-white/[0.07] bg-[#101014] p-4 lg:sticky lg:top-24">
      <h2 className="text-sm font-semibold text-white">Filters</h2>

      {groups.map((group) => (
        <fieldset key={group.id} className="mt-5">
          <legend className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            {group.title}
          </legend>

          <ul className="mt-2.5 space-y-2.5">
            {group.options.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-xs text-zinc-300 transition-colors hover:text-white">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={group.id}
                      checked={option.checked}
                      onChange={() => onToggle(group.id, option.value)}
                      onClick={() => {
                        if (option.checked) onToggle(group.id, option.value)
                      }}
                      className="size-3.5 cursor-pointer accent-[#5C53FE]"
                    />
                    {option.label}
                  </span>

                  <span className="text-[11px] text-zinc-600">
                    {option.count}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
    </aside>
  )
}

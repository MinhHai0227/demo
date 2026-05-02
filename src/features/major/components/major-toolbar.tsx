import { Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { majorTypeOptions, type MajorType } from "@/types/major-type"

type MajorToolbarProps = {
  searchInput: string
  appliedSearch: string
  majorTypeFilter: MajorType | "ALL"
  onSearchInputChange: (value: string) => void
  onMajorTypeFilterChange: (value: MajorType | "ALL") => void
  onCreateClick: () => void
  onClearFilters: () => void
}

const MajorToolbar = ({
  searchInput,
  appliedSearch,
  majorTypeFilter,
  onSearchInputChange,
  onMajorTypeFilterChange,
  onCreateClick,
  onClearFilters,
}: MajorToolbarProps) => {
  const hasFilters = Boolean(appliedSearch || majorTypeFilter !== "ALL")
  const isDebouncing = searchInput.trim() !== appliedSearch

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Main row */}
      <div className="flex flex-col gap-3 px-4 py-4 xl:flex-row xl:items-center">
        {/* Filters */}
        <div className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              placeholder="Search by major name or code..."
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none placeholder:text-slate-400"
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
          </div>

          <Select
            value={majorTypeFilter}
            onValueChange={onMajorTypeFilterChange}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
              <SelectValue placeholder="All major types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All major types</SelectItem>
              {majorTypeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900"
              onClick={onClearFilters}
            >
              <X className="size-4" />
            </Button>
          )}

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-6 xl:block"
          />

          <Button
            type="button"
            size="sm"
            className="h-10 rounded-xl px-4 text-sm font-medium"
            onClick={onCreateClick}
          >
            <Plus className="size-4" />
            Create major
          </Button>
        </div>
      </div>

      {/* Status strip */}
      {(isDebouncing || hasFilters) && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
          {isDebouncing && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Waiting...
            </span>
          )}

          {hasFilters && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 ring-inset">
              Filters active
            </span>
          )}

          <span className="ml-auto text-xs text-slate-400">
            Results update 1s after you stop typing
          </span>
        </div>
      )}
    </div>
  )
}

export default MajorToolbar

import { Search, UserPlus2, X } from "lucide-react"

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
import type { StaffRole } from "@/types/staff-type"

type StaffToolbarProps = {
  searchInput: string
  appliedSearch: string
  roleFilter: StaffRole | "ALL"
  onSearchInputChange: (value: string) => void
  onRoleFilterChange: (value: StaffRole | "ALL") => void
  onCreateClick: () => void
  onClearFilters: () => void
}

const StaffToolbar = ({
  searchInput,
  appliedSearch,
  roleFilter,
  onSearchInputChange,
  onRoleFilterChange,
  onCreateClick,
  onClearFilters,
}: StaffToolbarProps) => {
  const hasFilters = Boolean(appliedSearch || roleFilter !== "ALL")
  const isDebouncing = searchInput.trim() !== appliedSearch

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchInput}
            placeholder="Search by name or email..."
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-1"
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-10 w-40 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="COUNSELOR">Counselor</SelectItem>
            </SelectContent>
          </Select>

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

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button
            type="button"
            className="h-10 rounded-xl px-4 text-sm font-medium"
            onClick={onCreateClick}
          >
            <UserPlus2 className="size-4" />
            New staff
          </Button>
        </div>
      </div>

      {/* Status strip */}
      {(isDebouncing || hasFilters) && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-2">
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

export default StaffToolbar

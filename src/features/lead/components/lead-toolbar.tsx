import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  leadSortOptions,
  leadStatusOptions,
  leadTemperatureOptions,
  type LeadSortOption,
  type LeadStatus,
  type LeadTemperature,
} from "@/types/lead-type"

type StaffFilterOption = {
  label: string
  value: string
}

type LeadToolbarProps = {
  searchInput: string
  appliedSearch: string
  statusFilter: LeadStatus | "ALL"
  temperatureFilter: LeadTemperature | "ALL"
  sortOption: LeadSortOption
  assignedStaffFilter: string | "ALL"
  staffOptions?: StaffFilterOption[]
  onSearchInputChange: (value: string) => void
  onStatusFilterChange: (value: LeadStatus | "ALL") => void
  onTemperatureFilterChange: (value: LeadTemperature | "ALL") => void
  onSortOptionChange: (value: LeadSortOption) => void
  onAssignedStaffFilterChange: (value: string | "ALL") => void
  onClearFilters: () => void
}

const LeadToolbar = ({
  searchInput,
  appliedSearch,
  statusFilter,
  temperatureFilter,
  sortOption,
  assignedStaffFilter,
  staffOptions = [],
  onSearchInputChange,
  onStatusFilterChange,
  onTemperatureFilterChange,
  onSortOptionChange,
  onAssignedStaffFilterChange,
  onClearFilters,
}: LeadToolbarProps) => {
  const showStaffFilter = staffOptions.length > 0
  const hasFilters = Boolean(
    appliedSearch ||
    statusFilter !== "ALL" ||
    temperatureFilter !== "ALL" ||
    sortOption !== "newest" ||
    assignedStaffFilter !== "ALL"
  )
  const isDebouncing = searchInput.trim() !== appliedSearch

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 bg-linear-to-r from-slate-50 to-white px-4 py-4 xl:flex-row xl:items-center">
        <div
          className={
            showStaffFilter
              ? "grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_150px_150px_170px_210px]"
              : "grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1.8fr)_170px_170px_180px]"
          }
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              placeholder="Tìm theo tên lead, email, số điện thoại..."
              className="h-10 rounded-xl border-slate-200 bg-white pl-9 text-sm shadow-xs transition-colors placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-xs transition-colors focus:ring-slate-200">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {leadStatusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={temperatureFilter}
            onValueChange={onTemperatureFilterChange}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-xs transition-colors focus:ring-slate-200">
              <SelectValue placeholder="Tất cả mức độ quan tâm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả mức độ quan tâm</SelectItem>
              {leadTemperatureOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={onSortOptionChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-xs transition-colors focus:ring-slate-200">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {leadSortOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showStaffFilter ? (
            <Select
              value={assignedStaffFilter}
              onValueChange={onAssignedStaffFilterChange}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-xs transition-colors focus:ring-slate-200">
                <SelectValue placeholder="Tất cả tư vấn viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả tư vấn viên</SelectItem>
                {staffOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-950"
              aria-label="Xóa bộ lọc"
              onClick={onClearFilters}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {(isDebouncing || hasFilters) && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
          {isDebouncing ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Đang chờ nhập xong...
            </span>
          ) : null}

          {hasFilters ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 ring-inset">
              Đang áp dụng bộ lọc
            </span>
          ) : null}

          <span className="ml-auto text-xs text-slate-400">
            Kết quả sẽ cập nhật sau 1 giây khi bạn ngừng nhập
          </span>
        </div>
      )}
    </div>
  )
}

export default LeadToolbar

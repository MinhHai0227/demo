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
import type { Major } from "@/types/major-type"
import { feeTypeOptions, type FeeType } from "@/types/tuition-policy-type"

type TuitionPolicyToolbarProps = {
  yearInput: string
  appliedYear?: number
  majorFilter: string
  feeTypeFilter: FeeType | "ALL"
  majorOptions: Major[]
  onYearInputChange: (value: string) => void
  onMajorFilterChange: (value: string) => void
  onFeeTypeFilterChange: (value: FeeType | "ALL") => void
  onCreateClick: () => void
  onClearFilters: () => void
}

const TuitionPolicyToolbar = ({
  yearInput,
  appliedYear,
  majorFilter,
  feeTypeFilter,
  majorOptions,
  onYearInputChange,
  onMajorFilterChange,
  onFeeTypeFilterChange,
  onCreateClick,
  onClearFilters,
}: TuitionPolicyToolbarProps) => {
  const hasFilters = Boolean(
    appliedYear || majorFilter !== "ALL" || feeTypeFilter !== "ALL"
  )
  const isDebouncing =
    yearInput.trim() !== (appliedYear ? String(appliedYear) : "")

  return (
    <div className="overflow-hidden rounded-2xl border border-t-[2.5px] border-slate-200/70 border-t-[#d6ae4e] bg-white shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)]">
      {/* Main row */}
      <div className="flex flex-col gap-3 px-4 py-4 xl:flex-row xl:items-center">
        {/* Filters */}
        <div className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[180px_minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={yearInput}
              placeholder="Lọc theo năm..."
              className="h-10 rounded-xl border-slate-200 bg-slate-50/80 pl-9 text-[13px] shadow-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus-visible:ring-0"
              onChange={(event) => onYearInputChange(event.target.value)}
            />
          </div>

          <Select value={majorFilter} onValueChange={onMajorFilterChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none focus:border-slate-300 focus:ring-0">
              <SelectValue placeholder="Tất cả ngành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả ngành</SelectItem>
              {majorOptions.map((major) => (
                <SelectItem key={major.id} value={major.id}>
                  {major.code} - {major.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={feeTypeFilter} onValueChange={onFeeTypeFilterChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none focus:border-slate-300 focus:ring-0">
              <SelectValue placeholder="Tất cả loại phí" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại phí</SelectItem>
              {feeTypeOptions.map((item) => (
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
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50 hover:text-slate-900"
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
            className="h-10 rounded-xl bg-slate-950 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800"
            onClick={onCreateClick}
          >
            <Plus className="size-4" />
            Tạo chính sách
          </Button>
        </div>
      </div>

      {/* Status strip */}
      {(isDebouncing || hasFilters) && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-2">
          {isDebouncing && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Đang chờ nhập xong...
            </span>
          )}

          {hasFilters && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-blue-200 ring-inset">
              Đang áp dụng bộ lọc
            </span>
          )}

          <span className="ml-auto text-[11px] text-slate-400">
            Kết quả cập nhật sau 1 giây khi ngừng nhập năm
          </span>
        </div>
      )}
    </div>
  )
}

export default TuitionPolicyToolbar

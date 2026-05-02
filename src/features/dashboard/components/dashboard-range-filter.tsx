import { CalendarDays } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DASHBOARD_RANGE_OPTIONS,
  type DashboardRangePreset,
} from "@/features/dashboard/dashboard-date-range"

type DashboardRangeFilterProps = {
  rangePreset: DashboardRangePreset
  rangeLabel: string
  onRangePresetChange: (value: DashboardRangePreset) => void
}

const DashboardRangeFilter = ({
  rangePreset,
  rangeLabel,
  onRangePresetChange,
}: DashboardRangeFilterProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <CalendarDays className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Daily analytics
          </p>
          <p className="text-xs text-slate-500">
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">
              daily
            </code>{" "}
            và{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">
              daily/summary
            </code>{" "}
            dùng chung bộ lọc ngày.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:min-w-64">
        <Select
          value={rangePreset}
          onValueChange={(value) =>
            onRangePresetChange(value as DashboardRangePreset)
          }
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
            <SelectValue placeholder="Chọn khoảng ngày" />
          </SelectTrigger>
          <SelectContent>
            {DASHBOARD_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-right text-[11px] text-slate-400">{rangeLabel}</p>
      </div>
    </div>
  )
}

export default DashboardRangeFilter

import { CalendarDays } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateOnly } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { DailyAnalytic } from "@/types/admin-analytics-type"

type DashboardDailyDetailDialogProps = {
  open: boolean
  targetDate: string | null
  detail?: DailyAnalytic
  isLoading: boolean
  isFetching: boolean
  onOpenChange: (open: boolean) => void
}

type DetailStatProps = {
  label: string
  value: string
  highlight?: boolean
}

const DetailStat = ({ label, value, highlight = false }: DetailStatProps) => (
  <div
    className={cn(
      "rounded-xl border p-3",
      highlight ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50"
    )}
  >
    <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
      {label}
    </p>
    <p
      className={cn(
        "mt-1.5 text-xl font-semibold",
        highlight ? "text-red-600" : "text-slate-900"
      )}
    >
      {value}
    </p>
  </div>
)

const DashboardDailyDetailDialog = ({
  open,
  targetDate,
  detail,
  isLoading,
  isFetching,
  onOpenChange,
}: DashboardDailyDetailDialogProps) => {
  const fallbackRate = detail ? detail.fallback_rate * 100 : 0
  const isHighFallback = fallbackRate > 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <CalendarDays className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-slate-900">
                Daily analytics detail
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {targetDate ? formatDateOnly(targetDate) : "Chưa chọn ngày"}
                {targetDate && (
                  <span className="ml-2 font-mono text-[10px] text-slate-400">
                    {targetDate}
                  </span>
                )}
              </DialogDescription>
            </div>
            {isFetching && (
              <Badge
                variant="outline"
                className="shrink-0 border-slate-200 text-xs text-slate-500"
              >
                Loading
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {isLoading && !detail ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : detail ? (
            <>
              {/* Stats */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailStat label="Chats" value={`${detail.total_chats}`} />
                <DetailStat label="New leads" value={`${detail.new_leads}`} />
                <DetailStat label="Fallbacks" value={`${detail.fallbacks}`} />
                <DetailStat
                  label="Fallback rate"
                  value={`${fallbackRate.toFixed(1)}%`}
                  highlight={isHighFallback}
                />
              </div>

              <Separator />

              {/* Top intents */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Top intents
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Dữ liệu chi tiết của riêng ngày{" "}
                    <span className="font-mono">{detail.date}</span>.
                  </p>
                </div>

                {Object.entries(detail.top_intents ?? {}).length ? (
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {Object.entries(detail.top_intents)
                      .sort((a, b) => b[1] - a[1])
                      .map(([intent, count], i) => (
                        <div
                          key={intent}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-semibold text-slate-600">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                            {intent}
                          </span>
                          <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
                    Ngày này chưa có top intents.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <CalendarDays className="size-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">
                Chọn một ngày trong bảng để xem chi tiết.
              </p>
            </div>
          )}
        </div>

        <DialogFooter
          className="border-t border-slate-100 bg-slate-50/70"
          showCloseButton
        />
      </DialogContent>
    </Dialog>
  )
}

export default DashboardDailyDetailDialog

import { ChevronRight, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateOnly } from "@/lib/date"
import { cn } from "@/lib/utils"
import type {
  DailyAnalytic,
  DailyAnalyticsSummary,
} from "@/types/admin-analytics-type"

type DashboardDailyTableProps = {
  items: DailyAnalytic[]
  summary?: DailyAnalyticsSummary
  total: number
  limit: number
  offset: number
  isLoading: boolean
  isFetching: boolean
  onPageChange: (page: number) => void
  onSelectDate: (targetDate: string) => void
}

const DashboardDailyTable = ({
  items,
  summary,
  total,
  limit,
  offset,
  isLoading,
  isFetching,
  onPageChange,
  onSelectDate,
}: DashboardDailyTableProps) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Daily breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Top intents tổng hợp bên trái, bảng daily bên phải.
          </p>
        </div>
        {isFetching && (
          <Badge
            variant="outline"
            className="border-slate-200 text-xs text-slate-500"
          >
            Refreshing...
          </Badge>
        )}
      </div>

      <div className="grid gap-0 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left — Top intents */}
        <div className="border-b border-slate-100 p-5 xl:border-r xl:border-b-0">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Top intents
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {summary?.days ?? 0} ngày, {summary?.active_days ?? 0} ngày có dữ
              liệu
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-xl" />
              ))
            ) : summary?.top_intents?.length ? (
              summary.top_intents.slice(0, 8).map((item, i) => (
                <div
                  key={item.intent}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                    {item.intent}
                  </span>
                  <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
                Chưa có top intents trong khoảng ngày này.
              </div>
            )}
          </div>
        </div>

        {/* Right — Daily table */}
        <div className="flex flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Daily table
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Click vào từng ngày để xem chi tiết.
              </p>
            </div>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {total} records
            </span>
          </div>

          <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-slate-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="text-xs font-medium text-slate-500">
                    Ngày
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500">
                    Chats
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500">
                    New leads
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500">
                    Fallbacks
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500">
                    Rate
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <TableRow key={i} className="border-slate-100">
                      <TableCell colSpan={6} className="py-2">
                        <Skeleton className="h-8 rounded-lg" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : items.length ? (
                  items.map((item) => {
                    const fallbackRate = item.fallback_rate * 100
                    const isHighFallback = fallbackRate > 20

                    return (
                      <TableRow
                        key={item.id ?? item.date}
                        className="cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/50"
                        onClick={() => onSelectDate(item.date)}
                      >
                        <TableCell className="py-3">
                          <p className="text-sm font-medium text-slate-900">
                            {formatDateOnly(item.date)}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400">
                            {item.date}
                          </p>
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-slate-900">
                          {item.total_chats}
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-600">
                          {item.new_leads}
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-600">
                          {item.fallbacks}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                              isHighFallback
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-700"
                            )}
                          >
                            {fallbackRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-lg text-slate-400 hover:text-slate-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectDate(item.date)
                            }}
                          >
                            <ChevronRight className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                          <TrendingUp className="size-4 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500">
                          Không có dữ liệu daily trong khoảng ngày đã chọn.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Trang {currentPage}/{totalPages} · {items.length} bản ghi
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Prev"
                    className={cn(
                      "h-8 rounded-lg px-3 text-xs",
                      !canGoPrevious && "pointer-events-none opacity-40"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      if (canGoPrevious) onPageChange(currentPage - 1)
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text="Next"
                    className={cn(
                      "h-8 rounded-lg px-3 text-xs",
                      !canGoNext && "pointer-events-none opacity-40"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      if (canGoNext) onPageChange(currentPage + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardDailyTable

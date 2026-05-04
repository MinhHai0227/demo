import {
  ChartNoAxesColumnIncreasing,
  Flame,
  Loader2,
  Phone,
  Sparkles,
  Thermometer,
  UserRoundSearch,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import {
  leadStatusLabelMap,
  leadTemperatureLabelMap,
  type Lead,
  type LeadStatus,
  type LeadTemperature,
} from "@/types/lead-type"

type LeadTableProps = {
  items: Lead[]
  total: number
  limit: number
  offset: number
  selectedLeadId?: string | null
  staffNameById?: Record<string, string>
  isLoading?: boolean
  isFetching?: boolean
  onPageChange: (page: number) => void
  onSelect: (lead: Lead) => void
  onOpenActivities: (lead: Lead) => void
  onOpenScoreHistory: (lead: Lead) => void
}

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, index) => index + 1)

  if (currentPage <= 3) return [1, 2, 3, 4, totalPages]

  if (currentPage >= totalPages - 2)
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

const statusClassNameMap: Record<LeadStatus, string> = {
  NEW: "border-slate-200 bg-slate-100 text-slate-700",
  CONTACTED: "border-sky-200 bg-sky-50 text-sky-700",
  QUALIFIED: "border-indigo-200 bg-indigo-50 text-indigo-700",
  APPLIED: "border-violet-200 bg-violet-50 text-violet-700",
  ENROLLED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  LOST: "border-rose-200 bg-rose-50 text-rose-700",
}

const temperatureClassNameMap: Record<LeadTemperature, string> = {
  HOT: "border-red-200 bg-red-50 text-red-700",
  WARM: "border-amber-200 bg-amber-50 text-amber-700",
  COLD: "border-cyan-200 bg-cyan-50 text-cyan-700",
}

const LeadTable = ({
  items,
  total,
  limit,
  offset,
  selectedLeadId = null,
  staffNameById = {},
  isLoading = false,
  isFetching = false,
  onPageChange,
  onSelect,
  onOpenActivities,
  onOpenScoreHistory,
}: LeadTableProps) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Phễu lead</h2>
          <p className="text-xs text-slate-500">Tổng cộng {total} lead</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isFetching && !isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : null}
          <span>
            {items.length ? offset + 1 : 0}-{offset + items.length} / {total}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead className="px-5 text-xs font-medium text-slate-500">
              Lead
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Trạng thái
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Mức độ quan tâm
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Điểm
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Phụ trách
            </TableHead>
            <TableHead className="pr-5 text-xs font-medium text-slate-500">
              Cập nhật
            </TableHead>
            <TableHead className="pr-5 text-right text-xs font-medium text-slate-500">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <TableRow
                  key={`lead-skeleton-${index}`}
                  className="border-slate-100"
                >
                  <TableCell className="px-5 py-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-40 rounded-full" />
                      <Skeleton className="h-3 w-56 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!isLoading && items.length === 0 ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={7} className="py-20 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <UserRoundSearch className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Không tìm thấy lead
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc hiện tại.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? items.map((lead) => {
                const isActive = selectedLeadId === lead.id
                const status = lead.status
                const temperature = lead.temperature
                const assignedLabel = lead.assigned_staff_id
                  ? (staffNameById[lead.assigned_staff_id] ?? "Phụ trách")
                  : "Chưa phân công"

                return (
                  <TableRow
                    key={lead.id}
                    className={cn(
                      "cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/60",
                      isActive && "bg-amber-50/60 hover:bg-amber-50/70"
                    )}
                    onClick={() => onSelect(lead)}
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-orange-100 text-amber-700">
                          <Sparkles className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {lead.full_name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>{lead.email || "Chưa có email"}</span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="size-3" />
                              {lead.phone || "Chưa có số điện thoại"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {status ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            statusClassNameMap[status]
                          )}
                        >
                          {leadStatusLabelMap[status]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {temperature ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            temperatureClassNameMap[temperature]
                          )}
                        >
                          <Thermometer className="size-3" />
                          {leadTemperatureLabelMap[temperature]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-600">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-amber-50 hover:text-amber-700"
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpenActivities(lead)
                        }}
                      >
                        <Flame className="size-3 text-amber-500" />
                        {lead.score ?? 0}
                      </button>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      {assignedLabel}
                    </TableCell>

                    <TableCell className="pr-5 text-xs text-slate-500">
                      {formatDateOnly(lead.updated_at)}
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <button
                        type="button"
                        title="Lịch sử điểm"
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpenScoreHistory(lead)
                        }}
                      >
                        <ChartNoAxesColumnIncreasing className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })
            : null}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Trang {currentPage} / {totalPages}
        </p>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Trước"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  currentPage === 1 && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
              />
            </PaginationItem>

            {pageItems.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  className="h-8 w-8 rounded-lg text-xs"
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                text="Sau"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  currentPage === totalPages && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default LeadTable

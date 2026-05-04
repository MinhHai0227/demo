import { Activity, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Lead, LeadActivity } from "@/types/lead-type"

type LeadActivitiesDialogProps = {
  open: boolean
  lead?: Lead | null
  activities?: LeadActivity[]
  total?: number
  limit: number
  offset: number
  isLoading?: boolean
  isFetching?: boolean
  onOpenChange: (open: boolean) => void
  onPageChange: (page: number) => void
}

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
  if (currentPage >= totalPages - 2)
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

const LeadActivitiesDialog = ({
  open,
  lead,
  activities = [],
  total = 0,
  limit,
  offset,
  isLoading = false,
  isFetching = false,
  onOpenChange,
  onPageChange,
}: LeadActivitiesDialogProps) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10">
              <Activity className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-950">
                {lead?.full_name || "Lead"} - hoạt động
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Xem lịch sử tương tác và các thay đổi điểm của lead này.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>Tổng cộng {total} hoạt động</span>
            <span className="inline-flex items-center gap-2">
              {isFetching && !isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              {activities.length ? offset + 1 : 0}-{offset + activities.length}{" "}
              trên {total}
            </span>
          </div>

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-2xl" />
                ))
              : null}

            {!isLoading && activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center">
                <p className="text-sm font-medium text-slate-900">
                  Chưa có lịch sử hoạt động
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Các thay đổi điểm và tương tác của lead sẽ hiển thị tại đây.
                </p>
              </div>
            ) : null}

            {!isLoading
              ? activities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white px-4 py-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.action}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDateTime(item.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          item.score_delta >= 0
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        )}
                      >
                        {item.score_delta >= 0 ? "+" : ""}
                        {item.score_delta}
                      </Badge>
                    </div>

                    {item.extra_data ? (
                      <pre className="mt-3 overflow-x-auto rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
                        {JSON.stringify(item.extra_data, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
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
                    currentPage === totalPages &&
                      "pointer-events-none opacity-40"
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
      </DialogContent>
    </Dialog>
  )
}

export default LeadActivitiesDialog

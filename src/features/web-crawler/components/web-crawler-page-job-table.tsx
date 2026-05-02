import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { cn } from "@/lib/utils"
import {
  admissionCategoryLabelMap,
  type AdmissionCategory,
} from "@/types/knowledge-chunk-type"
import type { CrawlPageJob } from "@/types/crawl-type"

type WebCrawlerPageJobTableProps = {
  pageJobs: CrawlPageJob[]
  total: number
  limit: number
  offset: number
  isLoading?: boolean
  isFetching?: boolean
  deletingPageJobId?: string | null
  downloadingPageJobId?: string | null
  onPageChange: (offset: number) => void
  onPreview: (pageJob: CrawlPageJob) => void
  onDownload: (pageJob: CrawlPageJob) => void
  onDelete: (pageJob: CrawlPageJob) => void
}

const getCategoryLabel = (pageJob: CrawlPageJob) => {
  const category = pageJob.category || pageJob.suggested_metadata?.category
  if (!category) return "Uncategorized"
  return (
    admissionCategoryLabelMap[category as AdmissionCategory] ||
    String(category).replaceAll("_", " ")
  )
}

const getStatusBadge = (pageJob: CrawlPageJob) => {
  if (pageJob.sent_to_kb) {
    return {
      label: "Sent to KB",
      icon: CheckCircle2,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    }
  }

  if (pageJob.status === "failed") {
    return {
      label: "Failed",
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-600",
    }
  }

  return {
    label: "Ready",
    icon: CheckCircle2,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  }
}

const WebCrawlerPageJobTable = ({
  pageJobs,
  total,
  limit,
  offset,
  isLoading = false,
  isFetching = false,
  deletingPageJobId = null,
  downloadingPageJobId = null,
  onPageChange,
  onPreview,
  onDownload,
  onDelete,
}: WebCrawlerPageJobTableProps) => {
  const hasPrev = offset > 0
  const hasNext = offset + limit < total

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Crawled page jobs
          </h2>
          <p className="text-xs text-slate-500">
            Edit markdown and choose final metadata before sending to KB.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isFetching && !isLoading && (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          <span>
            {pageJobs.length ? offset + 1 : 0}-{offset + pageJobs.length} of{" "}
            {total}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead className="px-5 text-xs font-medium text-slate-500">
              Page
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Category
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Year
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Status
            </TableHead>
            <TableHead className="w-40 pr-5 text-right text-xs font-medium text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow
                key={`crawl-page-job-skeleton-${index}`}
                className="border-slate-100"
              >
                <TableCell className="px-5 py-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-64 rounded-full" />
                    <Skeleton className="h-3 w-96 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="pr-5">
                  <Skeleton className="ml-auto h-8 w-24 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && pageJobs.length === 0 && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={5} className="py-20 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <FileText className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      No page jobs found
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Finished crawl sessions will create page jobs here.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            pageJobs.map((pageJob) => {
              const statusBadge = getStatusBadge(pageJob)
              const StatusIcon = statusBadge.icon
              const deleting = deletingPageJobId === pageJob.id
              const downloading = downloadingPageJobId === pageJob.id
              const ready = pageJob.status === "completed"
              const displayTitle =
                pageJob.title ||
                pageJob.detected_title ||
                pageJob.suggested_metadata?.title ||
                "Untitled page"

              return (
                <TableRow
                  key={pageJob.id}
                  className={cn(
                    "border-slate-100 transition-colors hover:bg-slate-50/70",
                    ready && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (ready) onPreview(pageJob)
                  }}
                >
                  <TableCell className="px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="line-clamp-1 max-w-[460px] text-sm font-medium text-slate-900">
                        {displayTitle}
                      </p>
                      <p className="line-clamp-1 max-w-[520px] text-xs text-slate-400">
                        {pageJob.source_url}
                      </p>
                      {pageJob.error_message && (
                        <p className="mt-1 line-clamp-1 max-w-[520px] text-xs text-red-500">
                          {pageJob.error_message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {getCategoryLabel(pageJob)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {pageJob.year ?? pageJob.suggested_metadata?.year ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        statusBadge.className
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-lg border-slate-200 text-slate-500 hover:text-slate-900"
                        disabled={!ready}
                        onClick={(event) => {
                          event.stopPropagation()
                          onPreview(pageJob)
                        }}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-lg border-slate-200 text-slate-500 hover:text-slate-900"
                        disabled={!ready || downloading}
                        onClick={(event) => {
                          event.stopPropagation()
                          onDownload(pageJob)
                        }}
                      >
                        {downloading ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Download className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg border border-red-100 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        disabled={deleting}
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(pageJob)
                        }}
                      >
                        {deleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Offset {offset} of {Math.max(total, 0)}
        </p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Prev"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  !hasPrev && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  if (hasPrev) onPageChange(Math.max(0, offset - limit))
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Next"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  !hasNext && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  if (hasNext) onPageChange(offset + limit)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default WebCrawlerPageJobTable

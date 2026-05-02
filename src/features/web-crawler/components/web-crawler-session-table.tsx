import { useMemo } from "react"
import {
  CheckCircle2,
  Eye,
  Globe2,
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
import type { CrawlSession } from "@/types/crawl-type"

type WebCrawlerSessionTableProps = {
  sessions: CrawlSession[]
  total: number
  limit: number
  offset: number
  selectedSessionId?: string | null
  isLoading?: boolean
  isFetching?: boolean
  deletingSessionId?: string | null
  onPageChange: (offset: number) => void
  onSelectSession: (session: CrawlSession) => void
  onDeleteSession: (session: CrawlSession) => void
}

const getStatusBadge = (session: CrawlSession) => {
  if (session.status === "COMPLETED") {
    return {
      label: "Completed",
      icon: CheckCircle2,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    }
  }

  if (session.status === "FAILED") {
    return {
      label: "Failed",
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-600",
    }
  }

  return {
    label: session.status === "SCRAPING" ? "Scraping" : "Pending",
    icon: Loader2,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  }
}

const WebCrawlerSessionTable = ({
  sessions,
  total,
  limit,
  offset,
  selectedSessionId,
  isLoading = false,
  isFetching = false,
  deletingSessionId = null,
  onPageChange,
  onSelectSession,
  onDeleteSession,
}: WebCrawlerSessionTableProps) => {
  const hasPrev = offset > 0
  const hasNext = offset + limit < total
  const rangeText = useMemo(() => {
    if (!sessions.length) return "0-0"
    return `${offset + 1}-${offset + sessions.length}`
  }, [offset, sessions.length])

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Crawl sessions
          </h2>
          <p className="text-xs text-slate-500">
            Select a session to review its crawled pages.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isFetching && !isLoading && (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          <span>
            {rangeText} of {total}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead className="px-5 text-xs font-medium text-slate-500">
              Target
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Pages
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Limit
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Status
            </TableHead>
            <TableHead className="w-28 pr-5 text-right text-xs font-medium text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow
                key={`crawl-session-skeleton-${index}`}
                className="border-slate-100"
              >
                <TableCell className="px-5 py-4">
                  <Skeleton className="h-4 w-80 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-14 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-10 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="pr-5">
                  <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && sessions.length === 0 && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={5} className="py-16 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Globe2 className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      No crawl sessions yet
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Start a crawl to create editable page markdown.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            sessions.map((session) => {
              const statusBadge = getStatusBadge(session)
              const StatusIcon = statusBadge.icon
              const deleting = deletingSessionId === session.id
              const selected = selectedSessionId === session.id
              const active = ["PENDING", "SCRAPING"].includes(session.status)

              return (
                <TableRow
                  key={session.id}
                  className={cn(
                    "cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/70",
                    selected && "bg-slate-50"
                  )}
                  onClick={() => onSelectSession(session)}
                >
                  <TableCell className="px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="line-clamp-1 max-w-[520px] text-sm font-medium text-slate-900">
                        {session.target_url}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {session.created_at
                          ? new Date(session.created_at).toLocaleString()
                          : session.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {session.completed_pages}/{session.total_pages}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {session.limit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        statusBadge.className
                      )}
                    >
                      <StatusIcon
                        className={cn("size-3", active && "animate-spin")}
                      />
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
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelectSession(session)
                        }}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg border border-red-100 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        disabled={deleting}
                        onClick={(event) => {
                          event.stopPropagation()
                          onDeleteSession(session)
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

export default WebCrawlerSessionTable

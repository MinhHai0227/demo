import { Loader2, MessageSquareQuote, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

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
import { formatDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { HotQuestion } from "@/types/admin-analytics-type"

type HotQuestionsTableProps = {
  items: HotQuestion[]
  total: number
  limit: number
  offset: number
  selectedQuestionId?: string | null
  isLoading?: boolean
  isFetching?: boolean
  onPageChange: (page: number) => void
  onSelect: (question: HotQuestion) => void
}

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

const HotQuestionsTable = ({
  items,
  total,
  limit,
  offset,
  selectedQuestionId = null,
  isLoading = false,
  isFetching = false,
  onPageChange,
  onSelect,
}: HotQuestionsTableProps) => {
  const { t } = useTranslation("hot-questions")
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {t("table")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t("totalQuestions", { count: total })}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
          {isFetching && !isLoading ? (
            <Loader2 className="size-3.5 animate-spin text-slate-400" />
          ) : null}
          <span>
            {items.length ? offset + 1 : 0}-{offset + items.length} / {total}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead className="px-5 text-xs font-semibold text-slate-500">
              {t("question")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">
              {t("intent")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">
              {t("fallback")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">
              {t("count")}
            </TableHead>
            <TableHead className="pr-5 text-xs font-semibold text-slate-500">
              {t("lastAsked")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <TableRow
                  key={`question-skeleton-${index}`}
                  className="border-slate-100"
                >
                  <TableCell className="px-5 py-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-64 rounded-full" />
                      <Skeleton className="h-3 w-40 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="pr-5">
                    <Skeleton className="h-3.5 w-24 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!isLoading && items.length === 0 ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={5} className="py-20 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    <MessageSquareQuote className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t("notFoundTable")}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {t("notFoundHint")}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? items.map((item) => {
                const isActive = selectedQuestionId === item.id

                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/70",
                      isActive && "bg-amber-50/70 hover:bg-amber-50/80"
                    )}
                    onClick={() => onSelect(item)}
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-orange-100 text-amber-700 ring-1 ring-amber-200">
                          <Sparkles className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                            {item.question}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>
                              {item.normalized || t("normalizedMissing")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {item.intent ?? t("unknownIntent")}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          item.is_fallback
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        )}
                      >
                        {item.is_fallback ? t("fallbackStatus") : t("answeredStatus")}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {item.count}
                    </TableCell>

                    <TableCell className="pr-5 text-xs text-slate-500">
                      {formatDateTime(item.last_asked_at)}
                    </TableCell>
                  </TableRow>
                )
              })
            : null}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          {t("page", { current: currentPage, total: totalPages })}
        </p>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={t("prev")}
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
                text={t("next")}
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

export default HotQuestionsTable

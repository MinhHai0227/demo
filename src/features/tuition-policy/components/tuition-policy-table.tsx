import { CreditCard, Loader2, Power, PowerOff, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  feeTypeLabelMap,
  type TuitionPolicy,
} from "@/types/tuition-policy-type"

type TuitionPolicyTableProps = {
  items: TuitionPolicy[]
  total: number
  limit: number
  offset: number
  majorNameById: Record<string, string>
  isLoading?: boolean
  isFetching?: boolean
  togglingPolicyId?: string | null
  onPageChange: (page: number) => void
  onEdit: (policy: TuitionPolicy) => void
  onDelete: (policy: TuitionPolicy) => void
  onToggleStatus: (policy: TuitionPolicy) => void
}

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)

const TuitionPolicyTable = ({
  items,
  total,
  limit,
  offset,
  majorNameById,
  isLoading = false,
  isFetching = false,
  togglingPolicyId = null,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: TuitionPolicyTableProps) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Tuition policies
          </h2>
          <p className="text-xs text-slate-500">
            {total} polic{total === 1 ? "y" : "ies"} total
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isFetching && !isLoading && (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          <span>
            {items.length ? offset + 1 : 0}–{offset + items.length} of {total}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead className="px-5 text-xs font-medium text-slate-500">
              Major
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Year
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Fee type
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Base fee
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Updated
            </TableHead>
            <TableHead className="w-20 pr-5 text-right text-xs font-medium text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow
                key={`tuition-policy-skeleton-${index}`}
                className="border-slate-100"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-40 rounded-full" />
                      <Skeleton className="h-3 w-24 rounded-full" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3.5 w-14 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3.5 w-20 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-7 w-20 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-3.5 w-20 rounded-full" />
                </TableCell>

                <TableCell className="pr-5">
                  <Skeleton className="ml-auto size-8 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && items.length === 0 && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={7} className="py-20 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <CreditCard className="size-5 text-slate-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      No tuition policies found
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Create a tuition policy to start managing academic fee
                      configurations.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            items.map((policy) => {
              const isToggling = togglingPolicyId === policy.id
              const majorLabel =
                majorNameById[policy.major_id] ?? "Unknown major"

              return (
                <TableRow
                  key={policy.id}
                  className="cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/50"
                  onClick={() => onEdit(policy)}
                >
                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700">
                        <CreditCard className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {majorLabel}
                        </p>
                        <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                          {policy.major_id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-500">
                    {policy.year}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                    >
                      {feeTypeLabelMap[policy.fee_type]}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-mono text-xs font-medium text-slate-600">
                    {formatCurrency(policy.base_fee)}
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleStatus(policy)
                      }}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
                        policy.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200",
                        isToggling && "cursor-not-allowed opacity-60"
                      )}
                    >
                      {isToggling ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : policy.is_active ? (
                        <Power className="size-3" />
                      ) : (
                        <PowerOff className="size-3" />
                      )}

                      {policy.is_active ? "Active" : "Inactive"}
                    </button>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {formatDateOnly(policy.updated_at)}
                  </TableCell>

                  <TableCell className="pr-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto size-8 rounded-lg border border-red-100 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(policy)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      {/* Footer pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Prev"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  currentPage === 1 && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()

                  if (currentPage > 1) {
                    onPageChange(currentPage - 1)
                  }
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
                text="Next"
                className={cn(
                  "h-8 rounded-lg px-3 text-xs",
                  currentPage === totalPages && "pointer-events-none opacity-40"
                )}
                onClick={(event) => {
                  event.preventDefault()

                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1)
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default TuitionPolicyTable

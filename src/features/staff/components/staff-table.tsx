import {
  Loader2,
  Mail,
  PencilLine,
  Power,
  PowerOff,
  ShieldCheck,
  Trash2,
  UserSquare2,
} from "lucide-react"

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
import type { Staff } from "@/types/staff-type"

type StaffTableProps = {
  items: Staff[]
  total: number
  limit: number
  offset: number
  isLoading?: boolean
  isFetching?: boolean
  togglingStaffId?: string | null
  onPageChange: (page: number) => void
  onEdit: (staff: Staff) => void
  onDelete: (staff: Staff) => void
  onToggleStatus: (staff: Staff) => void
}

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
  if (currentPage >= totalPages - 2)
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

const StaffTable = ({
  items,
  total,
  limit,
  offset,
  isLoading = false,
  isFetching = false,
  togglingStaffId = null,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: StaffTableProps) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Staff directory
          </h2>
          <p className="text-xs text-slate-500">
            {total} member{total === 1 ? "" : "s"} total
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
              Staff
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Email
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Role
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Created
            </TableHead>
            <TableHead className="w-[120px] pr-5 text-right text-xs font-medium text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="border-slate-100">
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28 rounded-full" />
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-40 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-7 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-20 rounded-full" />
                </TableCell>
                <TableCell className="pr-5">
                  <div className="ml-auto flex w-fit gap-1.5">
                    <Skeleton className="size-8 rounded-lg" />
                    <Skeleton className="size-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && items.length === 0 && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={6} className="py-20 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <UserSquare2 className="size-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      No staff found
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            items.map((staff) => {
              const isToggling = togglingStaffId === staff.id

              return (
                <TableRow
                  key={staff.id}
                  className="border-slate-100 transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700">
                        <UserSquare2 className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {staff.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                          {staff.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="size-3.5 shrink-0 text-slate-400" />
                      <span className="max-w-[200px] truncate">
                        {staff.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        staff.role === "ADMIN"
                          ? "border-slate-300 bg-slate-900 text-white"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      )}
                    >
                      <ShieldCheck className="size-3" />
                      {staff.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => onToggleStatus(staff)}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
                        staff.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200",
                        isToggling && "cursor-not-allowed opacity-60"
                      )}
                    >
                      {isToggling ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : staff.is_active ? (
                        <Power className="size-3" />
                      ) : (
                        <PowerOff className="size-3" />
                      )}
                      {staff.is_active ? "Active" : "Inactive"}
                    </button>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {formatDateOnly(staff.created_at)}
                  </TableCell>

                  <TableCell className="pr-5">
                    <div className="ml-auto flex w-fit items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                        onClick={() => onEdit(staff)}
                      >
                        <PencilLine className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg border border-red-100 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onDelete(staff)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
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
                onClick={(e) => {
                  e.preventDefault()
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
                  onClick={(e) => {
                    e.preventDefault()
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
                onClick={(e) => {
                  e.preventDefault()
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

export default StaffTable

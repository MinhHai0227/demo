import { startTransition, useEffect, useState } from "react"

import StaffDeleteDialog from "@/features/staff/components/staff-delete-dialog"
import StaffFormDialog from "@/features/staff/components/staff-form-dialog"
import StaffTable from "@/features/staff/components/staff-table"
import StaffToolbar from "@/features/staff/components/staff-toolbar"
import useStaff from "@/hooks/use-staff"
import type { StaffFormValues } from "@/schemas/staff-schema"
import type { Staff, StaffListParams, StaffRole } from "@/types/staff-type"

const PAGE_SIZE = 4

const StaffPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<StaffRole | "ALL">("ALL")
  const [offset, setOffset] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null)
  const [togglingStaffId, setTogglingStaffId] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setOffset(0)
        setAppliedSearch(searchInput.trim())
      })
    }, 1000)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const params: StaffListParams = {
    limit: PAGE_SIZE,
    offset,
    q: appliedSearch || undefined,
    role: roleFilter === "ALL" ? undefined : roleFilter,
  }

  const {
    staffList,
    staffListPending,
    staffListFetching,
    createStaff: createStaffAction,
    createStaffPending,
    updateStaff: updateStaffAction,
    updateStaffPending,
    updateStaffStatus: updateStaffStatusAction,
    deleteStaff: deleteStaffAction,
    deleteStaffPending,
  } = useStaff(params)

  const total = staffList?.total ?? 0
  const items = staffList?.items ?? []

  const handleCreateClick = () => {
    setDialogMode("create")
    setSelectedStaff(null)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleEditClick = (staff: Staff) => {
    setDialogMode("edit")
    setSelectedStaff(staff)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleDialogSubmit = async (values: StaffFormValues) => {
    setDialogError(null)
    try {
      if (dialogMode === "create") {
        await createStaffAction({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        })
        setDialogOpen(false)
        return
      }
      if (!selectedStaff) return
      const payload: Partial<StaffFormValues> = {
        name: values.name,
        email: values.email,
        role: values.role,
      }
      if (values.password) payload.password = values.password
      await updateStaffAction({ staffId: selectedStaff.id, values: payload })
      setDialogOpen(false)
      setSelectedStaff(null)
    } catch (error) {
      setDialogError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      )
    }
  }

  const handleToggleStatus = async (staff: Staff) => {
    setTogglingStaffId(staff.id)
    setActionError(null)
    try {
      await updateStaffStatusAction({
        staffId: staff.id,
        is_active: !staff.is_active,
      })
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      )
    } finally {
      setTogglingStaffId(null)
    }
  }

  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return
    try {
      await deleteStaffAction(staffToDelete.id)
      if (items.length === 1 && offset > 0) {
        setOffset(Math.max(0, offset - PAGE_SIZE))
      }
      setDeleteDialogOpen(false)
      setStaffToDelete(null)
      setActionError(null)
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      )
    }
  }

  const handleClearFilters = () => {
    setSearchInput("")
    setAppliedSearch("")
    setRoleFilter("ALL")
    setOffset(0)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-950">Nhân viên</h1>
        <p className="text-[13px] text-slate-500">
          Quản lý tài khoản admin và counselor trong nhóm tuyển sinh.
        </p>
      </div>

      <StaffToolbar
        searchInput={searchInput}
        appliedSearch={appliedSearch}
        roleFilter={roleFilter}
        onSearchInputChange={setSearchInput}
        onRoleFilterChange={(value) => {
          setRoleFilter(value)
          setOffset(0)
        }}
        onCreateClick={handleCreateClick}
        onClearFilters={handleClearFilters}
      />

      {actionError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-[13px] text-red-600">
          {actionError}
        </div>
      )}

      <StaffTable
        items={items}
        total={total}
        limit={PAGE_SIZE}
        offset={offset}
        isLoading={staffListPending}
        isFetching={staffListFetching}
        togglingStaffId={togglingStaffId}
        onPageChange={(page) => setOffset((page - 1) * PAGE_SIZE)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <StaffFormDialog
        open={dialogOpen}
        mode={dialogMode}
        staff={selectedStaff}
        errorMessage={dialogError}
        isSubmitting={createStaffPending || updateStaffPending}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setDialogError(null)
            setSelectedStaff(null)
          }
        }}
        onSubmit={handleDialogSubmit}
      />

      <StaffDeleteDialog
        open={deleteDialogOpen}
        staff={staffToDelete}
        isDeleting={deleteStaffPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setStaffToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default StaffPage

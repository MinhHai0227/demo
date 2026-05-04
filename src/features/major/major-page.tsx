import { startTransition, useEffect, useState } from "react"

import MajorDeleteDialog from "@/features/major/components/major-delete-dialog"
import MajorFormDialog from "@/features/major/components/major-form-dialog"
import MajorTable from "@/features/major/components/major-table"
import MajorToolbar from "@/features/major/components/major-toolbar"
import useMajor from "@/hooks/use-major"
import type { MajorFormValues } from "@/schemas/major-schema"
import type { Major, MajorListParams, MajorType } from "@/types/major-type"

const PAGE_SIZE = 3

const MajorPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [majorTypeFilter, setMajorTypeFilter] = useState<MajorType | "ALL">(
    "ALL"
  )
  const [offset, setOffset] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [majorToDelete, setMajorToDelete] = useState<Major | null>(null)
  const [togglingMajorId, setTogglingMajorId] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setOffset(0)
        setAppliedSearch(searchInput.trim())
      })
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const params: MajorListParams = {
    limit: PAGE_SIZE,
    offset,
    q: appliedSearch || undefined,
    major_type: majorTypeFilter === "ALL" ? undefined : majorTypeFilter,
  }

  const {
    majorList,
    majorListPending,
    majorListFetching,
    createMajor: createMajorAction,
    createMajorPending,
    updateMajor: updateMajorAction,
    updateMajorPending,
    updateMajorStatus: updateMajorStatusAction,
    deleteMajor: deleteMajorAction,
    deleteMajorPending,
  } = useMajor(params)

  const total = majorList?.total ?? 0
  const items = majorList?.items ?? []

  const handleCreateClick = () => {
    setDialogMode("create")
    setSelectedMajor(null)
    setDialogError(null)
    setActionSuccess(null)
    setDialogOpen(true)
  }

  const handleEditClick = (major: Major) => {
    setDialogMode("edit")
    setSelectedMajor(major)
    setDialogError(null)
    setActionSuccess(null)
    setDialogOpen(true)
  }

  const handleDialogSubmit = async (values: MajorFormValues) => {
    setDialogError(null)

    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      credits: values.credits,
      duration: values.duration,
      degree_type: values.degree_type,
      major_type: values.major_type,
    }

    try {
      if (dialogMode === "create") {
        await createMajorAction({ ...payload, is_active: true })
        setDialogOpen(false)
        setActionSuccess("Đã tạo ngành học thành công.")
        return
      }

      if (!selectedMajor) return

      await updateMajorAction({ majorId: selectedMajor.id, values: payload })
      setDialogOpen(false)
      setSelectedMajor(null)
      setActionSuccess("Đã cập nhật ngành học thành công.")
    } catch (error) {
      setDialogError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      )
    }
  }

  const handleToggleStatus = async (major: Major) => {
    setTogglingMajorId(major.id)
    setActionError(null)
    setActionSuccess(null)

    try {
      await updateMajorStatusAction({
        majorId: major.id,
        is_active: !major.is_active,
      })
      setActionSuccess(
        `Đã ${!major.is_active ? "kích hoạt" : "tạm ẩn"} ngành học thành công.`
      )
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      )
    } finally {
      setTogglingMajorId(null)
    }
  }

  const handleDeleteClick = (major: Major) => {
    setMajorToDelete(major)
    setActionSuccess(null)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!majorToDelete) return

    try {
      await deleteMajorAction(majorToDelete.id)
      if (items.length === 1 && offset > 0) {
        setOffset(Math.max(0, offset - PAGE_SIZE))
      }
      setDeleteDialogOpen(false)
      setMajorToDelete(null)
      setActionError(null)
      setActionSuccess("Đã xóa ngành học thành công.")
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
    setMajorTypeFilter("ALL")
    setOffset(0)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-950">Ngành học</h1>
        <p className="text-[13px] text-slate-500">
          Quản lý chương trình đào tạo phục vụ nội dung và quy trình tuyển sinh.
        </p>
      </div>

      <MajorToolbar
        searchInput={searchInput}
        appliedSearch={appliedSearch}
        majorTypeFilter={majorTypeFilter}
        onSearchInputChange={setSearchInput}
        onMajorTypeFilterChange={(value) => {
          setMajorTypeFilter(value)
          setOffset(0)
        }}
        onCreateClick={handleCreateClick}
        onClearFilters={handleClearFilters}
      />

      {actionError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-[13px] text-red-600">
          {actionError}
        </div>
      ) : null}

      {actionSuccess ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-[13px] text-emerald-700">
          {actionSuccess}
        </div>
      ) : null}

      <MajorTable
        items={items}
        total={total}
        limit={PAGE_SIZE}
        offset={offset}
        isLoading={majorListPending}
        isFetching={majorListFetching}
        togglingMajorId={togglingMajorId}
        onPageChange={(page) => setOffset((page - 1) * PAGE_SIZE)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <MajorFormDialog
        open={dialogOpen}
        mode={dialogMode}
        major={selectedMajor}
        errorMessage={dialogError}
        isSubmitting={createMajorPending || updateMajorPending}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setDialogError(null)
            setSelectedMajor(null)
          }
        }}
        onSubmit={handleDialogSubmit}
      />

      <MajorDeleteDialog
        open={deleteDialogOpen}
        major={majorToDelete}
        isDeleting={deleteMajorPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setMajorToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default MajorPage

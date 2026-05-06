import { startTransition, useEffect, useState } from "react"

import KnowledgeChunkDeleteDialog from "@/features/knowledge-chunk/components/knowledge-chunk-delete-dialog"
import KnowledgeChunkDeleteUploadedFileDialog from "@/features/knowledge-chunk/components/knowledge-chunk-delete-uploaded-file-dialog"
import KnowledgeChunkFormDialog from "@/features/knowledge-chunk/components/knowledge-chunk-form-dialog"
import KnowledgeChunkRebuildAlertDialog from "@/features/knowledge-chunk/components/knowledge-chunk-rebuild-alert-dialog"
import KnowledgeChunkTable from "@/features/knowledge-chunk/components/knowledge-chunk-table"
import KnowledgeChunkToolbar from "@/features/knowledge-chunk/components/knowledge-chunk-toolbar"
import KnowledgeChunkUploadDialog from "@/features/knowledge-chunk/components/knowledge-chunk-upload-dialog"
import useKnowledgeChunk from "@/hooks/use-knowledge-chunk"
import type { KnowledgeChunkFormValues } from "@/schemas/knowledge-chunk-schema"
import type {
  AdmissionCategory,
  KnowledgeChunk,
  KnowledgeChunkListParams,
} from "@/types/knowledge-chunk-type"

const PAGE_SIZE = 4
const UPLOADED_FILE_PAGE_SIZE = 10

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE"
type EmbeddingFilter = "ALL" | "READY" | "MISSING"

const KnowledgeChunkPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<
    AdmissionCategory | "ALL"
  >("ALL")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [embeddingFilter, setEmbeddingFilter] = useState<EmbeddingFilter>("ALL")
  const [offset, setOffset] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedChunk, setSelectedChunk] = useState<KnowledgeChunk | null>(
    null
  )
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteUploadedDialogOpen, setDeleteUploadedDialogOpen] =
    useState(false)
  const [uploadedFileSearchInput, setUploadedFileSearchInput] = useState("")
  const [appliedUploadedFileSearch, setAppliedUploadedFileSearch] = useState("")
  const [uploadedFileOffset, setUploadedFileOffset] = useState(0)
  const [rebuildDialogOpen, setRebuildDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chunkToDelete, setChunkToDelete] = useState<KnowledgeChunk | null>(
    null
  )
  const [togglingChunkId, setTogglingChunkId] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setOffset(0)
        setAppliedSearch(searchInput.trim())
      })
    }, 1000)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    if (!deleteUploadedDialogOpen) return
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setUploadedFileOffset(0)
        setAppliedUploadedFileSearch(uploadedFileSearchInput.trim())
      })
    }, 500)
    return () => window.clearTimeout(timeoutId)
  }, [deleteUploadedDialogOpen, uploadedFileSearchInput])

  const params: KnowledgeChunkListParams = {
    limit: PAGE_SIZE,
    offset,
    q: appliedSearch || undefined,
    category: categoryFilter === "ALL" ? undefined : categoryFilter,
    is_active: statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
    needs_embedding:
      embeddingFilter === "ALL" ? undefined : embeddingFilter === "MISSING",
  }

  const {
    knowledgeChunkList,
    knowledgeChunkListPending,
    knowledgeChunkListFetching,
    createKnowledgeChunk: createKnowledgeChunkAction,
    createKnowledgeChunkPending,
    updateKnowledgeChunk: updateKnowledgeChunkAction,
    updateKnowledgeChunkPending,
    updateKnowledgeChunkStatus: updateKnowledgeChunkStatusAction,
    deleteKnowledgeChunk: deleteKnowledgeChunkAction,
    deleteKnowledgeChunkPending,
    uploadKnowledgeChunkFile: uploadKnowledgeChunkFileAction,
    uploadKnowledgeChunkFilePending,
    deleteUploadedKnowledgeChunkFile: deleteUploadedKnowledgeChunkFileAction,
    deleteUploadedKnowledgeChunkFilePending,
    uploadedKnowledgeChunkFileList,
    uploadedKnowledgeChunkFileListPending,
    uploadedKnowledgeChunkFileListFetching,
    rebuildMissingEmbeddings: rebuildMissingEmbeddingsAction,
    rebuildMissingEmbeddingsPending,
  } = useKnowledgeChunk(params, {
    limit: UPLOADED_FILE_PAGE_SIZE,
    offset: uploadedFileOffset,
    title: appliedUploadedFileSearch || undefined,
  })

  const total = knowledgeChunkList?.total ?? 0
  const items = knowledgeChunkList?.items ?? []
  const uploadedFiles = uploadedKnowledgeChunkFileList?.items ?? []
  const uploadedFilesTotal = uploadedKnowledgeChunkFileList?.total ?? 0

  const handleCreateClick = () => {
    setDialogMode("create")
    setSelectedChunk(null)
    setDialogError(null)
    setActionSuccess(null)
    setDialogOpen(true)
  }

  const handleEditClick = (chunk: KnowledgeChunk) => {
    setDialogMode("edit")
    setSelectedChunk(chunk)
    setDialogError(null)
    setActionSuccess(null)
    setDialogOpen(true)
  }

  const handleDialogSubmit = async (values: KnowledgeChunkFormValues) => {
    setDialogError(null)
    const payload = {
      major_id: values.major_id,
      category: values.category as AdmissionCategory,
      title: values.title,
      content: values.content,
      year: values.year,
      source: values.source,
      source_url: values.source_url,
      version: values.version,
    }
    try {
      if (dialogMode === "create") {
        await createKnowledgeChunkAction({
          ...payload,
          is_active: true,
          needs_embedding: true,
        })
        setDialogOpen(false)
        return
      }
      if (!selectedChunk) return
      await updateKnowledgeChunkAction({
        chunkId: selectedChunk.id,
        values: payload,
      })
      setDialogOpen(false)
      setSelectedChunk(null)
    } catch (error) {
      setDialogError(error instanceof Error ? error.message : "Có lỗi xảy ra.")
    }
  }

  const handleToggleStatus = async (chunk: KnowledgeChunk) => {
    setTogglingChunkId(chunk.id)
    setActionError(null)
    setActionSuccess(null)
    try {
      await updateKnowledgeChunkStatusAction({
        chunkId: chunk.id,
        is_active: !chunk.is_active,
      })
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Có lỗi xảy ra.")
    } finally {
      setTogglingChunkId(null)
    }
  }

  const handleDeleteClick = (chunk: KnowledgeChunk) => {
    setChunkToDelete(chunk)
    setActionSuccess(null)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!chunkToDelete) return
    try {
      await deleteKnowledgeChunkAction(chunkToDelete.id)
      if (items.length === 1 && offset > 0)
        setOffset(Math.max(0, offset - PAGE_SIZE))
      setDeleteDialogOpen(false)
      setChunkToDelete(null)
      setActionError(null)
      setActionSuccess("Đã xóa knowledge chunk thành công.")
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Có lỗi xảy ra.")
    }
  }

  const handleClearFilters = () => {
    setSearchInput("")
    setAppliedSearch("")
    setCategoryFilter("ALL")
    setStatusFilter("ALL")
    setEmbeddingFilter("ALL")
    setOffset(0)
  }

  const handleRebuildMissingEmbeddings = async () => {
    setActionError(null)
    setActionSuccess(null)
    try {
      const response = await rebuildMissingEmbeddingsAction(100)
      setRebuildDialogOpen(false)
      setActionSuccess(
        `Rebuild hoàn tất. Đã xử lý ${response.processed}, embed thành công ${response.embedded}, thất bại ${response.failed}.`
      )
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Có lỗi xảy ra.")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-950">
          Knowledge Chunks
        </h1>
        <p className="text-[13px] text-slate-500">
          Quản lý nội dung có cấu trúc cho hệ thống truy xuất thông tin tuyển
          sinh bằng AI.
        </p>
      </div>

      <KnowledgeChunkToolbar
        searchInput={searchInput}
        appliedSearch={appliedSearch}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        embeddingFilter={embeddingFilter}
        onSearchInputChange={setSearchInput}
        onCategoryFilterChange={(value) => {
          setCategoryFilter(value)
          setOffset(0)
        }}
        onStatusFilterChange={(value) => {
          setStatusFilter(value)
          setOffset(0)
        }}
        onEmbeddingFilterChange={(value) => {
          setEmbeddingFilter(value)
          setOffset(0)
        }}
        onCreateClick={handleCreateClick}
        onUploadFileClick={() => {
          setActionSuccess(null)
          setUploadDialogOpen(true)
        }}
        onDeleteUploadedFileClick={() => {
          setActionSuccess(null)
          setUploadedFileSearchInput("")
          setAppliedUploadedFileSearch("")
          setUploadedFileOffset(0)
          setDeleteUploadedDialogOpen(true)
        }}
        onRebuildClick={() => {
          setActionSuccess(null)
          setRebuildDialogOpen(true)
        }}
        onClearFilters={handleClearFilters}
      />

      {actionError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-[13px] text-red-600">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-[13px] text-emerald-700">
          {actionSuccess}
        </div>
      )}

      <KnowledgeChunkTable
        items={items}
        total={total}
        limit={PAGE_SIZE}
        offset={offset}
        isLoading={knowledgeChunkListPending}
        isFetching={knowledgeChunkListFetching}
        togglingChunkId={togglingChunkId}
        onPageChange={(page) => setOffset((page - 1) * PAGE_SIZE)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <KnowledgeChunkFormDialog
        open={dialogOpen}
        mode={dialogMode}
        chunk={selectedChunk}
        errorMessage={dialogError}
        isSubmitting={
          createKnowledgeChunkPending || updateKnowledgeChunkPending
        }
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setDialogError(null)
            setSelectedChunk(null)
          }
        }}
        onSubmit={handleDialogSubmit}
      />

      <KnowledgeChunkDeleteDialog
        open={deleteDialogOpen}
        chunk={chunkToDelete}
        isDeleting={deleteKnowledgeChunkPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setChunkToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />

      <KnowledgeChunkUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSubmit={uploadKnowledgeChunkFileAction}
        isSubmitting={uploadKnowledgeChunkFilePending}
      />

      <KnowledgeChunkDeleteUploadedFileDialog
        open={deleteUploadedDialogOpen}
        files={uploadedFiles}
        total={uploadedFilesTotal}
        limit={UPLOADED_FILE_PAGE_SIZE}
        offset={uploadedFileOffset}
        searchInput={uploadedFileSearchInput}
        isLoading={uploadedKnowledgeChunkFileListPending}
        isFetching={uploadedKnowledgeChunkFileListFetching}
        onSearchInputChange={setUploadedFileSearchInput}
        onPageChange={(nextOffset) => setUploadedFileOffset(nextOffset)}
        onOpenChange={(open) => {
          setDeleteUploadedDialogOpen(open)
          if (!open) {
            setUploadedFileSearchInput("")
            setAppliedUploadedFileSearch("")
            setUploadedFileOffset(0)
          }
        }}
        onSubmit={deleteUploadedKnowledgeChunkFileAction}
        isSubmitting={deleteUploadedKnowledgeChunkFilePending}
      />

      <KnowledgeChunkRebuildAlertDialog
        open={rebuildDialogOpen}
        onOpenChange={setRebuildDialogOpen}
        onConfirm={handleRebuildMissingEmbeddings}
        isSubmitting={rebuildMissingEmbeddingsPending}
      />
    </div>
  )
}

export default KnowledgeChunkPage

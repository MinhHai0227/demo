import { useState } from "react"
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Trash2,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type {
  DeleteUploadedKnowledgeChunkFilePayload,
  DeleteUploadedKnowledgeChunkFileResponse,
  KnowledgeChunkUploadedFile,
} from "@/types/knowledge-chunk-type"

type KnowledgeChunkDeleteUploadedFileDialogProps = {
  open: boolean
  files: KnowledgeChunkUploadedFile[]
  total: number
  limit: number
  offset: number
  searchInput: string
  isLoading?: boolean
  isFetching?: boolean
  onSearchInputChange: (value: string) => void
  onPageChange: (offset: number) => void
  onOpenChange: (open: boolean) => void
  onSubmit: (
    payload: DeleteUploadedKnowledgeChunkFilePayload
  ) => Promise<DeleteUploadedKnowledgeChunkFileResponse>
  isSubmitting?: boolean
}

const formatDate = (value?: string | null) => {
  if (!value) return "-"
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

const KnowledgeChunkDeleteUploadedFileDialog = ({
  open,
  files,
  total,
  limit,
  offset,
  searchInput,
  isLoading = false,
  isFetching = false,
  onSearchInputChange,
  onPageChange,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: KnowledgeChunkDeleteUploadedFileDialogProps) => {
  const [fileToDelete, setFileToDelete] =
    useState<KnowledgeChunkUploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] =
    useState<DeleteUploadedKnowledgeChunkFileResponse | null>(null)
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startItem = total === 0 ? 0 : offset + 1
  const endItem = Math.min(offset + files.length, total)
  const canGoPrevious = offset > 0
  const canGoNext = offset + limit < total

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFileToDelete(null)
      setError(null)
      setResult(null)
    }
    onOpenChange(nextOpen)
  }

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return

    setError(null)
    setResult(null)

    try {
      const response = await onSubmit({ r2_key: fileToDelete.r2_key })
      setResult(response)
      setFileToDelete(null)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Delete request failed. Please try again."
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[88vh] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-3xl">
          <DialogHeader className="border-b border-slate-100 bg-gradient-to-r from-red-50 to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <Trash2 className="size-4" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Delete uploaded file
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Select a file to deactivate all related chunks and remove its
                  R2 object.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="border-b border-slate-100 px-6 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchInput}
                placeholder="Search file title, file name, R2 key..."
                className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none"
                onChange={(event) => onSearchInputChange(event.target.value)}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{total} uploaded file group(s)</span>
              {isFetching && !isLoading && (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" />
                  Refreshing
                </span>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading uploaded files...
              </div>
            ) : files.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <FileText className="size-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No uploaded files found
                </p>
                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Upload a file first, or try a different search title.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.r2_key}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {file.title || file.file_name || "Uploaded file"}
                            </p>
                            <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
                              {file.r2_key}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                {file.chunk_count} chunks
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                v{file.version ?? 1}
                              </span>
                              {file.year && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                  {file.year}
                                </span>
                              )}
                              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                Updated {formatDate(file.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-end gap-2">
                        {file.file_url && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg border-slate-200 text-slate-500 hover:text-slate-900"
                            onClick={() =>
                              window.open(
                                file.file_url || "",
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <ExternalLink className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-red-100 text-xs text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          disabled={isSubmitting}
                          onClick={() => setFileToDelete(file)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-4 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="border-b border-emerald-200 px-4 py-2.5">
                  <p className="text-xs font-semibold text-emerald-800">
                    {result.message}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-4 py-3 md:grid-cols-4">
                  {[
                    { label: "Chunks", value: result.total_chunks },
                    {
                      label: "Qdrant",
                      value: result.qdrant_deleted_chunks,
                    },
                    {
                      label: "DB inactive",
                      value: result.db_deactivated_chunks,
                    },
                    {
                      label: "R2 deleted",
                      value: result.r2_file_deleted ? "Yes" : "No",
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] tracking-wider text-emerald-600 uppercase">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-emerald-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <div className="mr-auto text-xs text-slate-500">
              {startItem}-{endItem} of {total} · Page {currentPage} of{" "}
              {totalPages}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-sm text-slate-600"
              disabled={!canGoPrevious || isFetching}
              onClick={() => onPageChange(Math.max(0, offset - limit))}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-sm text-slate-600"
              disabled={!canGoNext || isFetching}
              onClick={() => onPageChange(offset + limit)}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-sm text-slate-600"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(fileToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setFileToDelete(null)
        }}
      >
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0">
          <div className="flex flex-col items-center gap-3 bg-red-50 px-6 py-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-red-200 bg-white text-red-500">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogHeader className="space-y-1 text-center">
              <AlertDialogTitle className="text-base font-semibold text-slate-900">
                Delete this uploaded file?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs leading-relaxed text-slate-500">
                This will deactivate all chunks generated from{" "}
                <span className="font-medium text-slate-700">
                  "{fileToDelete?.title || fileToDelete?.file_name || "file"}"
                </span>{" "}
                and delete the R2 file when possible.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <AlertDialogFooter className="flex flex-row items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4">
            <AlertDialogCancel
              disabled={isSubmitting}
              className="h-9 rounded-xl border-slate-200 text-sm text-slate-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              className="h-9 rounded-xl bg-red-600 text-sm hover:bg-red-700 focus:ring-red-500"
              onClick={(event) => {
                event.preventDefault()
                void handleConfirmDelete()
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" /> Delete file
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default KnowledgeChunkDeleteUploadedFileDialog

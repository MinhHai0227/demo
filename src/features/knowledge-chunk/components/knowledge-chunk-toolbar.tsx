import {
  BookOpenText,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  admissionCategoryOptions,
  type AdmissionCategory,
} from "@/types/knowledge-chunk-type"

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE"
type EmbeddingFilter = "ALL" | "READY" | "MISSING"

type KnowledgeChunkToolbarProps = {
  searchInput: string
  appliedSearch: string
  categoryFilter: AdmissionCategory | "ALL"
  statusFilter: StatusFilter
  embeddingFilter: EmbeddingFilter
  onSearchInputChange: (value: string) => void
  onCategoryFilterChange: (value: AdmissionCategory | "ALL") => void
  onStatusFilterChange: (value: StatusFilter) => void
  onEmbeddingFilterChange: (value: EmbeddingFilter) => void
  onCreateClick: () => void
  onUploadFileClick: () => void
  onDeleteUploadedFileClick: () => void
  onRebuildClick: () => void
  onClearFilters: () => void
}

const KnowledgeChunkToolbar = ({
  searchInput,
  appliedSearch,
  categoryFilter,
  statusFilter,
  embeddingFilter,
  onSearchInputChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onEmbeddingFilterChange,
  onCreateClick,
  onUploadFileClick,
  onDeleteUploadedFileClick,
  onRebuildClick,
  onClearFilters,
}: KnowledgeChunkToolbarProps) => {
  const hasFilters = Boolean(
    appliedSearch ||
    categoryFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    embeddingFilter !== "ALL"
  )
  const isDebouncing = searchInput.trim() !== appliedSearch

  return (
    <div className="space-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Main row: Search + Actions */}
      <div className="flex flex-col gap-3 px-4 pt-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchInput}
            placeholder="Search title, content, source..."
            className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none placeholder:text-slate-400"
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900"
              onClick={onClearFilters}
            >
              <X className="size-4" />
            </Button>
          )}

          <Separator orientation="vertical" className="mx-1 hidden h-6 xl:block" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-slate-200 px-3 text-sm text-slate-600"
            onClick={onUploadFileClick}
          >
            <Upload className="size-4" />
            Upload
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-red-100 px-3 text-sm text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onDeleteUploadedFileClick}
          >
            <Trash2 className="size-4" />
            Delete file
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-amber-200 px-3 text-sm text-amber-700 hover:bg-amber-50"
            onClick={onRebuildClick}
          >
            <RefreshCcw className="size-4" />
            Rebuild
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-10 rounded-xl px-4 text-sm font-medium"
            onClick={onCreateClick}
          >
            <BookOpenText className="size-4" />
            New chunk
          </Button>
        </div>
      </div>

      {/* Category tabs row */}
      <div className="flex flex-col gap-2 border-t border-slate-100 px-4 pb-3 sm:flex-row sm:items-center">
        <span className="shrink-0 text-xs font-medium text-slate-500">Category:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onCategoryFilterChange("ALL")}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
              categoryFilter === "ALL"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            All
          </button>
          {admissionCategoryOptions.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryFilterChange(cat.value)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
                categoryFilter === cat.value
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary filters row */}
      <div className="flex flex-col gap-2 border-t border-slate-100 px-4 pb-4 sm:flex-row sm:items-center">
        <span className="shrink-0 text-xs font-medium text-slate-500">Status:</span>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-8 w-32 rounded-lg border-slate-200 bg-slate-50 text-xs shadow-none">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={embeddingFilter} onValueChange={onEmbeddingFilterChange}>
            <SelectTrigger className="h-8 w-32 rounded-lg border-slate-200 bg-slate-50 text-xs shadow-none">
              <SelectValue placeholder="All embeddings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All embeddings</SelectItem>
              <SelectItem value="READY">Ready</SelectItem>
              <SelectItem value="MISSING">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status strip */}
        {(isDebouncing || hasFilters) && (
          <div className="ml-auto flex items-center gap-2">
            {isDebouncing && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                </span>
                Waiting...
              </span>
            )}
            {hasFilters && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 ring-inset">
                Filters active
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowledgeChunkToolbar

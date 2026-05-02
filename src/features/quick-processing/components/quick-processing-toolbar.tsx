import { RefreshCcw, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

type QuickProcessingToolbarProps = {
  total: number
  isFetching?: boolean
  onUploadClick: () => void
  onRefreshClick: () => void
}

const QuickProcessingToolbar = ({
  total,
  isFetching = false,
  onUploadClick,
  onRefreshClick,
}: QuickProcessingToolbarProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            OCR job queue
          </h2>
          <p className="text-xs text-slate-500">
            {total} job{total === 1 ? "" : "s"} available for review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-slate-200 px-3 text-sm text-slate-600"
            onClick={onRefreshClick}
          >
            <RefreshCcw
              className={isFetching ? "size-4 animate-spin" : "size-4"}
            />
            Refresh
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-10 rounded-xl px-4 text-sm font-medium"
            onClick={onUploadClick}
          >
            <Upload className="size-4" />
            Upload document
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuickProcessingToolbar

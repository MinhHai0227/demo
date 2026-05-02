import { Globe2, RefreshCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PageJobFilter = "ALL" | "PENDING_KB" | "SENT_KB"

type WebCrawlerToolbarProps = {
  sessionTotal: number
  pageTotal: number
  searchInput: string
  pageJobFilter: PageJobFilter
  selectedSessionLabel?: string
  isFetching?: boolean
  onSearchInputChange: (value: string) => void
  onPageJobFilterChange: (value: PageJobFilter) => void
  onCreateClick: () => void
  onRefreshClick: () => void
  onClearSession: () => void
}

const WebCrawlerToolbar = ({
  sessionTotal,
  pageTotal,
  searchInput,
  pageJobFilter,
  selectedSessionLabel,
  isFetching = false,
  onSearchInputChange,
  onPageJobFilterChange,
  onCreateClick,
  onRefreshClick,
  onClearSession,
}: WebCrawlerToolbarProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-4 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Crawl workspace
            </h2>
            <p className="text-xs text-slate-500">
              {sessionTotal} session{sessionTotal === 1 ? "" : "s"} and{" "}
              {pageTotal} page job{pageTotal === 1 ? "" : "s"}.
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
              onClick={onCreateClick}
            >
              <Globe2 className="size-4" />
              New crawl
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              placeholder="Search page URL or title"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none"
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
          </div>

          <Select
            value={pageJobFilter}
            onValueChange={(value) =>
              onPageJobFilterChange(value as PageJobFilter)
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-none md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All pages</SelectItem>
              <SelectItem value="PENDING_KB">Pending KB</SelectItem>
              <SelectItem value="SENT_KB">Sent to KB</SelectItem>
            </SelectContent>
          </Select>

          {selectedSessionLabel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 max-w-full rounded-xl border-slate-200 px-3 text-sm text-slate-600 md:max-w-72"
              onClick={onClearSession}
            >
              <span className="truncate">{selectedSessionLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export type { PageJobFilter }
export default WebCrawlerToolbar

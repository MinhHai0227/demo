import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type HotQuestionsToolbarProps = {
  searchInput: string
  appliedSearch: string
  intentFilter: string
  fallbackFilter: "ALL" | "TRUE" | "FALSE"
  intentOptions: readonly string[]
  onSearchInputChange: (value: string) => void
  onIntentFilterChange: (value: string) => void
  onFallbackFilterChange: (value: "ALL" | "TRUE" | "FALSE") => void
  onClearFilters: () => void
}

const HotQuestionsToolbar = ({
  searchInput,
  appliedSearch,
  intentFilter,
  fallbackFilter,
  intentOptions,
  onSearchInputChange,
  onIntentFilterChange,
  onFallbackFilterChange,
  onClearFilters,
}: HotQuestionsToolbarProps) => {
  const hasFilters = Boolean(
    appliedSearch || intentFilter !== "ALL" || fallbackFilter !== "ALL"
  )
  const isDebouncing = searchInput.trim() !== appliedSearch

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 xl:flex-row xl:items-center">
        <div className="grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1.8fr)_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              placeholder="Search by question, normalized text, intent..."
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm shadow-none placeholder:text-slate-400"
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
          </div>

          <Select value={intentFilter} onValueChange={onIntentFilterChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
              <SelectValue placeholder="All intents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All intents</SelectItem>
              {intentOptions.map((intent) => (
                <SelectItem key={intent} value={intent}>
                  {intent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={fallbackFilter}
            onValueChange={(value) =>
              onFallbackFilterChange(value as "ALL" | "TRUE" | "FALSE")
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
              <SelectValue placeholder="All fallback states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All questions</SelectItem>
              <SelectItem value="TRUE">Fallback only</SelectItem>
              <SelectItem value="FALSE">Answered only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900"
              onClick={onClearFilters}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {(isDebouncing || hasFilters) && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
          {isDebouncing ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Waiting...
            </span>
          ) : null}

          {hasFilters ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 ring-inset">
              Filters active
            </span>
          ) : null}

          <span className="ml-auto text-xs text-slate-400">
            Results update 1s after you stop typing
          </span>
        </div>
      )}
    </div>
  )
}

export default HotQuestionsToolbar

import { Activity, LineChart, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Lead, LeadScoreHistoryResponse } from "@/types/lead-type"

type LeadScoreHistoryDialogProps = {
  open: boolean
  lead?: Lead | null
  history?: LeadScoreHistoryResponse
  isLoading?: boolean
  isFetching?: boolean
  onOpenChange: (open: boolean) => void
}

const CHART_HEIGHT = 180
const CHART_PADDING = 18

const buildPolylinePoints = (scores: number[]) => {
  if (!scores.length) return ""

  const width = 100
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2
  const maxScore = Math.max(100, ...scores)
  const minScore = Math.min(0, ...scores)
  const scoreRange = Math.max(1, maxScore - minScore)

  return scores
    .map((score, index) => {
      const x = scores.length === 1 ? 50 : (index / (scores.length - 1)) * width
      const y =
        CHART_PADDING +
        (1 - (score - minScore) / scoreRange) * usableHeight

      return `${x},${y}`
    })
    .join(" ")
}

const LeadScoreHistoryDialog = ({
  open,
  lead,
  history,
  isLoading = false,
  isFetching = false,
  onOpenChange,
}: LeadScoreHistoryDialogProps) => {
  const items = history?.items ?? []
  const scores = items.map((item) => item.running_activity_score)
  const points = buildPolylinePoints(scores)
  const currentScore = history?.current_score ?? lead?.score ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <LineChart className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {lead?.full_name || "Lead"} score history
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Visualize score movement from recorded lead activities.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
          {isLoading && !history ? (
            <div className="space-y-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Current score
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {currentScore}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Temperature
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {history?.temperature ?? lead?.temperature ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Score events
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-900">
                    {history?.total ?? items.length}
                    {isFetching && !isLoading ? (
                      <Loader2 className="size-4 animate-spin text-slate-400" />
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Running activity score
                    </p>
                    <p className="text-xs text-slate-500">
                      Calculated from score deltas in chronological order.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-slate-200 text-xs">
                    {items.length} points
                  </Badge>
                </div>

                {points ? (
                  <svg
                    viewBox={`0 0 100 ${CHART_HEIGHT}`}
                    preserveAspectRatio="none"
                    className="h-48 w-full overflow-visible rounded-xl bg-slate-50"
                  >
                    <line
                      x1="0"
                      x2="100"
                      y1={CHART_HEIGHT - CHART_PADDING}
                      y2={CHART_HEIGHT - CHART_PADDING}
                      className="stroke-slate-200"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      x2="100"
                      y1={CHART_PADDING}
                      y2={CHART_PADDING}
                      className="stroke-slate-200"
                      strokeWidth="1"
                    />
                    <polyline
                      points={points}
                      fill="none"
                      className="stroke-amber-500"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                    />
                    {scores.map((score, index) => {
                      const [x, y] = points.split(" ")[index].split(",")

                      return (
                        <circle
                          key={`${score}-${index}`}
                          cx={x}
                          cy={y}
                          r="1.7"
                          className="fill-white stroke-amber-500"
                          strokeWidth="1.1"
                        />
                      )
                    })}
                  </svg>
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center">
                    <Activity className="size-5 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      No score history yet
                    </p>
                    <p className="text-xs text-slate-500">
                      Score movements will appear after lead activities are recorded.
                    </p>
                  </div>
                )}
              </div>

              {items.length ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.action}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDateTime(item.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                              item.score_delta >= 0
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700"
                            )}
                          >
                            {item.score_delta >= 0 ? "+" : ""}
                            {item.score_delta}
                          </Badge>
                          <span className="rounded-md bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {item.running_activity_score}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LeadScoreHistoryDialog

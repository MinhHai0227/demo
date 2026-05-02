import { MessagesSquare, Radio, Workflow } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ConversationStats } from "@/types/admin-analytics-type"

type DashboardConversationStatsPanelProps = {
  stats?: ConversationStats
  isLoading: boolean
  isFetching: boolean
}

type BreakdownItem = {
  label: string
  count: number
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  HANDOFF: "Handoff",
  CLOSED: "Closed",
}

const CHANNEL_LABELS: Record<string, string> = {
  WEB: "Web",
  ZALO: "Zalo",
  FACEBOOK: "Facebook",
  TELEGRAM: "Telegram",
}

const normalizeBreakdown = (
  items: Array<{ status?: string | null; channel?: string | null; count: number }>,
  labels: Record<string, string>
): BreakdownItem[] =>
  items.map((item) => {
    const rawLabel = item.status ?? item.channel ?? "UNKNOWN"

    return {
      label: labels[rawLabel] ?? rawLabel,
      count: item.count,
    }
  })

const BreakdownList = ({
  title,
  items,
  total,
}: {
  title: string
  items: BreakdownItem[]
  total: number
}) => (
  <div>
    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
      {title}
    </p>
    <div className="mt-2 space-y-2">
      {items.length ? (
        items.map((item) => {
          const percent = total > 0 ? (item.count / total) * 100 : 0

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-700">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-700"
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </div>
          )
        })
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
          No conversation data yet.
        </div>
      )}
    </div>
  </div>
)

const DashboardConversationStatsPanel = ({
  stats,
  isLoading,
  isFetching,
}: DashboardConversationStatsPanelProps) => {
  const statusItems = normalizeBreakdown(stats?.by_status ?? [], STATUS_LABELS)
  const channelItems = normalizeBreakdown(stats?.by_channel ?? [], CHANNEL_LABELS)
  const total = stats?.total ?? 0

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <MessagesSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Conversations
            </h2>
            <p className="text-xs text-slate-500">Status and channel split.</p>
          </div>
        </div>
        {isFetching ? (
          <Badge variant="outline" className="border-slate-200 text-xs text-slate-500">
            Refreshing
          </Badge>
        ) : null}
      </div>

      <div className="space-y-4 px-3.5 py-3.5">
        {isLoading && !stats ? (
          <>
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Total conversations
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {total}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    total > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  <Workflow className="size-4" />
                </div>
              </div>
            </div>

            <BreakdownList title="By status" items={statusItems} total={total} />
            <BreakdownList title="By channel" items={channelItems} total={total} />

            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              <Radio className="size-3.5" />
              Live chat mix
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardConversationStatsPanel

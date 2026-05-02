import { MessageSquare, TrendingDown, UserPlus, Zap } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DailyAnalyticsSummary } from "@/types/admin-analytics-type"

type DashboardSummaryPanelProps = {
  summary?: DailyAnalyticsSummary
  isLoading: boolean
  isFetching: boolean
}

type SummaryMetricCardProps = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "slate" | "emerald" | "amber" | "rose"
  isFetching?: boolean
}

const TONE_STYLES: Record<
  NonNullable<SummaryMetricCardProps["tone"]>,
  {
    card: string
    icon: string
    label: string
  }
> = {
  slate: {
    card: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
    icon: "bg-slate-100 text-slate-600",
    label: "text-slate-500",
  },
  emerald: {
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white",
    icon: "bg-emerald-100 text-emerald-700",
    label: "text-emerald-600",
  },
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
    icon: "bg-amber-100 text-amber-700",
    label: "text-amber-600",
  },
  rose: {
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-white",
    icon: "bg-rose-100 text-rose-600",
    label: "text-rose-500",
  },
}

const SummaryMetricCard = ({
  label,
  value,
  icon: Icon,
  tone = "slate",
  isFetching = false,
}: SummaryMetricCardProps) => {
  const styles = TONE_STYLES[tone]

  return (
    <div className={cn("rounded-2xl border p-4 shadow-sm", styles.card)}>
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-xl",
            styles.icon
          )}
        >
          <Icon className="size-4" />
        </div>
        {isFetching && (
          <span className={cn("text-[10px] font-medium", styles.label)}>
            updating
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-3 text-[11px] font-medium tracking-wider uppercase",
          styles.label
        )}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

const DashboardSummaryPanel = ({
  summary,
  isLoading,
  isFetching,
}: DashboardSummaryPanelProps) => {
  if (isLoading && !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryMetricCard
        label="Total chats"
        value={`${summary?.total_chats ?? 0}`}
        icon={MessageSquare}
        tone="slate"
      />
      <SummaryMetricCard
        label="New leads"
        value={`${summary?.new_leads ?? 0}`}
        icon={UserPlus}
        tone="emerald"
      />
      <SummaryMetricCard
        label="Fallbacks"
        value={`${summary?.fallbacks ?? 0}`}
        icon={Zap}
        tone="amber"
      />
      <SummaryMetricCard
        label="Fallback rate"
        value={`${((summary?.fallback_rate ?? 0) * 100).toFixed(1)}%`}
        icon={TrendingDown}
        tone="rose"
        isFetching={isFetching}
      />
    </div>
  )
}

export default DashboardSummaryPanel

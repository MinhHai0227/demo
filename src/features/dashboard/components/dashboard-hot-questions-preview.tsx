import { ArrowRight, MessageSquareQuote } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { HotQuestion } from "@/types/admin-analytics-type"

type DashboardHotQuestionsPreviewProps = {
  items: HotQuestion[]
  isLoading: boolean
  isFetching: boolean
}

const DashboardHotQuestionsPreview = ({
  items,
  isLoading,
  isFetching,
}: DashboardHotQuestionsPreviewProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-2.5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Top hot questions
          </h2>
          <p className="text-xs text-slate-500">
            Top 5 cau hoi duoc hoi nhieu nhat de admin xem nhanh tren dashboard.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="h-7 rounded-lg px-2">
          <Link to="/admin/hot-questions">
            View all
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="space-y-2 px-3.5 py-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))
        ) : items.length ? (
          items.map((item, index) => (
            <Link
              key={item.id}
              to="/admin/hot-questions"
              className="block rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-semibold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-xs font-medium leading-4.5 text-slate-900">
                      {item.question}
                    </p>
                    {isFetching ? (
                      <Badge
                        variant="outline"
                        className="h-4.5 border-slate-200 px-1.5 text-[8px] text-slate-500"
                      >
                        updating
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <Badge
                      variant="outline"
                      className="h-4.5 border-slate-200 bg-white px-1.5 text-[9px] text-slate-700"
                    >
                      {item.intent ?? "No intent"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="h-4.5 border-slate-200 bg-white px-1.5 text-[9px] text-slate-700"
                    >
                      {item.count} asks
                    </Badge>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[9px] font-medium",
                        item.is_fallback
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {item.is_fallback ? "Fallback" : "Answered"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center">
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
              <MessageSquareQuote className="size-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">
              Chua co du lieu hot questions de hien thi tren dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHotQuestionsPreview

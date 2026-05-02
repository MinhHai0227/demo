import { AlertCircle } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { HotQuestionsSummary } from "@/types/admin-analytics-type"

type HotQuestionsInsightsProps = {
  summary?: HotQuestionsSummary
  isLoading?: boolean
}

const HotQuestionsInsights = ({
  summary,
  isLoading = false,
}: HotQuestionsInsightsProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Insights</h2>
        <p className="text-xs text-slate-500">
          Snapshot tong hop cua hot questions.
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Total questions
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {summary?.total_questions ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Total asks
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {summary?.total_asks ?? 0}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <AlertCircle className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Fallback overview
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {summary?.fallback_questions ?? 0} unique questions da bi
                fallback, tong cong {summary?.fallback_asks ?? 0} luot hoi.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Top intents
          </p>
          <Separator className="my-3" />

          <div className="space-y-1.5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-9 rounded-xl" />
              ))
            ) : summary?.top_intents?.length ? (
              summary.top_intents.map((item, index) => (
                <div
                  key={item.intent}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                    {item.intent}
                  </span>
                  <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
                Chua co top intents cho hot questions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotQuestionsInsights

import { FileSearch, Loader2, MessageSquareQuote } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { HotQuestion } from "@/types/admin-analytics-type"
import type { MessageSources } from "@/types/chat-type"

type HotQuestionDetailDialogProps = {
  open: boolean
  detail?: HotQuestion
  sources?: MessageSources
  isLoading: boolean
  isFetching: boolean
  isSourcesLoading?: boolean
  isSourcesFetching?: boolean
  sourcesError?: string
  onOpenChange: (open: boolean) => void
}

const HotQuestionDetailDialog = ({
  open,
  detail,
  sources,
  isLoading,
  isFetching,
  isSourcesLoading = false,
  isSourcesFetching = false,
  sourcesError = "",
  onOpenChange,
}: HotQuestionDetailDialogProps) => {
  const hasAssistantMessage = Boolean(detail?.last_assistant_message_id)
  const sourceItems = sources?.items ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <MessageSquareQuote className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-slate-950">
                Nguồn dữ liệu
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Các chunk được dùng cho câu trả lời gần nhất của trợ lý.
              </DialogDescription>
            </div>

            {isFetching ? (
              <Badge
                variant="outline"
                className="shrink-0 border-slate-200 bg-white text-xs text-slate-500"
              >
                Đang tải
              </Badge>
            ) : null}
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-9rem)] space-y-5 overflow-y-auto px-6 py-5">
          {isLoading && !detail ? (
            <>
              <Skeleton className="h-10 rounded-xl" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </>
          ) : detail ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
                    <FileSearch className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">
                      Chunk nguồn
                    </p>
                    <p className="text-xs text-slate-500">
                      Message ID: {detail.last_assistant_message_id ?? "--"}
                    </p>
                  </div>
                </div>

                {isSourcesFetching ? (
                  <Badge
                    variant="outline"
                    className="w-fit shrink-0 gap-1 border-slate-200 bg-white text-xs text-slate-500"
                  >
                    <Loader2 className="size-3 animate-spin" />
                    Đang tải
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="w-fit shrink-0 border-slate-200 bg-white text-xs text-slate-500"
                  >
                    {sourceItems.length} chunk
                  </Badge>
                )}
              </div>

              {!hasAssistantMessage ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-xs text-slate-500">
                  Chưa có assistant message gắn với hot question này.
                </div>
              ) : sourcesError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  {sourcesError}
                </div>
              ) : isSourcesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : sourceItems.length > 0 ? (
                <div className="space-y-2.5">
                  {sourceItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs ring-1 ring-slate-50 transition-colors hover:border-slate-200"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-slate-200 bg-slate-50 text-[11px] text-slate-700"
                            >
                              Hạng {item.rank ?? index + 1}
                            </Badge>

                            {item.category ? (
                              <Badge
                                variant="outline"
                                className="rounded-full border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700"
                              >
                                {item.category}
                              </Badge>
                            ) : null}

                            {item.score !== null ? (
                              <span className="font-mono text-[11px] text-slate-500">
                                điểm {item.score.toFixed(3)}
                              </span>
                            ) : null}
                          </div>

                          <p className="wrap-break-word text-xs text-slate-500">
                            {item.source ?? "Nguồn không xác định"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-800">
                        {item.content ?? "--"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-xs text-slate-500">
                  Assistant message này chưa có chunk được ghi nhận.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-xs text-slate-500">
              Chọn một câu hỏi trong bảng để xem chi tiết.
            </div>
          )}
        </div>

        <DialogFooter
          className="border-t border-slate-100 bg-slate-50/80"
          showCloseButton
        />
      </DialogContent>
    </Dialog>
  )
}

export default HotQuestionDetailDialog
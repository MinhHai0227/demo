import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  formatTime,
  getDisplayName,
  getInitials,
  getStatusClassName,
  getStatusLabel,
  statusOptions,
} from "@/features/chat/chat-utils"
import { cn } from "@/lib/utils"
import type {
  ChatConversation,
  ChatConversationStatus,
} from "@/types/chat-type"
import { MessageCircle, MoreHorizontal, Search } from "lucide-react"
import { useRef } from "react"

type ChatConversationSidebarProps = {
  conversations: ChatConversation[]
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean | undefined
  total: number
  searchInput: string
  statusFilter: ChatConversationStatus | "ALL"
  selectedConversationId: string | null
  onLoadMore: () => void
  onSearchInputChange: (value: string) => void
  onStatusFilterChange: (value: ChatConversationStatus | "ALL") => void
  onSelectConversation: (conversationId: string) => void
}

const ChatConversationSidebar = ({
  conversations,
  isLoading,
  isFetchingMore,
  hasMore,
  total,
  searchInput,
  statusFilter,
  selectedConversationId,
  onLoadMore,
  onSearchInputChange,
  onStatusFilterChange,
  onSelectConversation,
}: ChatConversationSidebarProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = () => {
    const container = containerRef.current

    if (!container || !hasMore || isFetchingMore) {
      return
    }

    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    if (distanceToBottom <= 120) {
      onLoadMore()
    }
  }

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-950">Tin nhan</h1>
            <p className="text-xs text-slate-500">{total} cuoc hoi thoai</p>
          </div>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Tim ten, email, so dien thoai"
            className="h-9 rounded-full bg-slate-100 pl-8"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onStatusFilterChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {isLoading ? (
          <ConversationPlaceholder />
        ) : conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <MessageCircle className="mb-3 size-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              Chua co hoi thoai
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Thu doi bo loc hoac tim tu khoa khac.
            </p>
          </div>
        ) : (
          <>
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex w-full gap-3 border-b border-slate-100 px-3 py-3 text-left transition hover:bg-slate-50",
                  selectedConversationId === conversation.id &&
                    "bg-sky-50 hover:bg-sky-50"
                )}
              >
                <Avatar className="size-11 shrink-0">
                  <AvatarFallback className="bg-sky-600 text-white">
                    {getInitials(getDisplayName(conversation))}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {getDisplayName(conversation)}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatTime(
                        conversation.last_message_at || conversation.updated_at
                      )}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {conversation.last_message ||
                      conversation.summary ||
                      "Chưa có tin nhắn"}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full",
                        getStatusClassName(conversation.status)
                      )}
                    >
                      {getStatusLabel(conversation.status)}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {conversation.message_count} tin
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {isFetchingMore ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500">
                Đang tải thêm hội thoại...
              </div>
            ) : null}
          </>
        )}
      </div>
    </aside>
  )
}

const ConversationPlaceholder = () => (
  <div className="space-y-1 p-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex gap-3 rounded-lg p-3">
        <div className="size-11 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-slate-100" />
          <div className="h-3 w-full rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
)

export default ChatConversationSidebar

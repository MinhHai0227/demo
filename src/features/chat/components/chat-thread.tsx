import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getConversationMessages } from "@/api/chat-api"
import ChatMessageBubble from "@/features/chat/components/chat-message-bubble"
import {
  getDisplayName,
  getInitials,
  getStatusClassName,
  getStatusLabel,
} from "@/features/chat/chat-utils"
import { cn } from "@/lib/utils"
import type { ChatConversation } from "@/types/chat-type"
import { useInfiniteQuery } from "@tanstack/react-query"
import { MessageCircle, Send } from "lucide-react"
import type { FormEvent } from "react"
import { useEffect, useRef } from "react"

const MESSAGE_PAGE_SIZE = 30

type ChatThreadProps = {
  conversation: ChatConversation | null
  messageInput: string
  actionError: string | null
  isSending: boolean
  onMessageInputChange: (value: string) => void
  onSendMessage: () => void | Promise<void>
}

const ChatThread = ({
  conversation,
  messageInput,
  actionError,
  isSending,
  onMessageInputChange,
  onSendMessage,
}: ChatThreadProps) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const previousScrollHeightRef = useRef<number | null>(null)
  const shouldPreserveScrollRef = useRef(false)
  const hasInitializedScrollRef = useRef(false)

  const activeConversationId = conversation?.id ?? null

  const messagesQuery = useInfiniteQuery({
    queryKey: ["admin-message-items", activeConversationId],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getConversationMessages(activeConversationId as string, {
        before: pageParam,
        limit: MESSAGE_PAGE_SIZE,
      }),
    enabled: Boolean(activeConversationId),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_before ?? undefined,
  })

  const messages =
    messagesQuery.data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.items) ?? []

  useEffect(() => {
    hasInitializedScrollRef.current = false
    shouldPreserveScrollRef.current = false
    previousScrollHeightRef.current = null
  }, [activeConversationId])

  useEffect(() => {
    const container = messagesContainerRef.current

    if (!container) {
      return
    }

    if (
      shouldPreserveScrollRef.current &&
      previousScrollHeightRef.current !== null
    ) {
      const scrollDelta =
        container.scrollHeight - previousScrollHeightRef.current

      container.scrollTop = container.scrollTop + scrollDelta
      shouldPreserveScrollRef.current = false
      previousScrollHeightRef.current = null
      return
    }

    if (!hasInitializedScrollRef.current) {
      if (activeConversationId && messagesQuery.isLoading) {
        return
      }

      container.scrollTop = container.scrollHeight
      hasInitializedScrollRef.current = true
      return
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [
    activeConversationId,
    isSending,
    messages.length,
    messagesQuery.isLoading,
  ])

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current

    if (!container) {
      return
    }

    if (
      container.scrollTop <= 80 &&
      messagesQuery.hasNextPage &&
      !messagesQuery.isFetchingNextPage
    ) {
      previousScrollHeightRef.current = container.scrollHeight
      shouldPreserveScrollRef.current = true
      void messagesQuery.fetchNextPage()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSendMessage()
  }

  if (!conversation) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#eef3f8]">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <MessageCircle className="mb-3 size-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            Chon mot hoi thoai
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Noi dung chat se hien thi tai day.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#eef3f8]">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-sky-600 text-white">
              {getInitials(getDisplayName(conversation))}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {getDisplayName(conversation)}
            </p>
            <p className="truncate text-xs text-slate-500">
              {conversation.lead_email ||
                conversation.lead_phone ||
                "Khach hang tu web chat"}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "rounded-full",
            getStatusClassName(conversation.status)
          )}
        >
          {getStatusLabel(conversation.status)}
        </Badge>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6"
      >
        {messagesQuery.isFetchingNextPage ? (
          <div className="flex justify-center">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
              Dang tai them tin nhan cu...
            </div>
          </div>
        ) : null}

        {messagesQuery.isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-[1.5rem] rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              Dang tai lich su chat...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Hoi thoai nay chua co tin nhan.
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {actionError ? (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={messageInput}
            onChange={(event) => onMessageInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Nhap tin nhan..."
            rows={1}
            disabled={conversation.status === "CLOSED" || isSending}
            className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <Button
            type="submit"
            size="icon-lg"
            disabled={
              !messageInput.trim() ||
              conversation.status === "CLOSED" ||
              isSending
            }
            className="rounded-full bg-sky-600 hover:bg-sky-700"
          >
            <Send />
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ChatThread

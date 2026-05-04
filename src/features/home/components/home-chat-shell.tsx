import { useEffect, useRef, useState } from "react"
import {
  Bot,
  Headset,
  Mic,
  Paperclip,
  SendHorizonal,
  Sparkles,
} from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { requestConversationStaffContact } from "@/api/chat-api"
import { Button } from "@/components/ui/button"
import HomeLeadFormDialog from "@/features/home/components/home-lead-form-dialog"
import useChat from "@/hooks/use-chat"
import { formatDateTime } from "@/lib/date"
import type { InitLeadSchema } from "@/schemas/chat-schema"
import useLeadStore from "@/stores/lead-store"
import type { ChatMessage, ChatQueryResponse } from "@/types/chat-type"

type LatestChatLeadState = Pick<
  ChatQueryResponse,
  | "conversation_id"
  | "lead_temperature"
  | "lead_score"
  | "conversation_status"
  | "conversation_staff_id"
>

const HomeChatShell = () => {
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false)
  const [draftMessage, setDraftMessage] = useState("")
  const [pendingQuery, setPendingQuery] = useState("")
  const [chatError, setChatError] = useState<string | null>(null)
  const [staffContactFeedback, setStaffContactFeedback] = useState<{
    conversationId: string
    message: string
  } | null>(null)
  const [leadFollowUpQuestions, setLeadFollowUpQuestions] = useState<string[]>(
    []
  )
  const [latestChatLeadState, setLatestChatLeadState] =
    useState<LatestChatLeadState | null>(null)
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    []
  )

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const previousScrollHeightRef = useRef<number | null>(null)
  const shouldPreserveScrollRef = useRef(false)
  const hasInitializedScrollRef = useRef(false)
  const tempMessageCounterRef = useRef(0)

  const { leadData } = useLeadStore()

  const {
    initLead,
    initLeadPending,
    queryChat,
    queryChatPending,
    conversation,
    conversationPending,
    conversationMessages,
    conversationMessagesPending,
    fetchOlderConversationMessages,
    hasOlderConversationMessages,
    olderConversationMessagesPending,
  } = useChat()

  const flattenedMessages =
    conversationMessages?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.items) ?? []

  const persistedMessageIds = new Set(
    flattenedMessages.map((message) => message.id)
  )

  const displayMessages = [
    ...flattenedMessages,
    ...optimisticMessages.filter(
      (message) => !persistedMessageIds.has(message.id)
    ),
  ]

  const chatPending = queryChatPending
  const activeConversationId =
    conversation?.id ??
    leadData?.conversation_id ??
    latestChatLeadState?.conversation_id ??
    null
  const latestLeadStateMatches =
    Boolean(activeConversationId) &&
    latestChatLeadState?.conversation_id === activeConversationId
  const effectiveLeadTemperature = latestLeadStateMatches
    ? (latestChatLeadState?.lead_temperature ?? conversation?.lead_temperature)
    : conversation?.lead_temperature
  const effectiveConversationStatus = latestLeadStateMatches
    ? (latestChatLeadState?.conversation_status ?? conversation?.status)
    : conversation?.status
  const effectiveConversationStaffId = latestLeadStateMatches
    ? (latestChatLeadState?.conversation_staff_id ?? conversation?.staff_id)
    : conversation?.staff_id
  const canRequestCounselor =
    effectiveLeadTemperature === "HOT" &&
    effectiveConversationStatus === "OPEN" &&
    !effectiveConversationStaffId
  const counselorRequestSent =
    effectiveLeadTemperature === "HOT" &&
    effectiveConversationStatus === "OPEN" &&
    Boolean(effectiveConversationStaffId)
  const scopedStaffContactFeedback =
    staffContactFeedback &&
    staffContactFeedback.conversationId === conversation?.id
      ? staffContactFeedback.message
      : null

  const requestCounselorMutation = useMutation({
    mutationFn: (conversationId: string) =>
      requestConversationStaffContact(conversationId),
    onSuccess: (updatedConversation, conversationId) => {
      setStaffContactFeedback({
        conversationId,
        message:
          "Yêu cầu kết nối với cố vấn đã được gửi. Team sẽ phản hồi sớm.",
      })
      setLatestChatLeadState({
        conversation_id: updatedConversation.id,
        lead_temperature: updatedConversation.lead_temperature,
        lead_score: updatedConversation.lead_score,
        conversation_status: updatedConversation.status,
        conversation_staff_id: updatedConversation.staff_id,
      })
    },
  })

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
      if (leadData?.conversation_id && conversationMessagesPending) {
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
    conversationMessagesPending,
    displayMessages.length,
    leadData?.conversation_id,
    chatPending,
  ])

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current

    if (!container) {
      return
    }

    if (
      container.scrollTop <= 80 &&
      hasOlderConversationMessages &&
      !olderConversationMessagesPending
    ) {
      previousScrollHeightRef.current = container.scrollHeight
      shouldPreserveScrollRef.current = true
      void fetchOlderConversationMessages()
    }
  }

  const createTempMessageIds = () => {
    tempMessageCounterRef.current += 1

    const tempId = tempMessageCounterRef.current

    return {
      userTempId: `local-user-${tempId}`,
      assistantTempId: `local-assistant-${tempId}`,
    }
  }

  const submitChat = async (
    message: string,
    leadId: string,
    conversationId?: string | null
  ) => {
    setChatError(null)
    setLeadFollowUpQuestions([])

    const shouldCreateAssistantPlaceholder = conversation?.status !== "HANDOFF"
    const { userTempId, assistantTempId } = createTempMessageIds()

    setOptimisticMessages((current) => {
      const nextMessages: ChatMessage[] = [
        ...current,
        {
          id: userTempId,
          conversation_id: conversationId ?? "pending",
          role: "USER",
          content: message,
          intent: null,
          is_fallback: false,
          created_at: null,
        },
      ]

      if (shouldCreateAssistantPlaceholder) {
        nextMessages.push({
          id: assistantTempId,
          conversation_id: conversationId ?? "pending",
          role: "ASSISTANT",
          content: "",
          intent: null,
          is_fallback: false,
          created_at: null,
        })
      }

      return nextMessages
    })

    try {
      const response = await queryChat({
        lead_id: leadId,
        conversation_id: conversationId,
        query: message,
      })

      setLatestChatLeadState({
        conversation_id: response.conversation_id,
        lead_temperature: response.lead_temperature,
        lead_score: response.lead_score,
        conversation_status: response.conversation_status,
        conversation_staff_id: response.conversation_staff_id,
      })
      setLeadFollowUpQuestions(response.follow_up_suggestions ?? [])

      setOptimisticMessages((current) =>
        current
          .map((item) => {
            if (item.id === userTempId) {
              return {
                ...item,
                id: response.user_message_id,
                conversation_id: response.conversation_id,
                created_at: response.created_at,
              }
            }

            if (item.id === assistantTempId) {
              if (!response.assistant_message_id) {
                return null
              }

              return {
                ...item,
                id: response.assistant_message_id,
                conversation_id: response.conversation_id,
                content: response.answer,
                intent: response.blocked ? "blocked" : null,
                is_fallback: response.confidence < 0.4,
                created_at: response.created_at,
              }
            }

            return item
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      )
    } catch {
      setChatError("Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.")

      setOptimisticMessages((current) =>
        current.filter(
          (item) => item.id !== userTempId && item.id !== assistantTempId
        )
      )
    }
  }

  const handleSend = async (message = draftMessage) => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || chatPending) {
      return
    }

    if (!leadData?.lead_id) {
      setPendingQuery(trimmedMessage)
      setIsLeadDialogOpen(true)
      return
    }

    setDraftMessage("")
    await submitChat(trimmedMessage, leadData.lead_id, leadData.conversation_id)
  }

  const handleLeadSubmit = async (values: InitLeadSchema) => {
    try {
      const lead = await initLead(values)

      setIsLeadDialogOpen(false)

      if (pendingQuery) {
        const queuedMessage = pendingQuery

        setPendingQuery("")
        setDraftMessage("")
        await submitChat(queuedMessage, lead.lead_id, null)
      }
    } catch {
      setChatError(
        "Không thể tạo lead lúc này. Vui lòng kiểm tra lại thông tin."
      )
    }
  }

  const handleRequestCounselor = async () => {
    const requestConversationId = activeConversationId

    if (!requestConversationId) {
      return
    }

    setChatError(null)

    try {
      await requestCounselorMutation.mutateAsync(requestConversationId)
    } catch {
      setChatError(
        "Không thể gửi yêu cầu kết nối cố vấn lúc này. Vui lòng thử lại sau."
      )
    }
  }

  const getMessageAuthor = (message: ChatMessage) => {
    if (message.role === "USER") {
      return leadData?.full_name || "Bạn"
    }

    if (message.intent === "staff_reply") {
      return conversation?.staff_name || "Tư vấn viên"
    }

    return "VinUni AI"
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_32px_80px_-24px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
        {/* ── Header ── */}
        <div className="relative flex items-center gap-3.5 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          {/* Gold accent line */}
          <div className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-[2rem] bg-linear-to-r from-[#d6ae4e] via-[#e8c96a] to-[#d6ae4e]/30" />

          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <Bot className="h-4.5 w-4.5" />
            {/* Online indicator */}
            <span className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">
              VinUni Admissions Assistant
            </h2>
            <p className="text-xs text-slate-400">Luôn sẵn sàng hỗ trợ</p>
          </div>

          <div className="flex h-7 items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3">
            <Sparkles className="h-3 w-3 text-[#d6ae4e]" />
            <span className="text-[11px] font-medium text-slate-500">AI</span>
          </div>
        </div>

        {/* ── Messages ── */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e2e8f0 transparent",
          }}
        >
          {/* Conversation banner */}
          {leadData?.conversation_id ? (
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80">
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                  <span>
                    {conversationPending
                      ? "Đang tải conversation..."
                      : "Conversation đã lưu"}
                  </span>

                  {conversation?.status ? (
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 normal-case ring-1 ring-slate-200">
                      {conversation.status}
                    </span>
                  ) : null}

                  {typeof conversation?.message_count === "number" ? (
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 normal-case ring-1 ring-slate-200">
                      {conversation.message_count} tin nhắn
                    </span>
                  ) : null}
                </div>
              </div>

              {conversation?.summary ? (
                <p className="px-4 py-3 text-[13px] leading-relaxed text-slate-600">
                  {conversation.summary}
                </p>
              ) : null}

              {counselorRequestSent || scopedStaffContactFeedback ? (
                <div className="m-3 mt-0 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] leading-relaxed text-emerald-700">
                  {scopedStaffContactFeedback ||
                    "Yêu cầu kết nối với cố vấn đã được ghi nhận. Team sẽ phản hồi sớm."}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Welcome message */}
          {!leadData?.conversation_id && !displayMessages.length ? (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[72%]">
                <div className="mb-1.5 flex items-center gap-2 pl-1">
                  <span className="text-[11px] font-semibold text-slate-900">
                    VinUni AI
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sẵn sàng trả lời
                  </span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]">
                  <p className="text-[14px] leading-relaxed text-slate-700">
                    Xin chào! Tôi có thể hỗ trợ thông tin về{" "}
                    <span className="font-medium text-slate-900">
                      tuyển sinh
                    </span>
                    ,{" "}
                    <span className="font-medium text-slate-900">học phí</span>,{" "}
                    <span className="font-medium text-slate-900">học bổng</span>{" "}
                    và{" "}
                    <span className="font-medium text-slate-900">
                      quy trình nộp hồ sơ
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Message list */}
          {displayMessages.map((message) => {
            const isAssistant = message.role === "ASSISTANT"
            const isStaffReply = message.intent === "staff_reply"

            return (
              <div
                key={message.id}
                className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[72%] ${isAssistant ? "" : ""}`}
                >
                  {/* Author + time */}
                  <div
                    className={`mb-1.5 flex items-center gap-2 ${isAssistant ? "pl-1" : "justify-end pr-1"}`}
                  >
                    <span
                      className={`text-[11px] font-semibold ${isAssistant ? "text-slate-900" : "text-slate-500"}`}
                    >
                      {getMessageAuthor(message)}
                    </span>
                    {message.created_at ? (
                      <span className="text-[11px] text-slate-400">
                        {formatDateTime(message.created_at)}
                      </span>
                    ) : null}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed ${
                      isAssistant
                        ? isStaffReply
                          ? "rounded-2xl rounded-tl-sm border border-emerald-200/80 bg-emerald-50 text-emerald-900 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.08)]"
                          : "rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white text-slate-700 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]"
                        : "rounded-2xl rounded-tr-sm bg-slate-950 text-white shadow-[0_4px_12px_-4px_rgba(15,23,42,0.3)]"
                    }`}
                  >
                    {message.content ||
                      (isAssistant ? (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
                          </span>
                          Đang suy nghĩ
                        </span>
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Loading states */}
          {olderConversationMessagesPending ? (
            <div className="flex justify-center">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
                Đang tải thêm tin nhắn cũ...
              </div>
            </div>
          ) : null}

          {conversationMessagesPending ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-400 shadow-sm">
                Đang tải lịch sử chat...
              </div>
            </div>
          ) : null}

          {/* Follow-up suggestions */}
          {leadFollowUpQuestions.length ? (
            <div className="rounded-xl border border-[#d6ae4e]/20 bg-[#fdf9ef] px-3 py-2.5">
              <div className="space-y-1.5">
                {leadFollowUpQuestions.map((question, index) => (
                  <div
                    key={question}
                    className="rounded-lg bg-white px-3 py-1.5 text-[12px] leading-snug text-slate-600 ring-1 ring-slate-200/80"
                  >
                    <span className="mr-2 font-semibold text-[#d6ae4e]">
                      {index + 1}.
                    </span>
                    {question}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ── */}
        <div className="border-t border-slate-100 bg-white/95 px-4 py-4 sm:px-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_-6px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,255,255,0.9)_inset] transition-shadow focus-within:border-slate-300 focus-within:shadow-[0_6px_20px_-6px_rgba(15,23,42,0.14)]">
            <textarea
              rows={2}
              value={draftMessage}
              placeholder="Nhập câu hỏi của bạn tại đây..."
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
              className="w-full resize-none border-0 bg-transparent px-4 pt-3 pb-2 text-[14px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
            />

            <div className="flex flex-col gap-2 border-t border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              {/* Left actions */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <Mic className="h-3.5 w-3.5" />
                </Button>
                <span className="hidden text-[11px] text-slate-400 sm:block">
                  Enter để gửi · Shift+Enter xuống dòng
                </span>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                {canRequestCounselor ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 cursor-pointer rounded-xl border-amber-200 bg-amber-50 px-3 text-[12px] font-medium text-amber-800 hover:bg-amber-100"
                    disabled={requestCounselorMutation.isPending}
                    onClick={() => {
                      void handleRequestCounselor()
                    }}
                  >
                    <Headset className="h-3.5 w-3.5" />
                    {requestCounselorMutation.isPending
                      ? "Đang gửi..."
                      : "Chat với cố vấn"}
                  </Button>
                ) : null}

                <Button
                  type="button"
                  size="sm"
                  className="h-8 cursor-pointer rounded-xl bg-slate-950 px-4 text-[12px] font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  disabled={chatPending || initLeadPending}
                  onClick={() => {
                    void handleSend()
                  }}
                >
                  {chatPending ? "Đang gửi..." : "Gửi"}
                  <SendHorizonal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {chatError ? (
            <p className="mt-2 px-1 text-[12px] text-red-500">{chatError}</p>
          ) : null}
        </div>
      </div>

      <HomeLeadFormDialog
        open={isLeadDialogOpen}
        onOpenChange={setIsLeadDialogOpen}
        onSubmit={handleLeadSubmit}
        isSubmitting={initLeadPending}
      />
    </>
  )
}

export default HomeChatShell

import { useEffect, useRef, useState } from "react"
import { Bot, Headset, Mic, Paperclip, SendHorizonal } from "lucide-react"
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
        message: "Yeu cau ket noi voi co van da duoc gui. Team se phan hoi som.",
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

    const shouldCreateAssistantPlaceholder =
      conversation?.status !== "HANDOFF"
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
      setChatError("Khong the gui tin nhan luc nay. Vui long thu lai sau.")

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
        "Khong the tao lead luc nay. Vui long kiem tra lai thong tin."
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
        "Khong the gui yeu cau ket noi co van luc nay. Vui long thu lai sau."
      )
    }
  }

  const getMessageAuthor = (message: ChatMessage) => {
    if (message.role === "USER") {
      return leadData?.full_name || "Ban"
    }

    if (message.intent === "staff_reply") {
      return conversation?.staff_name || "Tu van vien"
    }

    return "VinUni AI"
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white/90 px-5 py-4 sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              VinUni Admissions Assistant
            </h2>

            <div className="flex items-center gap-2">
              <p className="size-2.5 rounded-full bg-green-500" />
              <span className="text-sm text-slate-500">online</span>
            </div>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6"
        >
          {leadData?.conversation_id ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                <span>
                  {conversationPending
                    ? "Dang tai conversation..."
                    : "Conversation da luu"}
                </span>

                {conversation?.status ? (
                  <span className="rounded-full bg-white px-2 py-1 text-slate-600 normal-case">
                    {conversation.status}
                  </span>
                ) : null}

                {typeof conversation?.message_count === "number" ? (
                  <span className="rounded-full bg-white px-2 py-1 text-slate-600 normal-case">
                    {conversation.message_count} messages
                  </span>
                ) : null}
              </div>

              {conversation?.summary ? (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {conversation.summary}
                </p>
              ) : null}

              {counselorRequestSent || scopedStaffContactFeedback ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm leading-6 text-emerald-800">
                  {scopedStaffContactFeedback ||
                    "Yeu cau ket noi voi co van da duoc ghi nhan. Team se phan hoi som."}
                </div>
              ) : null}
            </div>
          ) : null}

          {displayMessages.map((message) => {
            const isAssistant = message.role === "ASSISTANT"
            const isStaffReply = message.intent === "staff_reply"

            return (
              <div
                key={message.id}
                className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 shadow-sm sm:max-w-[75%] ${
                    isAssistant
                      ? isStaffReply
                        ? "rounded-bl-md border border-emerald-200 bg-emerald-50 text-slate-800"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                      : "rounded-br-md bg-slate-950 text-white"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    <span
                      className={
                        isAssistant
                          ? "font-semibold text-slate-900"
                          : "font-semibold text-white/90"
                      }
                    >
                      {getMessageAuthor(message)}
                    </span>

                    {message.created_at ? (
                      <span
                        className={
                          isAssistant ? "text-slate-400" : "text-white/60"
                        }
                      >
                        {formatDateTime(message.created_at)}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm leading-6">
                    {message.content || (isAssistant ? "Dang suy nghi..." : "")}
                  </p>
                </div>
              </div>
            )
          })}

          {!leadData?.conversation_id && !displayMessages.length ? (
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-[1.5rem] rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm sm:max-w-[75%]">
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-900">
                    VinUni AI
                  </span>
                  <span className="text-slate-400">San sang tra loi</span>
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  Xin chao, toi co the ho tro thong tin tuyen sinh, hoc phi, hoc
                  bong va quy trinh nop ho so.
                </p>
              </div>
            </div>
          ) : null}

          {olderConversationMessagesPending ? (
            <div className="flex justify-center">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
                Dang tai them tin nhan cu...
              </div>
            </div>
          ) : null}

          {conversationMessagesPending ? (
            <div className="flex justify-start">
              <div className="rounded-[1.5rem] rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                Dang tai lich su chat...
              </div>
            </div>
          ) : null}

          {leadFollowUpQuestions.length ? (
            <div className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1.5">
              <div className="space-y-1">
                {leadFollowUpQuestions.map((question, index) => (
                  <div
                    key={question}
                    className="rounded-md bg-white/80 px-2 py-1 text-[11px] leading-4 text-slate-600"
                  >
                    <span className="mr-1.5 font-semibold text-primary">
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

        <div className="border-t border-slate-200 bg-white px-5 py-5 sm:px-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.4)]">
            <textarea
              rows={1}
              value={draftMessage}
              placeholder="Nhap cau hoi cua ban tai day..."
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
              className="w-full resize-none border-0 bg-transparent px-1 py-1 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
            />

            <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <p className="text-xs text-slate-400">
                  Chua co `lead_id` se mo form, co roi se goi API chat.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {canRequestCounselor ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full cursor-pointer rounded-full border-amber-300 bg-amber-50 px-5 text-amber-900 hover:bg-amber-100 sm:w-auto"
                    disabled={requestCounselorMutation.isPending}
                    onClick={() => {
                      void handleRequestCounselor()
                    }}
                  >
                    <Headset className="h-4 w-4" />
                    {requestCounselorMutation.isPending
                      ? "Dang gui..."
                      : "Chat voi co van"}
                  </Button>
                ) : null}

                <Button
                  type="button"
                  size="lg"
                  className="w-full cursor-pointer rounded-full px-5 sm:w-auto"
                  disabled={chatPending || initLeadPending}
                  onClick={() => {
                    void handleSend()
                  }}
                >
                  {chatPending ? "Dang gui..." : "Gui tin nhan"}
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {chatError ? (
              <p className="mt-3 text-sm text-destructive">{chatError}</p>
            ) : null}
          </div>
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

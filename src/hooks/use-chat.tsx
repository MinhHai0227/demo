import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import {
  getConversation,
  getConversationMessages,
  initLead,
  queryChat,
} from "@/api/chat-api"
import useRealtime from "@/hooks/use-realtime"
import useLeadStore from "@/stores/lead-store"
import type {
  ChatConversation,
  ChatQueryResponse,
  ChatQueryRequest,
  LeadInitRequest,
} from "@/types/chat-type"

const useChat = () => {
  const { setLeadData, updateLeadData, leadData } = useLeadStore()
  const queryClient = useQueryClient()
  const conversationId = leadData?.conversation_id ?? null
  useRealtime({
    enabled: Boolean(conversationId),
    conversationId,
  })

  const initLeadMutation = useMutation({
    mutationFn: (data: LeadInitRequest) => initLead(data),
    onSuccess: (data) => {
      setLeadData({
        lead_id: data.lead_id,
        full_name: data.full_name,
        conversation_id: null,
      })
    },
  })

  const chatQueryMutation = useMutation({
    mutationFn: (data: ChatQueryRequest) => queryChat(data),
    onSuccess: (data) => {
      updateLeadData({
        conversation_id: data.conversation_id,
      })
      syncConversationLeadState(queryClient, data)
    },
  })

  const conversationQuery = useQuery<ChatConversation>({
    queryKey: ["chat-conversation", conversationId],
    queryFn: () => getConversation(conversationId as string),
    enabled: Boolean(conversationId),
  })

  const conversationMessagesInfiniteQuery = useInfiniteQuery({
    queryKey: ["chat-conversation-messages", conversationId],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getConversationMessages(conversationId as string, {
        before: pageParam,
        limit: 10,
      }),
    enabled: Boolean(conversationId),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_before ?? undefined,
  })

  return {
    initLead: initLeadMutation.mutateAsync,
    initLeadPending: initLeadMutation.isPending,

    queryChat: chatQueryMutation.mutateAsync,
    queryChatPending: chatQueryMutation.isPending,

    conversation: conversationQuery.data,
    conversationPending: conversationQuery.isLoading,
    conversationError: conversationQuery.error,
    refetchConversation: conversationQuery.refetch,

    conversationMessages: conversationMessagesInfiniteQuery.data,
    conversationMessagesPending: conversationMessagesInfiniteQuery.isLoading,
    conversationMessagesError: conversationMessagesInfiniteQuery.error,
    refetchConversationMessages: conversationMessagesInfiniteQuery.refetch,
    fetchOlderConversationMessages:
      conversationMessagesInfiniteQuery.fetchNextPage,
    hasOlderConversationMessages: conversationMessagesInfiniteQuery.hasNextPage,
    olderConversationMessagesPending:
      conversationMessagesInfiniteQuery.isFetchingNextPage,
  }
}

const syncConversationLeadState = (
  queryClient: QueryClient,
  data: ChatQueryResponse
) => {
  queryClient.setQueryData<ChatConversation>(
    ["chat-conversation", data.conversation_id],
    (conversation) =>
      conversation
        ? {
            ...conversation,
            lead_temperature:
              data.lead_temperature ?? conversation.lead_temperature,
            lead_score: data.lead_score ?? conversation.lead_score,
            status: data.conversation_status ?? conversation.status,
            staff_id: data.conversation_staff_id ?? conversation.staff_id,
          }
        : conversation
  )
}

export default useChat

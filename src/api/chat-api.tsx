import axios from "@/lib/axios"
import type {
  ChatConversation,
  ChatConversationListParams,
  ChatConversationStatus,
  ChatConversationsPage,
  ChatMessage,
  ChatMessagesPage,
  ChatQueryRequest,
  ChatQueryResponse,
  LeadInitRequest,
  LeadInitResponse,
  MessageSources,
} from "@/types/chat-type"

const initLead = async (data: LeadInitRequest): Promise<LeadInitResponse> => {
  return await axios.post("chat/init-lead", data)
}

const queryChat = async (
  data: ChatQueryRequest
): Promise<ChatQueryResponse> => {
  return await axios.post("chat/query", data)
}

const getConversations = async (
  params?: ChatConversationListParams
): Promise<ChatConversationsPage> => {
  return await axios.get("chat/conversations", { params })
}

const getConversation = async (
  conversationId: string
): Promise<ChatConversation> => {
  return await axios.get(`chat/conversations/${conversationId}`)
}

const updateConversationStatus = async (
  conversationId: string,
  status: ChatConversationStatus
): Promise<ChatConversation> => {
  return await axios.patch(`chat/conversations/${conversationId}/status`, {
    status,
  })
}

const createStaffMessage = async (
  conversationId: string,
  content: string
): Promise<ChatMessage> => {
  return await axios.post(
    `chat/conversations/${conversationId}/staff-messages`,
    {
      content,
    }
  )
}

const requestConversationStaffContact = async (
  conversationId: string
): Promise<ChatConversation> => {
  return await axios.post(
    `chat/conversations/${conversationId}/contact-staff-request`
  )
}

const getConversationMessages = async (
  conversationId: string,
  params?: {
    before?: string | null
    limit?: number
  }
): Promise<ChatMessagesPage> => {
  return await axios.get(`chat/conversations/${conversationId}/messages`, {
    params,
  })
}

const getMessageSources = async (messageId: string): Promise<MessageSources> => {
  return await axios.get(`chat/messages/${messageId}/sources`)
}

export {
  initLead,
  queryChat,
  getConversations,
  getConversation,
  updateConversationStatus,
  createStaffMessage,
  requestConversationStaffContact,
  getConversationMessages,
  getMessageSources,
}

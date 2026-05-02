import type {
  ChatConversation,
  ChatConversationStatus,
} from "@/types/chat-type"

const statusOptions: Array<{
  label: string
  value: ChatConversationStatus | "ALL"
}> = [
  { label: "Tat ca", value: "ALL" },
  { label: "Dang mo", value: "OPEN" },
  { label: "Can staff", value: "HANDOFF" },
  { label: "Da dong", value: "CLOSED" },
]

const getInitials = (name?: string | null) => {
  if (!name) {
    return "NA"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const getDisplayName = (conversation?: ChatConversation | null) =>
  conversation?.lead_full_name || "Khach hang moi"

const getStatusLabel = (status?: string | null) => {
  if (status === "HANDOFF") return "Can staff"
  if (status === "CLOSED") return "Da dong"
  return "Dang mo"
}

const getStatusClassName = (status?: string | null) => {
  if (status === "HANDOFF") return "border-amber-200 bg-amber-50 text-amber-700"
  if (status === "CLOSED") return "border-slate-200 bg-slate-100 text-slate-600"
  return "border-emerald-200 bg-emerald-50 text-emerald-700"
}

const formatTime = (value?: string | null) => {
  if (!value) {
    return "--"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "--"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

export {
  formatTime,
  getDisplayName,
  getErrorMessage,
  getInitials,
  getStatusClassName,
  getStatusLabel,
  statusOptions,
}

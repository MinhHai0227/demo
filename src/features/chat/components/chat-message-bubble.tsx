import { formatTime } from "@/features/chat/chat-utils"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/types/chat-type"

type ChatMessageBubbleProps = {
  message: ChatMessage
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === "USER"
  const isSystem = message.role === "SYSTEM"

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-slate-500 shadow-sm">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex", isUser ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[88%] rounded-[1.5rem] px-4 py-3 shadow-sm sm:max-w-[75%]",
          isUser
            ? "rounded-bl-md border border-slate-200 bg-white text-slate-700"
            : "rounded-br-md bg-sky-600 text-white"
        )}
      >
        <div className="max-h-72 overflow-y-auto pr-1">
          <p className="text-sm leading-6 break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        <p
          className={cn(
            "mt-2 text-right text-[11px]",
            isUser ? "text-slate-400" : "text-sky-100"
          )}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}

export default ChatMessageBubble

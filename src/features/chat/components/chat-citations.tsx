import type { ChatCitation } from "@/types/chat-type"
import { cn } from "@/lib/utils"

type ChatCitationsProps = {
  citations?: ChatCitation[]
  tone?: "light" | "dark"
}

const ChatCitations = ({
  citations = [],
  tone = "light",
}: ChatCitationsProps) => {
  if (!citations.length) {
    return null
  }

  return (
    <div
      className={cn(
        "mt-3 border-t pt-3",
        tone === "dark" ? "border-white/10" : "border-slate-200/80"
      )}
    >
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <a
            key={citation.url}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            title={citation.url}
            className={cn(
              "max-w-full rounded-full border px-2.5 py-1 text-[11px] transition hover:-translate-y-0.5",
              "overflow-hidden text-ellipsis whitespace-nowrap",
              tone === "dark"
                ? "border-white/15 bg-white/8 text-white/90 hover:bg-white/14"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            )}
          >
            {citation.url}
          </a>
        ))}
      </div>
    </div>
  )
}

export default ChatCitations

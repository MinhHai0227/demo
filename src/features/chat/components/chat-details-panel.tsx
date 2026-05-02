import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { getDisplayName, getInitials } from "@/features/chat/chat-utils"
import { formatDateTime } from "@/lib/date"
import type {
  ChatConversation,
  ChatConversationStatus,
} from "@/types/chat-type"
import {
  CheckCircle2,
  Circle,
  Clock3,
  FileSearch,
  Mail,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react"
import { type ComponentType, useState } from "react"

type ChatDetailsPanelProps = {
  conversation: ChatConversation | null
  onOpenLead: () => void
  onStatusChange: (status: ChatConversationStatus) => void | Promise<void>
}

const ChatDetailsPanel = ({
  conversation,
  onOpenLead,
  onStatusChange,
}: ChatDetailsPanelProps) => {
  const [confirmStatus, setConfirmStatus] =
    useState<ChatConversationStatus | null>(null)

  return (
    <>
      <aside className="hidden h-full min-h-0 flex-col overflow-hidden border-l border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">
            Thong tin hoi thoai
          </p>
        </div>

        {conversation ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-16">
                <AvatarFallback className="bg-sky-600 text-lg text-white">
                  {getInitials(getDisplayName(conversation))}
                </AvatarFallback>
              </Avatar>
              <p className="mt-3 text-sm font-semibold text-slate-950">
                {getDisplayName(conversation)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Lead ID: {conversation.lead_id.slice(0, 8)}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={onOpenLead}
              >
                <FileSearch />
                Mo lead details
              </Button>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <InfoRow
                icon={Mail}
                label="Email"
                value={conversation.lead_email || "--"}
              />
              <InfoRow
                icon={Phone}
                label="Dien thoai"
                value={conversation.lead_phone || "--"}
              />
              <InfoRow
                icon={UserRound}
                label="Staff"
                value={conversation.staff_name || "Chua gan"}
              />
              <InfoRow
                icon={Clock3}
                label="Cap nhat"
                value={formatDateTime(conversation.updated_at)}
              />
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                Trang thai
              </p>
              <div className="grid gap-2">
                <StatusButton
                  label="Dang mo"
                  icon={Circle}
                  isActive={conversation.status === "OPEN"}
                  onClick={() => setConfirmStatus("OPEN")}
                />
                <StatusButton
                  label="Can staff"
                  icon={MessageCircle}
                  isActive={conversation.status === "HANDOFF"}
                  onClick={() => setConfirmStatus("HANDOFF")}
                />
                <StatusButton
                  label="Da dong"
                  icon={CheckCircle2}
                  isActive={conversation.status === "CLOSED"}
                  onClick={() => setConfirmStatus("CLOSED")}
                />
              </div>
            </div>

            {conversation.summary ? (
              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                  Tom tat
                </p>
                <p className="text-sm leading-6 text-slate-700">
                  {conversation.summary}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-500">
            Chua chon hoi thoai.
          </div>
        )}
      </aside>

      <AlertDialog
        open={Boolean(confirmStatus)}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmStatus(null)
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xac nhan doi trang thai</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmStatus
                ? `Ban co chac muon doi trang thai hoi thoai sang "${confirmStatus}" khong?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmStatus) {
                  void onStatusChange(confirmStatus)
                }
                setConfirmStatus(null)
              }}
            >
              Xac nhan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) => (
  <div className="flex gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" />
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm break-words text-slate-800">{value}</p>
    </div>
  </div>
)

const StatusButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string
  icon: ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "outline"}
    className="justify-start"
    onClick={onClick}
  >
    <Icon />
    {label}
  </Button>
)

export default ChatDetailsPanel

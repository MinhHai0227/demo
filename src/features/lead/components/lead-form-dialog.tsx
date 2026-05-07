import { FileSearch, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LeadDetailPanel from "@/features/lead/components/lead-detail-panel"
import type {
  Lead,
  LeadApplication,
  LeadInterest,
  UpdateLeadPayload,
} from "@/types/lead-type"

type LeadFormDialogProps = {
  open: boolean
  lead?: Lead | null
  leadPending?: boolean
  leadFetching?: boolean
  interests?: LeadInterest[]
  interestsPending?: boolean
  applications?: LeadApplication[]
  applicationsPending?: boolean
  savePending?: boolean
  errorMessage?: string | null
  onOpenChange: (open: boolean) => void
  onSave: (values: UpdateLeadPayload) => Promise<void> | void
}

const LeadFormDialog = ({
  open,
  lead,
  leadPending = false,
  leadFetching = false,
  interests = [],
  interestsPending = false,
  applications = [],
  applicationsPending = false,
  savePending = false,
  errorMessage,
  onOpenChange,
  onSave,
}: LeadFormDialogProps) => {
  const { t } = useTranslation("leads")
  const { t: tc } = useTranslation("common")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-1.5rem)] max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl ring-1 ring-slate-100 sm:max-w-6xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10">
              <FileSearch className="size-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-semibold text-slate-950">
                {lead?.full_name || t("detailTitle")}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-slate-500">
                {t("detailDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto bg-slate-50/40 px-6 py-5">
          <LeadDetailPanel
            key={lead ? `${lead.id}-${lead.updated_at ?? ""}` : "lead-empty"}
            lead={lead}
            leadPending={leadPending}
            leadFetching={leadFetching}
            interests={interests}
            interestsPending={interestsPending}
            applications={applications}
            applicationsPending={applicationsPending}
            savePending={savePending}
            errorMessage={errorMessage}
            onSave={onSave}
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 bg-white text-sm text-slate-600 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-950"
            disabled={savePending}
            onClick={() => onOpenChange(false)}
          >
            {tc("close")}
          </Button>
          {savePending && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
              <Loader2 className="size-3.5 animate-spin" />
              {t("savingChanges")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LeadFormDialog

import { FileSearch, Loader2 } from "lucide-react"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-6xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileSearch className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {lead?.full_name || "Lead details"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Review profile, status, interests, and applications for this lead.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-6 py-5">
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

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-sm text-slate-600"
            disabled={savePending}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {savePending && (
            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="size-3.5 animate-spin" />
              Saving changes...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LeadFormDialog

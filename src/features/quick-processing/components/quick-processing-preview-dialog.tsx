import { FileText, Loader2, Save, SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  admissionCategoryOptions,
  type AdmissionCategory,
} from "@/types/knowledge-chunk-type"
import type { OcrJob } from "@/types/ocr-type"

type QuickProcessingPreviewDialogProps = {
  open: boolean
  job: OcrJob | null
  content: string
  draftContent: string
  category: AdmissionCategory
  chunkSize: string
  chunkOverlap: string
  errorMessage?: string | null
  isLoading?: boolean
  isSaving?: boolean
  isSending?: boolean
  onOpenChange: (open: boolean) => void
  onDraftContentChange: (value: string) => void
  onCategoryChange: (value: AdmissionCategory) => void
  onChunkSizeChange: (value: string) => void
  onChunkOverlapChange: (value: string) => void
  onSave: () => void
  onSendToKb: () => void
}

const QuickProcessingPreviewDialog = ({
  open,
  job,
  content,
  draftContent,
  category,
  chunkSize,
  chunkOverlap,
  errorMessage,
  isLoading = false,
  isSaving = false,
  isSending = false,
  onOpenChange,
  onDraftContentChange,
  onCategoryChange,
  onChunkSizeChange,
  onChunkOverlapChange,
  onSave,
  onSendToKb,
}: QuickProcessingPreviewDialogProps) => {
  const isDirty = draftContent !== content
  const isSent = Boolean(job?.sent_to_kb)
  const canSave = Boolean(draftContent.trim()) && isDirty && !isSent
  const canSend = Boolean(draftContent.trim()) && !isDirty && !isSent

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-semibold text-slate-900">
                {job?.title || job?.original_filename || "OCR preview"}
              </DialogTitle>
              <DialogDescription className="truncate text-xs text-slate-500">
                Review and edit markdown before creating knowledge chunks.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <FieldGroup className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem_8rem]">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Category
                </FieldLabel>
                <FieldContent>
                  <Select value={category} onValueChange={onCategoryChange}>
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm shadow-none">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {admissionCategoryOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Chunk size
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={100}
                    max={5000}
                    value={chunkSize}
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) => onChunkSizeChange(event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Overlap
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={0}
                    max={500}
                    value={chunkOverlap}
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) =>
                      onChunkOverlapChange(event.target.value)
                    }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>

          <div className="min-h-0 px-6 py-4">
            {isLoading ? (
              <div className="flex h-[min(46vh,420px)] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading markdown...
              </div>
            ) : (
              <textarea
                value={draftContent}
                spellCheck={false}
                disabled={isSent}
                className="h-[min(46vh,420px)] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 shadow-none outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                onChange={(event) =>
                  onDraftContentChange(event.target.value)
                }
              />
            )}

            {errorMessage && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            {isSent
              ? "This OCR job has already been sent to the knowledge base."
              : isDirty
                ? "Save markdown changes before sending to KB."
                : "Markdown is ready to send."}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-sm text-slate-600"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-sm text-slate-700"
              disabled={!canSave || isSaving}
              onClick={onSave}
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save markdown
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl text-sm"
              disabled={!canSend || isSending}
              onClick={onSendToKb}
            >
              {isSending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <SendHorizontal className="size-3.5" />
              )}
              Send to KB
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuickProcessingPreviewDialog

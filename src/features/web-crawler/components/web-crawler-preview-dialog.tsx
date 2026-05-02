import { ExternalLink, FileText, Loader2, Save, SendHorizontal } from "lucide-react"

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
import type { CrawlPageJob } from "@/types/crawl-type"
import {
  admissionCategoryOptions,
  type AdmissionCategory,
} from "@/types/knowledge-chunk-type"

type WebCrawlerPreviewDialogProps = {
  open: boolean
  pageJob: CrawlPageJob | null
  content: string
  draftContent: string
  title: string
  category: AdmissionCategory
  year: string
  versionStart: string
  chunkSize: string
  chunkOverlap: string
  errorMessage?: string | null
  isLoading?: boolean
  isSaving?: boolean
  isSending?: boolean
  onOpenChange: (open: boolean) => void
  onDraftContentChange: (value: string) => void
  onTitleChange: (value: string) => void
  onCategoryChange: (value: AdmissionCategory) => void
  onYearChange: (value: string) => void
  onVersionStartChange: (value: string) => void
  onChunkSizeChange: (value: string) => void
  onChunkOverlapChange: (value: string) => void
  onSave: () => void
  onSendToKb: () => void
}

const WebCrawlerPreviewDialog = ({
  open,
  pageJob,
  content,
  draftContent,
  title,
  category,
  year,
  versionStart,
  chunkSize,
  chunkOverlap,
  errorMessage,
  isLoading = false,
  isSaving = false,
  isSending = false,
  onOpenChange,
  onDraftContentChange,
  onTitleChange,
  onCategoryChange,
  onYearChange,
  onVersionStartChange,
  onChunkSizeChange,
  onChunkOverlapChange,
  onSave,
  onSendToKb,
}: WebCrawlerPreviewDialogProps) => {
  const isDirty = draftContent !== content
  const isSent = Boolean(pageJob?.sent_to_kb)
  const canSave = Boolean(draftContent.trim()) && isDirty && !isSent
  const canSend =
    Boolean(draftContent.trim()) && Boolean(title.trim()) && !isDirty && !isSent

  const displayTitle =
    pageJob?.title ||
    pageJob?.detected_title ||
    pageJob?.suggested_metadata?.title ||
    "Crawled page preview"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-6xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate text-base font-semibold text-slate-900">
                {displayTitle}
              </DialogTitle>
              <DialogDescription className="truncate text-xs text-slate-500">
                Edit markdown, then choose final metadata before sending this
                page to Knowledge Base.
              </DialogDescription>
              {pageJob?.source_url && (
                <a
                  href={pageJob.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex max-w-full items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="size-3" />
                  <span className="truncate">{pageJob.source_url}</span>
                </a>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_7rem_7rem_7rem_7rem]">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  KB title
                </FieldLabel>
                <FieldContent>
                  <Input
                    value={title}
                    disabled={isSent}
                    placeholder="Final title for Knowledge Base"
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) => onTitleChange(event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Category
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={category}
                    disabled={isSent}
                    onValueChange={onCategoryChange}
                  >
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
                  Year
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={2000}
                    value={year}
                    disabled={isSent}
                    placeholder="Optional"
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) => onYearChange(event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Version
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={1}
                    value={versionStart}
                    disabled={isSent}
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none"
                    onChange={(event) =>
                      onVersionStartChange(event.target.value)
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Chunk
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={100}
                    max={5000}
                    value={chunkSize}
                    disabled={isSent}
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
                    disabled={isSent}
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
              <div className="flex h-[min(50vh,460px)] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading markdown...
              </div>
            ) : (
              <textarea
                value={draftContent}
                spellCheck={false}
                disabled={isSent}
                className="h-[min(50vh,460px)] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 shadow-none outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
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
              ? "This page has already been sent to the knowledge base."
              : isDirty
                ? "Save markdown changes before sending to KB."
                : "Markdown is saved and ready to send."}
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

export default WebCrawlerPreviewDialog

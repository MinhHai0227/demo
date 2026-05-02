import { useState } from "react"
import { FileText, FileUp, Hash, Loader2, Tags } from "lucide-react"

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
import type { CreateOcrJobPayload, OcrJob } from "@/types/ocr-type"

type QuickProcessingUploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateOcrJobPayload) => Promise<OcrJob>
  isSubmitting?: boolean
}

const getFileTitle = (fileName: string) => fileName.replace(/\.[^.]+$/, "")

const QuickProcessingUploadDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: QuickProcessingUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<AdmissionCategory>("FAQ")
  const [year, setYear] = useState("")
  const [versionStart, setVersionStart] = useState("1")
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setFile(null)
    setTitle("")
    setCategory("FAQ")
    setYear("")
    setVersionStart("1")
    setError(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    setError(null)

    if (!file) {
      setError("Please choose a PDF or image file.")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title.")
      return
    }

    try {
      await onSubmit({
        file,
        title: title.trim(),
        category,
        year: year ? Number(year) : undefined,
        version_start: versionStart ? Number(versionStart) : 1,
      })
      handleOpenChange(false)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Upload failed. Please try again."
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileUp className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                Upload OCR document
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Parse a PDF or image into editable markdown before sending it
                to the knowledge base.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-5">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel
                htmlFor="ocr-upload-file"
                className="text-xs font-medium text-slate-600"
              >
                File
              </FieldLabel>
              <FieldContent>
                <input
                  id="ocr-upload-file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-slate-700"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] ?? null
                    setFile(selectedFile)
                    if (selectedFile && !title.trim()) {
                      setTitle(getFileTitle(selectedFile.name))
                    }
                  }}
                />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="ocr-upload-title"
                  className="text-xs font-medium text-slate-600"
                >
                  <FileText className="size-3.5 text-slate-400" />
                  Title
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="ocr-upload-title"
                    value={title}
                    placeholder="Document title"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Tags className="size-3.5 text-slate-400" />
                  Category
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as AdmissionCategory)
                    }
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
                      <SelectValue placeholder="Select a category" />
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Hash className="size-3.5 text-slate-400" />
                  Year
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    value={year}
                    placeholder="2026"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    onChange={(e) => setYear(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Hash className="size-3.5 text-slate-400" />
                  Version
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={1}
                    value={versionStart}
                    placeholder="1"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    onChange={(e) => setVersionStart(e.target.value)}
                  />
                </FieldContent>
              </Field>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}
          </FieldGroup>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-sm text-slate-600"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-xl text-sm"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <FileUp className="size-3.5" /> Upload and OCR
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuickProcessingUploadDialog

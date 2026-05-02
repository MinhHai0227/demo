import { useState } from "react"
import { FileUp, Hash, Loader2, Tags, FileText, Layers3 } from "lucide-react"

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
  FieldDescription,
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
  type KnowledgeChunkUploadResponse,
  type UploadKnowledgeChunkFilePayload,
} from "@/types/knowledge-chunk-type"

type KnowledgeChunkUploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    payload: UploadKnowledgeChunkFilePayload
  ) => Promise<KnowledgeChunkUploadResponse>
  isSubmitting?: boolean
}

const KnowledgeChunkUploadDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: KnowledgeChunkUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<AdmissionCategory>("FAQ")
  const [majorId, setMajorId] = useState("")
  const [year, setYear] = useState("")
  const [versionStart, setVersionStart] = useState("1")
  const [chunkSize, setChunkSize] = useState("1200")
  const [chunkOverlap, setChunkOverlap] = useState("100")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<KnowledgeChunkUploadResponse | null>(
    null
  )

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFile(null)
      setTitle("")
      setCategory("FAQ")
      setMajorId("")
      setYear("")
      setVersionStart("1")
      setChunkSize("1200")
      setChunkOverlap("100")
      setError(null)
      setResult(null)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    setError(null)
    setResult(null)

    if (!file) {
      setError("Please choose a file to upload.")
      return
    }

    try {
      const response = await onSubmit({
        file,
        title: title.trim() || undefined,
        category,
        major_id: majorId.trim() || undefined,
        year: year ? Number(year) : undefined,
        version_start: versionStart ? Number(versionStart) : undefined,
        chunk_size: chunkSize ? Number(chunkSize) : undefined,
        chunk_overlap: chunkOverlap ? Number(chunkOverlap) : undefined,
      })
      setResult(response)
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
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileUp className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                Upload knowledge file
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Upload a source file and split it into multiple knowledge
                chunks.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">
          <FieldGroup className="gap-4">
            {/* File picker */}
            <Field>
              <FieldLabel
                htmlFor="knowledge-upload-file"
                className="text-xs font-medium text-slate-600"
              >
                File
              </FieldLabel>
              <FieldContent>
                <input
                  id="knowledge-upload-file"
                  type="file"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-slate-700"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </FieldContent>
            </Field>

            {/* Category + Title */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Tags className="size-3.5 text-slate-400" />
                  Category
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as AdmissionCategory)}
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

              <Field>
                <FieldLabel
                  htmlFor="knowledge-upload-title"
                  className="text-xs font-medium text-slate-600"
                >
                  <FileText className="size-3.5 text-slate-400" />
                  Title
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-upload-title"
                    value={title}
                    placeholder="Optional title override"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FieldContent>
              </Field>
            </div>

            {/* Numeric fields */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Year",
                  value: year,
                  setter: setYear,
                  placeholder: "2026",
                },
                {
                  label: "Version start",
                  value: versionStart,
                  setter: setVersionStart,
                  placeholder: "1",
                },
                {
                  label: "Chunk size",
                  value: chunkSize,
                  setter: setChunkSize,
                  placeholder: "1200",
                },
                {
                  label: "Chunk overlap",
                  value: chunkOverlap,
                  setter: setChunkOverlap,
                  placeholder: "200",
                },
              ].map(({ label, value, setter, placeholder }) => (
                <Field key={label}>
                  <FieldLabel className="text-xs font-medium text-slate-600">
                    <Hash className="size-3.5 text-slate-400" />
                    {label}
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      value={value}
                      placeholder={placeholder}
                      className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                      onChange={(e) => setter(e.target.value)}
                    />
                  </FieldContent>
                </Field>
              ))}
            </div>

            {/* Major ID */}
            <Field>
              <FieldLabel
                htmlFor="knowledge-upload-major-id"
                className="text-xs font-medium text-slate-600"
              >
                <Layers3 className="size-3.5 text-slate-400" />
                Major ID
              </FieldLabel>
              <FieldContent>
                <Input
                  id="knowledge-upload-major-id"
                  value={majorId}
                  placeholder="Optional major UUID"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 font-mono text-sm shadow-none"
                  onChange={(e) => setMajorId(e.target.value)}
                />
                <FieldDescription className="text-[11px] text-slate-400">
                  Leave blank when the file content is shared across majors.
                </FieldDescription>
              </FieldContent>
            </Field>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {result && (
              <div className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="border-b border-emerald-200 px-4 py-2.5">
                  <p className="truncate text-xs font-semibold text-emerald-800">
                    {result.file_name}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 px-4 py-3">
                  {[
                    { label: "Total chunks", value: result.total_chunks },
                    { label: "Embedded", value: result.embedded_chunks },
                    { label: "Failed", value: result.failed_embedding_chunks },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] tracking-wider text-emerald-600 uppercase">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-emerald-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FieldGroup>
        </div>

        {/* Footer */}
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
                <FileUp className="size-3.5" /> Upload file
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default KnowledgeChunkUploadDialog

import { zodResolver } from "@hookform/resolvers/zod"
import {
  FileText,
  Hash,
  Layers3,
  Link2,
  Loader2,
  ScanSearch,
  Tags,
} from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

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
  FieldError,
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
  knowledgeChunkFormSchema,
  type KnowledgeChunkFormInput,
  type KnowledgeChunkFormValues,
} from "@/schemas/knowledge-chunk-schema"
import {
  admissionCategoryOptions,
  type KnowledgeChunk,
} from "@/types/knowledge-chunk-type"

type KnowledgeChunkFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  chunk?: KnowledgeChunk | null
  errorMessage?: string | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: KnowledgeChunkFormValues) => void | Promise<void>
}

const textareaClassName =
  "min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"

const defaultValues: KnowledgeChunkFormInput = {
  major_id: "",
  category: "FAQ",
  title: "",
  content: "",
  year: undefined,
  source: "",
  source_url: "",
  version: 1,
}

const KnowledgeChunkFormDialog = ({
  open,
  mode,
  chunk,
  errorMessage,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: KnowledgeChunkFormDialogProps) => {
  const form = useForm<
    KnowledgeChunkFormInput,
    unknown,
    KnowledgeChunkFormValues
  >({
    resolver: zodResolver(knowledgeChunkFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      return
    }
    form.reset({
      major_id: chunk?.major_id ?? "",
      category: chunk?.category ?? "FAQ",
      title: chunk?.title ?? "",
      content: chunk?.content ?? "",
      year: chunk?.year ?? undefined,
      source: chunk?.source ?? "",
      source_url: chunk?.source_url ?? "",
      version: chunk?.version ?? 1,
    })
  }, [chunk, form, open])

  const isCreate = mode === "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ScanSearch className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {isCreate ? "New knowledge chunk" : "Edit knowledge chunk"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Manage structured content for admissions retrieval.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form
          noValidate
          className="overflow-y-auto px-6 py-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-4">
            {/* Category + Title */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Tags className="size-3.5 text-slate-400" />
                  Category
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                    )}
                  />
                  <FieldError errors={[form.formState.errors.category]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="knowledge-title"
                  className="text-xs font-medium text-slate-600"
                >
                  <FileText className="size-3.5 text-slate-400" />
                  Title
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-title"
                    placeholder="Scholarship policy 2026"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("title")}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    Optional but useful for search results.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.title]} />
                </FieldContent>
              </Field>
            </div>

            {/* Content */}
            <Field>
              <FieldLabel
                htmlFor="knowledge-content"
                className="text-xs font-medium text-slate-600"
              >
                <ScanSearch className="size-3.5 text-slate-400" />
                Content
              </FieldLabel>
              <FieldContent>
                <textarea
                  id="knowledge-content"
                  placeholder="Enter the knowledge chunk content here..."
                  className={textareaClassName}
                  {...form.register("content")}
                />
                <FieldError errors={[form.formState.errors.content]} />
              </FieldContent>
            </Field>

            {/* Source + Source URL + Year + Version */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field>
                <FieldLabel
                  htmlFor="knowledge-source"
                  className="text-xs font-medium text-slate-600"
                >
                  <Layers3 className="size-3.5 text-slate-400" />
                  Source
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-source"
                    placeholder="admissions-handbook.pdf"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("source")}
                  />
                  <FieldError errors={[form.formState.errors.source]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="knowledge-source-url"
                  className="text-xs font-medium text-slate-600"
                >
                  <Link2 className="size-3.5 text-slate-400" />
                  Source URL
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-source-url"
                    placeholder="https://..."
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("source_url")}
                  />
                  <FieldError errors={[form.formState.errors.source_url]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="knowledge-year"
                  className="text-xs font-medium text-slate-600"
                >
                  <Hash className="size-3.5 text-slate-400" />
                  Year
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-year"
                    type="number"
                    placeholder="2026"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("year")}
                  />
                  <FieldError errors={[form.formState.errors.year]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="knowledge-version"
                  className="text-xs font-medium text-slate-600"
                >
                  <Hash className="size-3.5 text-slate-400" />
                  Version
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="knowledge-version"
                    type="number"
                    min={1}
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("version")}
                  />
                  <FieldError errors={[form.formState.errors.version]} />
                </FieldContent>
              </Field>
            </div>

            {/* Major ID */}
            <Field>
              <FieldLabel
                htmlFor="knowledge-major-id"
                className="text-xs font-medium text-slate-600"
              >
                Major ID
              </FieldLabel>
              <FieldContent>
                <Input
                  id="knowledge-major-id"
                  placeholder="Optional UUID"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 font-mono text-sm shadow-none"
                  {...form.register("major_id")}
                />
                <FieldDescription className="text-[11px] text-slate-400">
                  Leave blank when the chunk applies broadly.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.major_id]} />
              </FieldContent>
            </Field>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {errorMessage}
              </div>
            )}
          </FieldGroup>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-slate-600"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl"
              disabled={form.formState.isSubmitting || isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              {isCreate
                ? isSubmitting
                  ? "Creating..."
                  : "Create chunk"
                : isSubmitting
                  ? "Saving..."
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default KnowledgeChunkFormDialog

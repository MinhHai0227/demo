import { zodResolver } from "@hookform/resolvers/zod"
import {
  BookType,
  GraduationCap,
  Hash,
  Loader2,
  NotebookPen,
  TimerReset,
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
  majorFormSchema,
  type MajorFormInput,
  type MajorFormValues,
} from "@/schemas/major-schema"
import { majorTypeOptions, type Major } from "@/types/major-type"

type MajorFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  major?: Major | null
  errorMessage?: string | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: MajorFormValues) => void | Promise<void>
}

const textareaClassName =
  "min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"

const defaultValues: MajorFormInput = {
  code: "",
  name: "",
  description: "",
  credits: undefined,
  duration: undefined,
  degree_type: "",
  major_type: "UNDERGRAD_MAJOR",
}

const MajorFormDialog = ({
  open,
  mode,
  major,
  errorMessage,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: MajorFormDialogProps) => {
  const form = useForm<MajorFormInput, unknown, MajorFormValues>({
    resolver: zodResolver(majorFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      return
    }

    form.reset({
      code: major?.code ?? "",
      name: major?.name ?? "",
      description: major?.description ?? "",
      credits: major?.credits ?? undefined,
      duration: major?.duration ?? undefined,
      degree_type: major?.degree_type ?? "",
      major_type: major?.major_type ?? "UNDERGRAD_MAJOR",
    })
  }, [form, major, open])

  const isCreate = mode === "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {isCreate ? "New major" : "Edit major"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Manage academic program metadata for admissions flows.
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
            {/* Code + Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="major-code"
                  className="text-xs font-medium text-slate-600"
                >
                  <Hash className="size-3.5 text-slate-400" />
                  Code
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="major-code"
                    placeholder="CS"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("code")}
                  />
                  <FieldError errors={[form.formState.errors.code]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="major-name"
                  className="text-xs font-medium text-slate-600"
                >
                  <GraduationCap className="size-3.5 text-slate-400" />
                  Name
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="major-name"
                    placeholder="Computer Science"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>
            </div>

            {/* Major type + Degree type + Credits + Duration */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field>
                <FieldLabel
                  htmlFor="major-type"
                  className="text-xs font-medium text-slate-600"
                >
                  <BookType className="size-3.5 text-slate-400" />
                  Major type
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="major_type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="major-type"
                          className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                        >
                          <SelectValue placeholder="Select a major type" />
                        </SelectTrigger>
                        <SelectContent>
                          {majorTypeOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.major_type]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="major-degree-type"
                  className="text-xs font-medium text-slate-600"
                >
                  <NotebookPen className="size-3.5 text-slate-400" />
                  Degree type
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="major-degree-type"
                    placeholder="Bachelor"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("degree_type")}
                  />
                  <FieldError errors={[form.formState.errors.degree_type]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="major-credits"
                  className="text-xs font-medium text-slate-600"
                >
                  <Hash className="size-3.5 text-slate-400" />
                  Credits
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="major-credits"
                    type="number"
                    placeholder="120"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("credits")}
                  />
                  <FieldError errors={[form.formState.errors.credits]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="major-duration"
                  className="text-xs font-medium text-slate-600"
                >
                  <TimerReset className="size-3.5 text-slate-400" />
                  Duration
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="major-duration"
                    type="number"
                    placeholder="4"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("duration")}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    Number of years.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.duration]} />
                </FieldContent>
              </Field>
            </div>

            {/* Description */}
            <Field>
              <FieldLabel
                htmlFor="major-description"
                className="text-xs font-medium text-slate-600"
              >
                <NotebookPen className="size-3.5 text-slate-400" />
                Description
              </FieldLabel>
              <FieldContent>
                <textarea
                  id="major-description"
                  placeholder="Describe the program, learning outcomes, and scope..."
                  className={textareaClassName}
                  {...form.register("description")}
                />
                <FieldError errors={[form.formState.errors.description]} />
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
                  : "Create major"
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

export default MajorFormDialog

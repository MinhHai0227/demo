import { zodResolver } from "@hookform/resolvers/zod"
import {
  Calendar,
  CreditCard,
  DollarSign,
  GraduationCap,
  Loader2,
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
  tuitionPolicyFormSchema,
  type TuitionPolicyFormInput,
  type TuitionPolicyFormValues,
} from "@/schemas/tuition-policy-schema"
import type { Major } from "@/types/major-type"
import { feeTypeOptions, type TuitionPolicy } from "@/types/tuition-policy-type"

type TuitionPolicyFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  policy?: TuitionPolicy | null
  majorOptions: Major[]
  majorOptionsPending?: boolean
  errorMessage?: string | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TuitionPolicyFormValues) => void | Promise<void>
}

const defaultValues: TuitionPolicyFormInput = {
  major_id: "",
  year: new Date().getFullYear(),
  fee_type: "YEAR",
  base_fee: 0,
}

const TuitionPolicyFormDialog = ({
  open,
  mode,
  policy,
  majorOptions,
  majorOptionsPending = false,
  errorMessage,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: TuitionPolicyFormDialogProps) => {
  const form = useForm<
    TuitionPolicyFormInput,
    unknown,
    TuitionPolicyFormValues
  >({
    resolver: zodResolver(tuitionPolicyFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      return
    }

    form.reset({
      major_id: policy?.major_id ?? "",
      year: policy?.year ?? new Date().getFullYear(),
      fee_type: policy?.fee_type ?? "YEAR",
      base_fee: policy?.base_fee ?? 0,
    })
  }, [form, open, policy])

  const isCreate = mode === "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <CreditCard className="size-4" />
            </div>

            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {isCreate ? "New tuition policy" : "Edit tuition policy"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Configure tuition fee rules for each major and academic year.
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
            {/* Major + Year */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <GraduationCap className="size-3.5 text-slate-400" />
                  Major
                </FieldLabel>

                <FieldContent>
                  <Controller
                    control={form.control}
                    name="major_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          majorOptionsPending || majorOptions.length === 0
                        }
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
                          <SelectValue placeholder="Select a major" />
                        </SelectTrigger>

                        <SelectContent>
                          {majorOptions.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.code} - {major.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FieldDescription className="text-[11px] text-slate-400">
                    {majorOptions.length === 0
                      ? "Create a major first before adding tuition policies."
                      : "Choose the academic program this policy applies to."}
                  </FieldDescription>

                  <FieldError errors={[form.formState.errors.major_id]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <Calendar className="size-3.5 text-slate-400" />
                  Year
                </FieldLabel>

                <FieldContent>
                  <Input
                    type="number"
                    placeholder="2026"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("year")}
                  />

                  <FieldError errors={[form.formState.errors.year]} />
                </FieldContent>
              </Field>
            </div>

            {/* Fee type + Base fee */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <CreditCard className="size-3.5 text-slate-400" />
                  Fee type
                </FieldLabel>

                <FieldContent>
                  <Controller
                    control={form.control}
                    name="fee_type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
                          <SelectValue placeholder="Select a fee type" />
                        </SelectTrigger>

                        <SelectContent>
                          {feeTypeOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FieldError errors={[form.formState.errors.fee_type]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <DollarSign className="size-3.5 text-slate-400" />
                  Base fee
                </FieldLabel>

                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="12000"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("base_fee")}
                  />

                  <FieldError errors={[form.formState.errors.base_fee]} />
                </FieldContent>
              </Field>
            </div>

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
              disabled={
                form.formState.isSubmitting ||
                isSubmitting ||
                majorOptionsPending ||
                majorOptions.length === 0
              }
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              {isCreate
                ? isSubmitting
                  ? "Creating..."
                  : "Create policy"
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

export default TuitionPolicyFormDialog

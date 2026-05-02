import { zodResolver } from "@hookform/resolvers/zod"
import {
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
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
import { staffFormSchema, type StaffFormValues } from "@/schemas/staff-schema"
import type { Staff } from "@/types/staff-type"

type StaffFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  staff?: Staff | null
  errorMessage?: string | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: StaffFormValues) => void | Promise<void>
}

const StaffFormDialog = ({
  open,
  mode,
  staff,
  errorMessage,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: StaffFormDialogProps) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: { name: "", email: "", password: "", role: "COUNSELOR" },
  })

  useEffect(() => {
    if (!open) {
      form.reset({ name: "", email: "", password: "", role: "COUNSELOR" })
      return
    }
    form.reset({
      name: staff?.name ?? "",
      email: staff?.email ?? "",
      password: "",
      role: staff?.role ?? "COUNSELOR",
    })
  }, [form, open, staff])

  const handleSubmit = async (values: StaffFormValues) => {
    const nextPassword = values.password.trim()
    if (mode === "create" && !nextPassword) {
      form.setError("password", {
        message: "Password is required for a new staff account",
      })
      return
    }
    await onSubmit({
      ...values,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: nextPassword,
    })
  }

  const isCreate = mode === "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 sm:max-w-xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <UserRound className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                {isCreate ? "New staff account" : "Edit staff account"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isCreate
                  ? "Add a new admin or counselor to the team."
                  : "Update info, role, or password."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form
          noValidate
          className="px-6 py-5"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="staff-name"
                  className="text-xs font-medium text-slate-600"
                >
                  <UserRound className="size-3.5 text-slate-400" />
                  Full name
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-name"
                    placeholder="Nguyen Van A"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="staff-email"
                  className="text-xs font-medium text-slate-600"
                >
                  <Mail className="size-3.5 text-slate-400" />
                  Email
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="staff@vinuni.edu.vn"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="staff-password"
                  className="text-xs font-medium text-slate-600"
                >
                  <LockKeyhole className="size-3.5 text-slate-400" />
                  Password
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-password"
                    type="password"
                    placeholder={
                      isCreate
                        ? "Min. 6 characters"
                        : "Leave blank to keep current"
                    }
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none"
                    {...form.register("password")}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    {isCreate
                      ? "Required for new accounts."
                      : "Only fill to replace the password."}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.password]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-medium text-slate-600">
                  <ShieldCheck className="size-3.5 text-slate-400" />
                  Role
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="COUNSELOR">Counselor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    Admin has full access. Counselor handles operations.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.role]} />
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
              disabled={form.formState.isSubmitting || isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              {isCreate
                ? isSubmitting
                  ? "Creating..."
                  : "Create staff"
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

export default StaffFormDialog

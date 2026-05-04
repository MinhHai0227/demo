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
        message: "Mật khẩu là bắt buộc khi tạo tài khoản mới",
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
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-0 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.18)] sm:max-w-xl">
        {/* Gold accent bar */}
        <div className="h-0.75 bg-linear-to-r from-[#d6ae4e] via-[#e8c96a] to-[#d6ae4e]/30" />

        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <UserRound className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-[15px] font-semibold text-slate-900">
                {isCreate
                  ? "Tạo tài khoản nhân viên"
                  : "Chỉnh sửa tài khoản nhân viên"}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-slate-500">
                {isCreate
                  ? "Thêm admin hoặc counselor mới vào hệ thống."
                  : "Cập nhật thông tin, vai trò hoặc mật khẩu."}
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
                  className="text-[12px] font-medium text-slate-600"
                >
                  <UserRound className="size-3.5 text-slate-400" />
                  Họ và tên
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-name"
                    placeholder="Nguyễn Văn A"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus-visible:ring-0"
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="staff-email"
                  className="text-[12px] font-medium text-slate-600"
                >
                  <Mail className="size-3.5 text-slate-400" />
                  Email
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="nhanvien@vinuni.edu.vn"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus-visible:ring-0"
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
                  className="text-[12px] font-medium text-slate-600"
                >
                  <LockKeyhole className="size-3.5 text-slate-400" />
                  Mật khẩu
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="staff-password"
                    type="password"
                    placeholder={
                      isCreate ? "Tối thiểu 6 ký tự" : "Để trống nếu không đổi"
                    }
                    className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus-visible:ring-0"
                    {...form.register("password")}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    {isCreate
                      ? "Bắt buộc khi tạo tài khoản mới."
                      : "Chỉ điền nếu muốn thay đổi mật khẩu."}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.password]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-[12px] font-medium text-slate-600">
                  <ShieldCheck className="size-3.5 text-slate-400" />
                  Vai trò
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
                        <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80 text-[13px] shadow-none focus:border-slate-300 focus:ring-0">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="COUNSELOR">Counselor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldDescription className="text-[11px] text-slate-400">
                    Admin có toàn quyền. Counselor phụ trách vận hành.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.role]} />
                </FieldContent>
              </Field>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-[12px] text-red-600">
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
              className="h-9 rounded-xl border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-xl bg-slate-950 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800"
              disabled={form.formState.isSubmitting || isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              {isCreate
                ? isSubmitting
                  ? "Đang tạo..."
                  : "Tạo tài khoản"
                : isSubmitting
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StaffFormDialog

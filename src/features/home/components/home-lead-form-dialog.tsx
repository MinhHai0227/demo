import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { initLeadSchema, type InitLeadSchema } from "@/schemas/chat-schema"

type HomeLeadFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: InitLeadSchema) => void | Promise<void>
  isSubmitting?: boolean
}

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/50"

const HomeLeadFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: HomeLeadFormDialogProps) => {
  
  const form = useForm<InitLeadSchema>({
    resolver: zodResolver(initLeadSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [form, open])

  const contactError =
    form.formState.errors.email?.message ??
    form.formState.errors.phone?.message ??
    (form.formState.errors as Record<string, { message?: string }>)[""]?.message

  const handleSubmit = async (values: InitLeadSchema) => {
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-slate-950">
            Hoan tat thong tin truoc khi bat dau chat
          </DialogTitle>
          <DialogDescription className="max-w-xl text-sm leading-6 text-slate-600">
            Theo flow backend, client se goi `POST /chat/init-lead` truoc neu local
            store chua co `lead_id`. Sau do moi tiep tuc `POST /chat/query`.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="px-6 py-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="lead-full-name">Ho va ten</FieldLabel>
              <FieldContent>
                <input
                  id="lead-full-name"
                  className={inputClassName}
                  placeholder="Nguyen Van A"
                  {...form.register("full_name")}
                />
                <FieldDescription>
                  Truong bat buoc. Se duoc gui len backend khi khoi tao lead.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.full_name]} />
              </FieldContent>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="lead-email">Email</FieldLabel>
                <FieldContent>
                  <input
                    id="lead-email"
                    type="email"
                    className={inputClassName}
                    placeholder="ban@email.com"
                    {...form.register("email")}
                  />
                  <FieldDescription>
                    Co the bo trong neu da co so dien thoai.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.email]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="lead-phone">So dien thoai</FieldLabel>
                <FieldContent>
                  <input
                    id="lead-phone"
                    className={inputClassName}
                    placeholder="0901 234 567"
                    {...form.register("phone")}
                  />
                  <FieldDescription>
                    Co the bo trong neu da co email hop le.
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.phone]} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldContent>
                <FieldDescription>
                  Can it nhat mot cach lien he: email hoac so dien thoai.
                </FieldDescription>
                <FieldError>{contactError}</FieldError>
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Dong
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Dang tao lead..." : "Tiep tuc vao chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default HomeLeadFormDialog

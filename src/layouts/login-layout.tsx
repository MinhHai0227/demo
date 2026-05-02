import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, LockKeyhole, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useNavigate } from "react-router-dom"

import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import useAuth from "@/hooks/use-auth"
import { loginSchema, type LoginSchema } from "@/schemas/auth-schema"

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/50"

const LoginLayout = () => {
  const navigate = useNavigate()
  const { accessToken, user, login, loginPending, loginError } = useAuth()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  if (accessToken && user) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (values: LoginSchema) => {
    await login(values)
    navigate("/admin", { replace: true })
  }

  const errorMessage =
    (loginError as { response?: { data?: { detail?: string } } } | null)
      ?.response?.data?.detail ?? null

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(214,174,78,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#ffffff_48%,_#f8fafc_100%)]">
      <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,_rgba(214,174,78,0.12),_transparent)]" />
      <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-slate-200/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
          <div className="hidden max-w-2xl space-y-8 lg:block">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lai trang chu
            </Link>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4" />
                Khu vuc quan tri noi bo
              </div>

              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950">
                Dang nhap de quan ly lead va hoi thoai admissions.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                He thong nay danh cho admin va counselor. Access token duoc giu
                trong memory, con refresh token se duoc backend luu trong cookie
                httpOnly.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.24em] text-[#d6ae4e] uppercase">
                  Session
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  JWT
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Su dung access token tren frontend va refresh cookie tu
                  backend.
                </p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.24em] text-[#d6ae4e] uppercase">
                  Role
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  Staff
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Ho tro cho doi counselor va admin theo payload backend tra ve.
                </p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.24em] text-[#d6ae4e] uppercase">
                  Store
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  Memory
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Session duoc khoi phuc lai sau F5 bang refresh-token tu
                  backend.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="shrink-0">
                <img
                  className="h-12 w-auto"
                  src={logo}
                  alt="VinUni AI Admissions"
                />
              </Link>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Dang nhap quan tri
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Su dung email va mat khau duoc cap de truy cap khu vuc noi bo.
              </p>
            </div>

            <form
              noValidate
              className="mt-8 space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <FieldContent>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      className={inputClassName}
                      placeholder="admin@vinuni.edu.vn"
                      {...form.register("email")}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="login-password">Mat khau</FieldLabel>
                  <FieldContent>
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      className={inputClassName}
                      placeholder="Nhap mat khau"
                      {...form.register("password")}
                    />
                    <FieldError errors={[form.formState.errors.password]} />
                  </FieldContent>
                </Field>
              </FieldGroup>

              {errorMessage ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full cursor-pointer rounded-xl text-sm font-semibold"
                disabled={loginPending}
              >
                {loginPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {loginPending ? "Dang dang nhap..." : "Dang nhap"}
              </Button>
            </form>

            <div className="mt-6 block lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lai trang chu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginLayout

import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
})

export type LoginSchema = z.infer<typeof loginSchema>

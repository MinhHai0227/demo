type StaffLoginRequest = {
  email: string
  password: string
}

type AuthUser = {
  sub: string
  name: string
  email: string
  role: string
}

type StaffLoginResponse = {
  access_token: string
  user: AuthUser
}

export type { StaffLoginRequest, AuthUser, StaffLoginResponse }

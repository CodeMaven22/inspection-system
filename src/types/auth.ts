export type UserRole = "admin" | "inspector" | "worker" | "team_leader"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}

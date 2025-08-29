// Represents the JWT tokens from SimpleJWT
export interface AuthTokens {
  access: string
  refresh: string
}

// Represents the user model from your backend
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "inspector" | "worker" | "client" | "team_leader"
  profile_picture?: string | null
  bio?: string | null
  phone_number?: string | null
  location?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string
  company?: string
  date_joined: string
}

// Login credentials sent to the backend
export interface LoginCredentials {
  email: string
  password: string
}

// AuthContext value type
export interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

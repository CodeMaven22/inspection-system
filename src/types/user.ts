// types/user.ts
export interface UserUpdate {
  id?: number
  first_name: string
  last_name: string
  email: string
  role: "admin" | "inspector" | "worker" | "team_leader" | "client"
  address?: string
  city?: string
  state?: string
  profile_picture?: string | null
  phone_number?: string
  location?: string
  bio?: string
}

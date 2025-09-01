// "use client"

// import React, { createContext, useState, useContext, useEffect, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import { toast } from "sonner"
// import type { User, AuthTokens, LoginCredentials } from "@/types/auth"

// interface AuthContextType {
//   user: User | null
//   tokens: AuthTokens | null
//   isLoading: boolean
//   login: (credentials: LoginCredentials) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [tokens, setTokens] = useState<AuthTokens | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   // Load tokens/user from localStorage on mount
//   useEffect(() => {
//     const storedTokens = localStorage.getItem("auth_tokens")
//     const storedUser = localStorage.getItem("auth_user")
//     if (storedTokens && storedUser) {
//       try {
//         setTokens(JSON.parse(storedTokens))
//         setUser(JSON.parse(storedUser))
//       } catch {
//         logout()
//       }
//     }
//     setIsLoading(false)
//   }, [])

//   // --- Login
//   const login = useCallback(
//     async (credentials: LoginCredentials) => {
//       setIsLoading(true)
//       try {
//         const response = await axios.post("http://127.0.0.1:8000/api/core/login/", credentials)
//         const data = response.data

//         // Save user and tokens
//         setUser(data.user)
//         setTokens({ access: data.access, refresh: data.refresh })
//         localStorage.setItem("auth_user", JSON.stringify(data.user))
//         localStorage.setItem("auth_tokens", JSON.stringify({ access: data.access, refresh: data.refresh }))

//         // Redirect based on role
//         switch (data.user.role) {
//           case "admin":
//             router.push("/admin/dashboard")
//             break
//           case "inspector":
//             router.push("/inspector/dashboard")
//             break
//           case "team_leader":
//             router.push("/team-leader/dashboard")
//             break
//           case "worker":
//             router.push("/client/dashboard")
//             break
//           default:
//             router.push("/login")
//         }
//       } catch (error: any) {
//         throw new Error(error.response?.data?.error || "Invalid email or password")
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [router]
//   )

//   // --- Logout
//   const logout = useCallback(() => {
//     setUser(null)
//     setTokens(null)
//     localStorage.removeItem("auth_user")
//     localStorage.removeItem("auth_tokens")
//     toast.success("You have been logged out")
//     router.push("/login")
//   }, [router])

//   // --- Refresh Token
//   const refreshToken = useCallback(async () => {
//     if (!tokens?.refresh) return logout()

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/core/token/refresh/", {
//         refresh: tokens.refresh,
//       })

//       const newAccess = response.data.access

//       // update state + localStorage
//       const updatedTokens = { ...tokens, access: newAccess }
//       setTokens(updatedTokens)
//       localStorage.setItem("auth_tokens", JSON.stringify(updatedTokens))

//       return newAccess
//     } catch (error) {
//       console.error("Refresh token failed", error)
//       logout()
//     }
//   }, [tokens, logout])

//   // --- Axios Interceptor for auto-refresh
//   useEffect(() => {
//     const requestInterceptor = axios.interceptors.request.use(
//       async (config) => {
//         if (!tokens?.access) return config

//         // Decode JWT expiry (exp is in seconds)
//         const tokenParts = JSON.parse(atob(tokens.access.split(".")[1]))
//         const now = Math.floor(Date.now() / 1000)

//         if (tokenParts.exp - now < 30) {
//           // If token is expired or about to expire, refresh
//           const newAccess = await refreshToken()
//           if (newAccess) {
//             config.headers.Authorization = `Bearer ${newAccess}`
//           }
//         } else {
//           config.headers.Authorization = `Bearer ${tokens.access}`
//         }

//         return config
//       },
//       (error) => Promise.reject(error)
//     )

//     return () => {
//       axios.interceptors.request.eject(requestInterceptor)
//     }
//   }, [tokens, refreshToken])

//   return (
//     <AuthContext.Provider value={{ user, tokens, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) throw new Error("useAuth must be used within an AuthProvider")
//   return context
// }

"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import type { AuthContextType, User, AuthTokens, LoginCredentials } from "@/types/auth"


// --- Define role-based dashboard routes
const ROLE_ROUTES: Record<User["role"], string> = {
  admin: "/admin/dashboard",
  inspector: "/inspector/dashboard",
  team_leader: "/team-leader/dashboard",
  worker: "/client/dashboard",
  client: "/client/dashboard", // if needed
}

// --- Axios instance
const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" })

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // --- Load user and tokens from localStorage
  useEffect(() => {
    const storedTokens = localStorage.getItem("auth_tokens")
    const storedUser = localStorage.getItem("auth_user")
    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens))
        setUser(JSON.parse(storedUser))
      } catch {
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  // --- Logout function
  const logout = useCallback(() => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_tokens")
    toast.success("You have been logged out")
    router.push("/login")
  }, [router])

  // --- Refresh token
  const refreshToken = useCallback(async () => {
    if (!tokens?.refresh) return logout()
    try {
      const response = await api.post("/core/token/refresh/", { refresh: tokens.refresh })
      const newTokens = { ...tokens, access: response.data.access }
      setTokens(newTokens)
      localStorage.setItem("auth_tokens", JSON.stringify(newTokens))
      return response.data.access
    } catch {
      logout()
    }
  }, [tokens, logout])

  // --- Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      try {
        const response = await api.post("/core/token/", credentials)
        const data = response.data

        setUser(data.user)
        setTokens({ access: data.access, refresh: data.refresh })
        localStorage.setItem("auth_user", JSON.stringify(data.user))
        localStorage.setItem("auth_tokens", JSON.stringify({ access: data.access, refresh: data.refresh }))

        // Redirect based on role
        router.push(ROLE_ROUTES[data.user.role as User["role"]] || "/login")
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Invalid credentials")
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  // --- Axios interceptor for auto-refresh
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      if (!tokens?.access) return config

      const tokenPayload = JSON.parse(atob(tokens.access.split(".")[1]))
      const now = Math.floor(Date.now() / 1000)

      if (tokenPayload.exp - now < 30) {
        const newAccess = await refreshToken()
        if (newAccess && config.headers) config.headers.Authorization = `Bearer ${newAccess}`
      } else if (config.headers) {
        config.headers.Authorization = `Bearer ${tokens.access}`
      }

      return config
    })

    return () => api.interceptors.request.eject(requestInterceptor)
  }, [tokens, refreshToken])

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- Hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthTokens, LoginCredentials } from "@/types/auth"

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Mock user data
  const mockUsers: Record<string, { user: User; tokens: AuthTokens }> = {
    "admin@demo.com": {
      user: { id: "1", email: "admin@demo.com", first_name: "Admin", last_name: "User", role: "admin" },
      tokens: { access: "admin-access-token", refresh: "admin-refresh-token" },
    },
    "worker@demo.com": {
      user: { id: "2", email: "worker@demo.com", first_name: "Worker", last_name: "User", role: "worker" },
      tokens: { access: "worker-access-token", refresh: "worker-refresh-token" },
    },
    "inspector@demo.com": {
      user: { id: "3", email: "inspector@demo.com", first_name: "Inspector", last_name: "User", role: "inspector" },
      tokens: { access: "inspector-access-token", refresh: "inspector-refresh-token" },
    },
    "teamleader@demo.com": {
      user: { id: "4", email: "teamleader@demo.com", first_name: "Team", last_name: "Leader", role: "team_leader" },
      tokens: { access: "teamleader-access-token", refresh: "teamleader-refresh-token" },
    },
  }

  useEffect(() => {
    // Check for stored tokens on mount
    const storedTokens = localStorage.getItem("auth_tokens")
    const storedUser = localStorage.getItem("auth_user")

    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens)
        const parsedUser = JSON.parse(storedUser)
        setTokens(parsedTokens)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored auth data:", error)
        logout() // Clear invalid data
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const foundMockUser = mockUsers[credentials.email]
          if (foundMockUser && credentials.password === "admin123") {
            setUser(foundMockUser.user)
            setTokens(foundMockUser.tokens)
            localStorage.setItem("auth_tokens", JSON.stringify(foundMockUser.tokens))
            localStorage.setItem("auth_user", JSON.stringify(foundMockUser.user))

            // Redirect logic
            switch (foundMockUser.user.role) {
              case "admin":
                router.push("/admin/dashboard")
                break
              case "inspector":
                router.push("/inspector/dashboard")
                break
              case "team_leader":
                router.push("/team-leader/dashboard")
                break
              case "worker":
                router.push("/client/dashboard")
                break
              default:
                router.push("/login") // fallback
            }
              resolve()
        } else {
          reject(new Error("Invalid email or password"))
        }

            setIsLoading(false)
          }, 500)
      })
    },
    [router]
  )

  const logout = useCallback(() => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem("auth_tokens")
    localStorage.removeItem("auth_user")
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

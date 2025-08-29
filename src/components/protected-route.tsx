"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import type { UserRole } from "@/types/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) {
      // Still loading, do nothing yet
      return
    }

    if (!user) {
      // Not authenticated, redirect to login
      router.push("/login")
      return
    }

    if (requiredRole) {
      const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!rolesArray.includes(user.role)) {
        // User does not have the required role, redirect based on their actual role
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (user.role === "worker") {
          router.push("/client/dashboard")
        } else if (user.role === "inspector") {
          router.push("/inspector/dashboard")
        } else {
          // Fallback for unknown roles
          router.push("/login")
        }
      }
    }
  }, [user, isLoading, requiredRole, router])

  if (
    isLoading ||
    !user ||
    (requiredRole && !(Array.isArray(requiredRole) ? requiredRole : [requiredRole]).includes(user.role))
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return <>{children}</>
}

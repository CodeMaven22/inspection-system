"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

// Hook to protect pages based on role
export function useRoleGuard(allowedRoles: string[]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in
        router.push("/login")
      } else if (!allowedRoles.includes(user.role)) {
        // Logged in but unauthorized
        router.push("/unauthorized") // You can create a simple unauthorized page
      }
    }
  }, [user, isLoading, allowedRoles, router])
}

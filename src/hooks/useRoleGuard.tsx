"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import type { User } from "@/types/auth"

// Hook to protect pages based on role
export function useRoleGuard(allowedRoles: User["role"][]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in
        router.push("/login")
      } else if (!allowedRoles.includes(user.role)) {
        // Logged in but unauthorized
        router.push("/unauthorized")
      }
    }
  }, [user, isLoading, allowedRoles, router])
}
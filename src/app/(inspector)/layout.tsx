"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="inspector">
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

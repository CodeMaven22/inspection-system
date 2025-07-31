"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <ProtectedRoute requiredRole={["admin", "inspector", "team_leader"]}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

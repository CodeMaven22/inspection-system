"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AppSidebar({ isMobileOpen = false, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const SidebarNavItem = ({
    href,
    icon,
    label,
    active,
  }: {
    href: string
    icon: React.ReactNode
    label: string
    active?: boolean
  }) => (
    <Link
      href={href}
      onClick={onMobileClose}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-green-600 text-white"
          : "text-green-700 hover:bg-green-600 hover:text-white"
      )}
    >
      <div
        className={cn(
          "text-green-600 group-hover:text-white transition-colors",
          active && "text-white"
        )}
      >
        {icon}
      </div>
      {!collapsed && <span>{label}</span>}
    </Link>
  )

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onMobileClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 h-full flex flex-col border-r bg-white p-4 transition-all duration-300 md:static md:z-auto",
          collapsed ? "w-20" : "w-64",
          isMobileOpen
            ? "left-0 top-0 translate-x-0 shadow-lg md:translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Collapse Button */}
        <div className="mb-6 hidden justify-end md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-primary"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {user?.role === "worker" && (
            <>
              <SidebarNavItem
                href="/client/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="My Dashboard"
                active={pathname === "/client/dashboard"}
              />
              <SidebarNavItem
                href="/client/inspections"
                icon={<ClipboardCheck className="h-5 w-5" />}
                label="My Inspections"
                active={pathname.startsWith("/client/inspections")}
              />
              <SidebarNavItem
                href="/client/inspections/new"
                icon={<PlusCircle className="h-5 w-5" />}
                label="Request Inspection"
                active={pathname === "/client/inspections/new"}
              />
            </>
          )}
          {(user?.role === "admin" || user?.role === "team_leader" || user?.role === "inspector") && (
            <>
              <SidebarNavItem
                href="/admin/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
                active={pathname === "/admin/dashboard"}
              />
              {(user?.role === "admin" || user?.role === "team_leader") && (
                <>
                  <SidebarNavItem
                    href="/admin/workers"
                    icon={<Users className="h-5 w-5" />}
                    label="Workers"
                    active={pathname.startsWith("/admin/workers")}
                  />
                  <SidebarNavItem
                    href="/admin/workers/new"
                    icon={<PlusCircle className="h-5 w-5" />}
                    label="Add Worker"
                    active={pathname === "/admin/workers/new"}
                  />
                </>
              )}
              <SidebarNavItem
                href="/admin/inspections"
                icon={<ClipboardCheck className="h-5 w-5" />}
                label="Inspections"
                active={pathname.startsWith("/admin/inspections")}
              />
              <SidebarNavItem
                href="/admin/inspections/new"
                icon={<PlusCircle className="h-5 w-5" />}
                label="Add Inspection"
                active={pathname === "/admin/inspections/new"}
              />
              <SidebarNavItem
                href="/admin/reports"
                icon={<FileText className="h-5 w-5" />}
                label="Reports"
                active={pathname === "/admin/reports"}
              />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4">
          <Separator className="my-4" />
          <nav className="space-y-1">
            <SidebarNavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              active={pathname === "/settings"}
            />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {!collapsed && "Logout"}
            </Button>
          </nav>
        </div>
      </aside>
    </>
  )
}

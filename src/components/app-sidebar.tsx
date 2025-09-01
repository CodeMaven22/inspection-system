// 


"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
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
  ChevronDown,
  ChevronUp,
  User,
  Flame,
  HeartPulse,
  Pill,
  ShieldCheck,
  AlarmSmoke, // Corrected smoke alarm icon
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
  const [inspectionsOpen, setInspectionsOpen] = useState(
    pathname.startsWith("/client/inspections") || pathname.startsWith("/admin/inspections")
  )
  const [usersOpen, setUsersOpen] = useState(
    pathname.startsWith("/admin/users")
  )

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleInspectionsMenu = () => {
    setInspectionsOpen(!inspectionsOpen)
  }

  const toggleUsersMenu = () => {
    setUsersOpen(!usersOpen)
  }

  const SidebarNavItem = ({
    href,
    icon,
    label,
    active,
    onClick,
  }: {
    href?: string
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
  }) => {
    const className = cn(
      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-green-800 text-white"
        : "text-green-100 hover:bg-green-700 hover:text-white"
    )

    if (onClick) {
      return (
        <button onClick={onClick} className={className}>
          <div
            className={cn(
              "text-green-200 group-hover:text-white transition-colors",
              active && "text-white"
            )}
          >
            {icon}
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{label}</span>
              {label === "Inspections" ? (
                inspectionsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )
              ) : usersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </>
          )}
        </button>
      )
    }

    return (
      <Link
        href={href!}
        onClick={onMobileClose}
        className={className}
      >
        <div
          className={cn(
            "text-green-200 group-hover:text-white transition-colors",
            active && "text-white"
          )}
        >
          {icon}
        </div>
        {!collapsed && <span>{label}</span>}
      </Link>
    )
  }

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
          "fixed z-50 h-full flex flex-col border-r bg-green-900 p-4 transition-all duration-300 md:static md:z-auto",
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
            className="text-green-200 hover:bg-green-800 hover:text-white"
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
            className="text-green-200 hover:bg-green-800 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {user?.role === "worker" && (
            <>
              <SidebarNavItem
                href="/client/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="My Dashboard"
                active={pathname === "/client/dashboard"}
              />
              
              {/* Inspections with dropdown */}
              <div>
                <SidebarNavItem
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  label="Inspections"
                  active={pathname.startsWith("/client/inspections")}
                  onClick={toggleInspectionsMenu}
                />
                
                {inspectionsOpen && !collapsed && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-700 pl-3">
                    <Link
                      href="/client/inspections"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <span>My Inspections</span>
                    </Link>
                    <Link
                      href="/client/inspections/new"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/new"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <span>Request Inspection</span>
                    </Link>
                    <Link
                      href="/client/inspections/fire-alarm"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/fire-alarm"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <Flame className="h-4 w-4" />
                      <span>Fire Alarm</span>
                    </Link>
                    <Link
                      href="/client/inspections/health-safety"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/health-safety"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Health & Safety</span>
                    </Link>
                    <Link
                      href="/client/inspections/medication-comprehensive"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/medication-comprehensive"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <Pill className="h-4 w-4" />
                      <span>Medication Comprehensive</span>
                    </Link>
                    <Link
                      href="/client/inspections/medication-weekly"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/medication-weekly"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>Medication Weekly</span>
                    </Link>
                    <Link
                      href="/client/inspections/smoke-alarm"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/client/inspections/smoke-alarm"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <AlarmSmoke className="h-4 w-4" />
                      <span>Smoke Alarm</span>
                    </Link>
                  </div>
                )}
              </div>
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
              
              {/* Users with dropdown */}
              {(user?.role === "admin" || user?.role === "team_leader") && (
                <div>
                  <SidebarNavItem
                    icon={<Users className="h-5 w-5" />}
                    label="Users"
                    active={pathname.startsWith("/admin/users")}
                    onClick={toggleUsersMenu}
                  />
                  
                  {usersOpen && !collapsed && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-700 pl-3">
                      <Link
                        href="/admin/users"
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === "/admin/users"
                            ? "text-white"
                            : "text-green-200 hover:text-white"
                        )}
                      >
                        <span>Users List</span>
                      </Link>
                      <Link
                        href="/admin/users/new"
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === "/admin/users/new"
                            ? "text-white"
                            : "text-green-200 hover:text-white"
                        )}
                      >
                        <span>Add User</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Inspections with dropdown */}
              <div>
                <SidebarNavItem
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  label="Inspections"
                  active={pathname.startsWith("/admin/inspections")}
                  onClick={toggleInspectionsMenu}
                />
                
                {inspectionsOpen && !collapsed && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-700 pl-3">
                    {/* <Link
                      href="/admin/inspections"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <span>All Inspections</span>
                    </Link>
                    <Link
                      href="/admin/inspections/new"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/new"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <span>Add Inspection</span>
                    </Link> */}
                    <Link
                      href="/admin/inspections/fire-alarm"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/fire-alarm"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <Flame className="h-4 w-4" />
                      <span>Fire Alarm</span>
                    </Link>
                    <Link
                      href="/admin/inspections/health-safety"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/health-safety"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Health & Safety</span>
                    </Link>
                    <Link
                      href="/admin/inspections/medication-comprehensive"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/medication-comprehensive"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <Pill className="h-4 w-4" />
                      <span>Medication Comprehensive</span>
                    </Link>
                    <Link
                      href="/admin/inspections/medication-weekly"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/medication-weekly"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>Medication Weekly</span>
                    </Link>
                    <Link
                      href="/admin/inspections/smoke-alarm"
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/admin/inspections/smoke-alarm"
                          ? "text-white"
                          : "text-green-200 hover:text-white"
                      )}
                    >
                      <AlarmSmoke className="h-4 w-4" />
                      <span>Smoke Alarm</span>
                    </Link>
                  </div>
                )}
              </div>
              
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
          <Separator className="my-4 bg-green-700" />
          <nav className="space-y-1">
            <SidebarNavItem
              href="/admin/profile"
              icon={<User className="h-5 w-5" />}
              label="Profile"
              active={pathname === "/admin/profile"}
            />
            <SidebarNavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              active={pathname === "/settings"}
            />
            <Button
              variant="ghost"
              className="w-full justify-start text-green-200 hover:bg-green-800 hover:text-white"
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
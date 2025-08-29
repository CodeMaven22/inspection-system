"use client"

import { Menu, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-4 text-zinc-700 shadow-md">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt={user?.first_name || "User"} />
              <AvatarFallback>{user?.first_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-left leading-tight">
              <p className="font-semibold">
                {user ? `${user.first_name} ${user.last_name}` : "Guest"}
              </p>
              <p className="text-xs text-gray-400">{user?.role || ""}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-black">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

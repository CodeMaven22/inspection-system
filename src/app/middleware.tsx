// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login"
  const token = request.cookies.get("auth_tokens")?.value || ""

  // If logged in and trying to access login page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl))
  }

  // If not logged in and trying to access protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
    "/login",
    "/"
  ]
}
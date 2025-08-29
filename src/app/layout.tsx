import type React from "react"
import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
// import { Toaster } from "@/components/ui/toaster"
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] })
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "Unique Care Limited - Inspection System",
  description: "Comprehensive inspection and compliance management system for Unique Care Limited.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

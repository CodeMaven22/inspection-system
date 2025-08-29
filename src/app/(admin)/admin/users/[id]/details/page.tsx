"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2, ArrowLeft, User, Mail, Phone, MapPin, Shield, Edit, Home,
  BadgeInfo, Clock, CheckCircle, XCircle, Map, Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"


export default function ViewUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const { tokens } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tokens && id) fetchUser()
  }, [tokens, id])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/core/users/${id}/`, {
        headers: { Authorization: `Bearer ${tokens?.access}` },
      })
      setUser(response.data)
    } catch (error: any) {
      console.error("Failed to fetch user:", error)
      toast.error("Failed to load user details")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-[#006600]" />
      </div>
    )

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">User not found</h2>
          <Button onClick={() => router.back()} className="mt-4 bg-[#006600] hover:bg-[#004d00] text-white">
            Go Back
          </Button>
        </div>
      </div>
    )

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-blue-100 text-blue-800"
      case "inspector": return "bg-purple-100 text-purple-800"
      case "worker": return "bg-green-100 text-green-800"
      case "team_leader": return "bg-pink-100 text-pink-800"
      case "client": return "bg-amber-100 text-amber-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#006600] hover:bg-[#006600]/10"
        >
          <ArrowLeft size={18} /> Back to Users
        </Button>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#006600]">User Details</h1>
          <p className="text-gray-600 mt-2">View detailed information about this user</p>
        </div>

        <Card className="shadow-lg border border-[#006600]/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#006600] text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6" /> {user.first_name} {user.last_name}
            </CardTitle>
            <CardDescription className="text-green-100">
              User ID: {user.id}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {user.profile_picture && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                    <ImageIcon className="h-5 w-5" /> Profile Picture
                  </h2>
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-green-200 shadow-md">
                      <Image src={user.profile_picture} alt={`${user.first_name}`} fill className="object-cover" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                  <BadgeInfo className="h-5 w-5" /> Personal Information
                </h2>
                <div className="mt-4 space-y-4">
                  <InfoRow icon={<User />} label="Full Name" value={`${user.first_name} ${user.last_name}`} />
                  <InfoRow icon={<Mail />} label="Email" value={user.email} />
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-[#006600] mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Role</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                        {user.role ? user.role.replace(/_/g, " ") : "No role assigned"}
                      </span>
                    </div>
                  </div>
                  {user.company && <InfoRow icon={<Home />} label="Company" value={user.company} />}
                  {user.country && <InfoRow icon={<MapPin />} label="Country" value={user.country} />}
                  {user.created_by_name && <InfoRow icon={<Shield />} label="Created By" value={user.created_by_name} />}
                </div>
              </div>

              {(user.phone_number || user.location) && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                    <Phone className="h-5 w-5" /> Contact Information
                  </h2>
                  <div className="mt-4 space-y-4">
                    {user.phone_number && <InfoRow icon={<Phone />} label="Phone Number" value={user.phone_number} />}
                    {user.location && <InfoRow icon={<MapPin />} label="Location" value={user.location} />}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {user.bio && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                    <BadgeInfo className="h-5 w-5" /> Bio
                  </h2>
                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                </div>
              )}

              {(user.address || user.city || user.state) && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                    <Home className="h-5 w-5" /> Residential Details
                  </h2>
                  <div className="mt-4 space-y-4">
                    {user.address && <InfoRow icon={<Home />} label="Address" value={user.address} />}
                    {user.city && <InfoRow icon={<Map />} label="City" value={user.city} />}
                    {user.state && <InfoRow icon={<Map />} label="State/Region" value={user.state} />}
                  </div>
                </div>
              )}

              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[#006600] border-b pb-2">
                  <Shield className="h-5 w-5" /> Account Information
                </h2>
                <div className="mt-4 space-y-4">
                  <StatusRow label="Status" value={user.is_active ? "Active" : "Inactive"} active={user.is_active} />
                  <StatusRow label="Email Verified" value={user.is_verified ? "Yes" : "No"} active={user.is_verified} />
                  {user.date_joined && (
                    <InfoRow
                      icon={<Clock />}
                      label="Joined Date"
                      value={new Date(user.date_joined).toLocaleDateString("en-GB", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                      })}
                    />
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-green-200">
                <h2 className="text-lg font-semibold text-[#006600] mb-4">Actions</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push(`/admin/users/${id}/edit`)}
                    className="bg-[#006600] hover:bg-[#004d00] text-white flex items-center gap-2 rounded-xl"
                  >
                    <Edit className="h-4 w-4" /> Edit User
                  </Button>
                  <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
                    Back to List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 text-[#006600]">{icon}</div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

function StatusRow({ label, value, active }: { label: string, value: string, active: boolean }) {
  return (
    <div className="flex items-start">
      {active ? (
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
      )}
      <div className="ml-3">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-sm font-semibold ${active ? "text-green-600" : "text-red-600"}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

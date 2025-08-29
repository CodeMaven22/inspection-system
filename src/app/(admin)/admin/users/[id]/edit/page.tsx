// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import axios from "axios"
// import { useAuth } from "@/context/auth-context"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, ArrowLeft, Save, Mail, User, Phone, MapPin, FileText, UserCog } from "lucide-react"
// import { toast } from "sonner"
// import type { UserData } from "@/types/user"


// export default function EditUserPage() {
//   const { id } = useParams()
//   const router = useRouter()
//   const { tokens } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
// const [userData, setUserData] = useState<UserData>({
//   first_name: "",
//   last_name: "",
//   email: "",
//   role: "worker", // default role
//   phone_number: "",
//   location: "",
//   bio: "",
//   is_active: true
// })

//   useEffect(() => {
//     if (tokens && id) {
//       fetchUser()
//     }
//   }, [tokens, id])

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/core/users/${id}/`, {
//         headers: { Authorization: `Bearer ${tokens?.access}` },
//       })
//       setUserData(response.data)
//     } catch (error: any) {
//       console.error("Failed to fetch user:", error)
//       toast.error("Failed to load user details")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       await axios.patch(`http://127.0.0.1:8000/api/core/users/${id}/`, userData, {
//         headers: { Authorization: `Bearer ${tokens?.access}` },
//       })
//       toast.success("User updated successfully")
//       router.push(`/admin/users/${id}`)
//     } catch (error: any) {
//       console.error("Failed to update user:", error)
//       toast.error(error.response?.data?.detail || "Failed to update user")
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setUserData(prev => ({ ...prev, [field]: value }))
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-[#006600]" />
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
//       <div className="max-w-3xl mx-auto">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="mb-6 flex items-center gap-2 text-[#006600] hover:bg-[#006600]/10"
//         >
//           <ArrowLeft size={18} /> Back
//         </Button>

//         <Card className="shadow-lg border border-[#006600]/20 rounded-2xl">
//           <CardHeader className="bg-[#006600] rounded-t-2xl">
//             <CardTitle className="text-white flex items-center gap-2">
//               <UserCog size={22} /> Edit User
//             </CardTitle>
//             <CardDescription className="text-green-100">Update user information</CardDescription>
//           </CardHeader>

//           <CardContent className="p-6 space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="first_name" className="flex items-center gap-2 text-[#006600]">
//                     <User size={16} /> First Name
//                   </Label>
//                   <Input
//                     id="first_name"
//                     value={userData.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     required
//                     className="rounded-xl"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="last_name" className="flex items-center gap-2 text-[#006600]">
//                     <User size={16} /> Last Name
//                   </Label>
//                   <Input
//                     id="last_name"
//                     value={userData.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     required
//                     className="rounded-xl"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="email" className="flex items-center gap-2 text-[#006600]">
//                   <Mail size={16} /> Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={userData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   required
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="role" className="flex items-center gap-2 text-[#006600]">
//                   <UserCog size={16} /> Role
//                 </Label>
//                 <Select value={userData.role} onValueChange={(value) => handleChange("role", value)}>
//                   <SelectTrigger className="rounded-xl">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="admin">Admin</SelectItem>
//                     <SelectItem value="inspector">Inspector</SelectItem>
//                     <SelectItem value="worker">Worker</SelectItem>
//                     <SelectItem value="team_leader">Team Leader</SelectItem>
//                     <SelectItem value="client">Client</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="phone_number" className="flex items-center gap-2 text-[#006600]">
//                   <Phone size={16} /> Phone Number
//                 </Label>
//                 <Input
//                   id="phone_number"
//                   value={userData.phone_number || ""}
//                   onChange={(e) => handleChange("phone_number", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="location" className="flex items-center gap-2 text-[#006600]">
//                   <MapPin size={16} /> Location
//                 </Label>
//                 <Input
//                   id="location"
//                   value={userData.location || ""}
//                   onChange={(e) => handleChange("location", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="bio" className="flex items-center gap-2 text-[#006600]">
//                   <FileText size={16} /> Bio
//                 </Label>
//                 <Input
//                   id="bio"
//                   value={userData.bio || ""}
//                   onChange={(e) => handleChange("bio", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div className="flex gap-4 pt-6">
//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="flex items-center gap-2 bg-[#006600] hover:bg-[#004d00] text-white rounded-xl px-6"
//                 >
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.back()}
//                   className="rounded-xl"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import axios from "axios"
// import { toast } from "sonner"
// import { useAuth } from "@/context/auth-context"
// import type { UserData } from "@/types/user"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, ArrowLeft, Save, UserCog, Mail, User, Phone, MapPin, FileText } from "lucide-react"

// export default function EditUserPage() {
//   const { id } = useParams()
//   const router = useRouter()
//   const { tokens } = useAuth()

//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [userData, setUserData] = useState<UserData>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     role: "worker", // default role
//     phone_number: "",
//     location: "",
//     bio: "",
//     is_active: true
//   })

//   // --- Fetch user data
//   useEffect(() => {
//     if (tokens && id) fetchUser()
//   }, [tokens, id])

//   const fetchUser = async () => {
//     if (!tokens) return
//     setLoading(true)
//     try {
//       const { data } = await axios.get<UserData>(`http://127.0.0.1:8000/api/core/users/${id}/`, {
//         headers: { Authorization: `Bearer ${tokens.access}` },
//       })
//       setUserData(data)
//     } catch (error: any) {
//       console.error("Failed to fetch user:", error)
//       toast.error("Failed to load user details")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // --- Handle input changes (type-safe)
//   const handleChange = <K extends keyof UserData>(field: K, value: UserData[K]) => {
//     setUserData(prev => ({ ...prev, [field]: value }))
//   }

//   // --- Handle form submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!tokens) return
//     setSaving(true)
//     try {
//       await axios.patch(`http://127.0.0.1:8000/api/core/users/${id}/`, userData, {
//         headers: { Authorization: `Bearer ${tokens.access}` },
//       })
//       toast.success("User updated successfully")
//       router.push("/admin/users") // redirect back to users list
//     } catch (error: any) {
//       console.error("Failed to update user:", error)
//       toast.error(error.response?.data?.detail || "Failed to update user")
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-green-600" />
//       </div>
//     )
//   }

//   const roles: UserData["role"][] = ["admin", "inspector", "worker", "team_leader", "client"]

//   return (
//     <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
//       <div className="max-w-3xl mx-auto">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="mb-6 flex items-center gap-2 text-green-600 hover:bg-green-600/10"
//         >
//           <ArrowLeft size={18} /> Back
//         </Button>

//         <Card className="shadow-lg border border-green-600/20 rounded-2xl">
//           <CardHeader className="bg-green-600 rounded-t-2xl">
//             <CardTitle className="text-white flex items-center gap-2">
//               <UserCog size={22} /> Edit User
//             </CardTitle>
//             <CardDescription className="text-green-100">Update user information</CardDescription>
//           </CardHeader>

//           <CardContent className="p-6 space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="first_name" className="flex items-center gap-2 text-green-600">
//                     <User size={16} /> First Name
//                   </Label>
//                   <Input
//                     id="first_name"
//                     value={userData.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     required
//                     className="rounded-xl"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="last_name" className="flex items-center gap-2 text-green-600">
//                     <User size={16} /> Last Name
//                   </Label>
//                   <Input
//                     id="last_name"
//                     value={userData.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     required
//                     className="rounded-xl"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="email" className="flex items-center gap-2 text-green-600">
//                   <Mail size={16} /> Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={userData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   required
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="role" className="flex items-center gap-2 text-green-600">
//                   <UserCog size={16} /> Role
//                 </Label>
//                 <Select value={userData.role} onValueChange={(value: UserData["role"]) => handleChange("role", value)}>
//                   <SelectTrigger className="rounded-xl">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roles.map((role) => (
//                       <SelectItem key={role} value={role}>
//                         {role.replace(/_/g, " ")}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="phone_number" className="flex items-center gap-2 text-green-600">
//                   <Phone size={16} /> Phone Number
//                 </Label>
//                 <Input
//                   id="phone_number"
//                   value={userData.phone_number}
//                   onChange={(e) => handleChange("phone_number", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="location" className="flex items-center gap-2 text-green-600">
//                   <MapPin size={16} /> Location
//                 </Label>
//                 <Input
//                   id="location"
//                   value={userData.location}
//                   onChange={(e) => handleChange("location", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="bio" className="flex items-center gap-2 text-green-600">
//                   <FileText size={16} /> Bio
//                 </Label>
//                 <Input
//                   id="bio"
//                   value={userData.bio}
//                   onChange={(e) => handleChange("bio", e.target.value)}
//                   className="rounded-xl"
//                 />
//               </div>

//               <div className="flex gap-4 pt-6">
//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
//                 >
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.back()}
//                   className="rounded-xl"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Save, UserCog, User, Mail, Phone, MapPin, FileText } from "lucide-react"
import { toast } from "sonner"
import { UserUpdate } from "@/types/user" // your updated type

export default function EditUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const { tokens } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserUpdate>({
    first_name: "",
    last_name: "",
    email: "",
    role: "worker",
    phone_number: "",
    location: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    profile_picture: null
  })

  // Fetch user details
  useEffect(() => {
    if (tokens && id) fetchUser()
  }, [tokens, id])

 const fetchUser = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/core/users/${id}/`, {
      headers: { Authorization: `Bearer ${tokens?.access}` },
    })

    // Map backend response to editable fields
    const data: UserUpdate = {
      first_name: res.data.first_name || "",
      last_name: res.data.last_name || "",
      email: res.data.email || "",
      role: res.data.role || "",
      phone_number: res.data.phone_number || "",
      location: res.data.location || "",
      bio: res.data.bio || "",
      address: res.data.address || "",
      city: res.data.city || "",
      state: res.data.state || "",
      profile_picture: null // keep null for now; file input cannot have a URL directly
    }

    setUserData(data)
  } catch (err) {
    console.error("Failed to fetch user:", err)
    toast.error("Failed to load user details")
  } finally {
    setLoading(false)
  }
}


  const handleChange = (field: keyof UserUpdate, value: string | File | null) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as string | Blob)
      })

      await axios.patch(`http://127.0.0.1:8000/api/core/users/${id}/`, formData, {
        headers: { 
          Authorization: `Bearer ${tokens?.access}`,
          "Content-Type": "multipart/form-data"
        },
      })

      toast.success("User updated successfully")
      router.push(`/admin/users/${id}`)
    } catch (err: any) {
      console.error("Failed to update user:", err)
      toast.error(err.response?.data?.detail || "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#006600]" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#006600] hover:bg-[#006600]/10"
        >
          <ArrowLeft size={18} /> Back
        </Button>

        <Card className="shadow-lg border border-[#006600]/20 rounded-2xl">
          <CardHeader className="bg-[#006600] rounded-t-2xl">
            <CardTitle className="text-white flex items-center gap-2">
              <UserCog size={22} /> Edit User
            </CardTitle>
            <CardDescription className="text-green-100">Update user information</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first_name" className="flex items-center gap-2 text-[#006600]">
                    <User size={16} /> First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={userData.first_name}
                    onChange={e => handleChange("first_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="flex items-center gap-2 text-[#006600]">
                    <User size={16} /> Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={userData.last_name}
                    onChange={e => handleChange("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-[#006600]">
                  <Mail size={16} /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={e => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role" className="flex items-center gap-2 text-[#006600]">
                  <UserCog size={16} /> Role
                </Label>
                <Select value={userData.role} onValueChange={value => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                    <SelectItem value="team_leader">Team Leader</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone, Location, Bio */}
              <div>
                <Label htmlFor="phone_number" className="flex items-center gap-2 text-[#006600]">
                  <Phone size={16} /> Phone Number
                </Label>
                <Input
                  id="phone_number"
                  value={userData.phone_number || ""}
                  onChange={e => handleChange("phone_number", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2 text-[#006600]">
                  <MapPin size={16} /> Location
                </Label>
                <Input
                  id="location"
                  value={userData.location || ""}
                  onChange={e => handleChange("location", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio" className="flex items-center gap-2 text-[#006600]">
                  <FileText size={16} /> Bio
                </Label>
                <Input
                  id="bio"
                  value={userData.bio || ""}
                  onChange={e => handleChange("bio", e.target.value)}
                />
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 text-[#006600]">Address</Label>
                  <Input
                    id="address"
                    value={userData.address || ""}
                    onChange={e => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="flex items-center gap-2 text-[#006600]">City</Label>
                  <Input
                    id="city"
                    value={userData.city || ""}
                    onChange={e => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="flex items-center gap-2 text-[#006600]">State</Label>
                  <Input
                    id="state"
                    value={userData.state || ""}
                    onChange={e => handleChange("state", e.target.value)}
                  />
                </div>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={saving} className="bg-[#006600] text-white flex items-center gap-2 px-6 rounded-xl">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

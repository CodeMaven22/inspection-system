"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { User, Mail, Phone, MapPin, Camera, Save, Key, Eye, EyeOff, Building, Home, Map, Globe } from "lucide-react"
import type { UserRole } from "@/types/auth"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    profile_picture: "",
    bio: "",
    phone_number: "",
    location: "",
    address: "",
    city: "",
    state: "",
    country: "United Kingdom",
    company: "Unique Care Limited Network",
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const authTokens = localStorage.getItem("auth_tokens")
      if (!authTokens) {
        toast.error("Authentication required. Please login again.")
        router.push("/login")
        return
      }

      const tokens = JSON.parse(authTokens)
      const accessToken = tokens.access

      const response = await axios.get("http://127.0.0.1:8000/api/core/user/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      setUserData(response.data)
    } catch (error: any) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to load profile data")
    }
  }

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setUserData({ ...userData, [id]: value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value })
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData({ ...passwordData, [id]: value })
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const authTokens = localStorage.getItem("auth_tokens")
      if (!authTokens) {
        toast.error("Authentication required. Please login again.")
        router.push("/login")
        return
      }

      const tokens = JSON.parse(authTokens)
      const accessToken = tokens.access

      // Create payload with only the fields the backend accepts
      const payload = {
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        profile_picture: userData.profile_picture || null,
        bio: userData.bio || "",
        phone_number: userData.phone_number || "",
        location: userData.location || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
      }

      console.log("Sending payload:", payload)

      const response = await axios.patch(
        "http://127.0.0.1:8000/api/core/user/profile/",
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      console.log("API Response:", response.data)
      // Only update the fields that came back from the backend
      setUserData(prev => ({
        ...prev,
        ...response.data
      }))

      toast.success("Profile updated successfully")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      console.error("Error response:", error.response?.data)
      toast.error(error.response?.data?.detail || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match")
      return
    }

    const authTokens = localStorage.getItem("auth_tokens")
    if (!authTokens) {
      toast.error("Authentication required. Please login again.")
      router.push("/login")
      return
    }

    const tokens = JSON.parse(authTokens)
    const accessToken = tokens.access

    // Use POST instead of PATCH and include confirm_password
    await axios.patch(
      "http://127.0.0.1:8000/api/core/user/change-password/",
      {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password, // Add this field
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    toast.success("Password updated successfully")
    setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
  } catch (error: any) {
    console.error("Error updating password:", error)
    console.error("Error response:", error.response?.data) // Add this for debugging
    toast.error(error.response?.data?.detail || error.response?.data?.message || "Failed to update password")
  } finally {
    setLoading(false)
  }
}

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const authTokens = localStorage.getItem("auth_tokens")
      if (!authTokens) {
        toast.error("Authentication required. Please login again.")
        return
      }

      const tokens = JSON.parse(authTokens)
      const accessToken = tokens.access

      const formData = new FormData()
      formData.append("profile_picture", file)

      const response = await axios.patch(
        "http://127.0.0.1:8000/api/core/user/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      setUserData({ ...userData, profile_picture: response.data.profile_picture })
      toast.success("Profile picture updated successfully")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast.error(error.response?.data?.detail || "Failed to upload image")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800">Profile Settings</h1>
          <p className="text-green-600 mt-2">Manage your account information and security settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Image Upload */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center border-4 border-white shadow-lg">
                        {userData.profile_picture ? (
                          <img
                            src={userData.profile_picture}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-green-600" />
                        )}
                      </div>
                      <label htmlFor="profile_picture" className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          id="profile_picture"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {userData.first_name} {userData.last_name}
                      </h3>
                      <p className="text-gray-600 capitalize">{userData.role?.replace('_', ' ')}</p>
                      <p className="text-gray-500 text-sm">{userData.company}</p>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800 border-b pb-2">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <Label htmlFor="first_name" className="mb-2">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="first_name"
                            value={userData.first_name}
                            onChange={handleUserChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="last_name" className="mb-2">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="last_name"
                            value={userData.last_name}
                            onChange={handleUserChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="flex flex-col">
                        <Label htmlFor="email" className="mb-2">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={handleUserChange}
                            className="pl-10"
                            disabled

                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <Label htmlFor="role" className="mb-2">Role</Label>
                        <Input
                          id="role"
                          value={userData.role?.replace('_', ' ') || ''}
                          onChange={handleUserChange}
                          disabled // Make it read-only
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Label htmlFor="bio" className="mb-2">Bio</Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        onChange={handleUserChange}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800 border-b pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <Label htmlFor="phone_number" className="mb-2">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="phone_number"
                            value={userData.phone_number}
                            onChange={handleUserChange}
                            className="pl-10"
                            placeholder="+44 123 456 7890"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="location" className="mb-2">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="location"
                            value={userData.location}
                            onChange={handleUserChange}
                            className="pl-10"
                            placeholder="e.g., London, UK"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800 border-b pb-2">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <Label htmlFor="address" className="mb-2">Address</Label>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="address"
                            value={userData.address}
                            onChange={handleUserChange}
                            className="pl-10"
                            placeholder="123 Main Street"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="city" className="mb-2">City</Label>
                        <div className="relative">
                          <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="city"
                            value={userData.city}
                            onChange={handleUserChange}
                            className="pl-10"
                            placeholder="e.g., London"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="state" className="mb-2">State/Region</Label>
                        <Input
                          id="state"
                          value={userData.state}
                          onChange={handleUserChange}
                          placeholder="e.g., England"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="country" className="mb-2">Country</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                          <Input
                            id="country"
                            value={userData.country}
                            onChange={handleUserChange}
                            className="pl-10"
                            disabled

                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800 border-b pb-2">Company Information</h3>
                    <div className="flex flex-col">
                      <Label htmlFor="company" className="mb-2">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                        <Input
                          id="company"
                          value={userData.company}
                          onChange={handleUserChange}
                          className="pl-10"
                          disabled

                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-green-100">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="flex flex-col">
                    <Label htmlFor="current_password" className="mb-2">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="new_password" className="mb-2">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="confirm_password" className="mb-2">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
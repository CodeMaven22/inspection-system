"use client"

import type React from "react"
import { useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { UserRole } from "@/types/auth"
import { Loader2, User, Mail, Phone, MapPin, ArrowLeft } from "lucide-react"

export default function NewWorkerPage() {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    bio: "",
    phone_number: "",
    location: "",
    address: "",
    city: "",
    state: "",
    country: "United Kingdom",
    company: "Unique Care Limited Network",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewUser({ ...newUser, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Get the auth tokens from localStorage
      const authTokens = localStorage.getItem("auth_tokens")
      
      if (!authTokens) {
        toast.error("Authentication required. Please login again.")
        router.push("/login")
        return
      }
      
      // Parse the tokens from the stored JSON
      const tokens = JSON.parse(authTokens)
      const accessToken = tokens.access
      
      if (!accessToken) {
        toast.error("Authentication token missing. Please login again.")
        router.push("/login")
        return
      }
      
      const payload = { 
        ...newUser, 
        password: "defaultpassword123" // Set a default password
      }
      
      await axios.post(
        "http://127.0.0.1:8000/api/core/users/",
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          } 
        }
      )

      toast.success(`Worker ${newUser.first_name} ${newUser.last_name} added successfully`)
      router.push("/workers")
    } catch (error: any) {
      console.error("Error creating worker:", error)
      
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.")
        router.push("/login")
      } else if (error.response?.data) {
        // Handle validation errors from the API
        const errorData = error.response.data
        if (typeof errorData === 'object') {
          // Display the first error message
          const firstError = Object.values(errorData)[0]
          toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError))
        } else {
          toast.error(errorData.detail || "Failed to create worker")
        }
      } else {
        toast.error("Failed to create worker. Please check your connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4 md:p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header with back button */}
        <div className="flex items-center mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 hover:bg-green-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 tracking-tight">Add New Worker</h1>
            <p className="text-green-600 mt-1 md:mt-2 text-sm md:text-base">
              Create a new user account for an inspector, worker, team leader, or admin.
            </p>
          </div>
          
          <Card className="w-full shadow-lg border-0 flex flex-col h-full">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <User className="h-5 w-5 md:h-6 md:w-6" />
                Worker Details
              </CardTitle>
              <CardDescription className="text-green-100 text-sm md:text-base">
                Fill in the details to add a new worker to the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Personal Details Section */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-green-800 border-b pb-2">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <Label htmlFor="first_name" className="mb-2 text-gray-700 font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                        <Input 
                          id="first_name" 
                          value={newUser.first_name} 
                          onChange={handleChange} 
                          className="pl-10 border-green-200 focus:border-green-500" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="last_name" className="mb-2 text-gray-700 font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                        <Input 
                          id="last_name" 
                          value={newUser.last_name} 
                          onChange={handleChange} 
                          className="pl-10 border-green-200 focus:border-green-500" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="bio" className="mb-2 text-gray-700 font-medium">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={newUser.bio} 
                      onChange={handleChange} 
                      placeholder="Tell us a bit about this worker..." 
                      className="border-green-200 focus:border-green-500 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-green-800 border-b pb-2">Contact Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <Label htmlFor="email" className="mb-2 text-gray-700 font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                        <Input 
                          id="email" 
                          type="email" 
                          value={newUser.email} 
                          onChange={handleChange} 
                          className="pl-10 border-green-200 focus:border-green-500" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="phone_number" className="mb-2 text-gray-700 font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                        <Input 
                          id="phone_number" 
                          value={newUser.phone_number} 
                          onChange={handleChange} 
                          className="pl-10 border-green-200 focus:border-green-500" 
                          placeholder="+44 123 456 7890" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="location" className="mb-2 text-gray-700 font-medium">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                      <Input 
                        id="location" 
                        value={newUser.location} 
                        onChange={handleChange} 
                        className="pl-10 border-green-200 focus:border-green-500" 
                        placeholder="e.g., London, UK" 
                      />
                    </div>
                  </div>
                </div>

                {/* Residential Details Section */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-green-800 border-b pb-2">Residential Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <Label htmlFor="address" className="mb-2 text-gray-700 font-medium">Address</Label>
                      <Input 
                        id="address" 
                        value={newUser.address} 
                        onChange={handleChange} 
                        className="border-green-200 focus:border-green-500" 
                        placeholder="123 Main Street" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="city" className="mb-2 text-gray-700 font-medium">City</Label>
                      <Input 
                        id="city" 
                        value={newUser.city} 
                        onChange={handleChange} 
                        className="border-green-200 focus:border-green-500" 
                        placeholder="e.g., London" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="state" className="mb-2 text-gray-700 font-medium">State/Region</Label>
                      <Input 
                        id="state" 
                        value={newUser.state} 
                        onChange={handleChange} 
                        className="border-green-200 focus:border-green-500" 
                        placeholder="e.g., England" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="country" className="mb-2 text-gray-700 font-medium">Country</Label>
                      <Input 
                        id="country" 
                        value={newUser.country} 
                        onChange={handleChange} 
                        className="border-green-200 focus:border-green-500" 
                      />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <Label htmlFor="company" className="mb-2 text-gray-700 font-medium">Company</Label>
                      <Input 
                        id="company" 
                        value={newUser.company} 
                        onChange={handleChange} 
                        className="border-green-200 focus:border-green-500" 
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-green-800 border-b pb-2">Role Assignment</h2>
                  <div className="flex flex-col">
                    <Label htmlFor="role" className="mb-2 text-gray-700 font-medium">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                      required
                    >
                      <SelectTrigger id="role" className="border-green-200 focus:border-green-500">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="team_leader">Team Leader</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 md:pt-6 border-t border-green-200">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-4 md:py-6 text-base md:text-lg font-semibold" 
                    disabled={loading || !newUser.first_name || !newUser.last_name || !newUser.email || !newUser.role}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        Adding Worker...
                      </>
                    ) : (
                      "Add Worker"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

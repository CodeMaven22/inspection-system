// "use client"

// import { useState, useEffect } from "react"
// import Link  from "next/link"
// import { useRouter, useParams } from "next/navigation"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Loader2,
//   ArrowLeft,
//   Save,
//   Calendar,
//   User,
//   Building,
//   MapPin,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "sonner"
// import axios from "axios"

// interface FireAlarmInspectionDetail {
//   id: number
//   inspection: {
//     id: number
//     client_name: string
//     location: string
//     created_by: number
//     created_by_name: string
//     inspection_date: string
//     status: string
//     approved_by: number | null
//     approved_by_name: string | null
//     approval_date: string | null
//   }
//   system_type: string
//   control_panel_test: boolean
//   battery_test: boolean
//   visual_inspection: boolean
//   functional_test: boolean
//   alarm_test: boolean
//   issues_found: string
//   corrective_actions: string
//   notes: string
//   is_active: boolean
//   created_at: string
//   updated_at: string
// }

// export default function EditFireAlarmInspectionPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { tokens, user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [inspection, setInspection] = useState<FireAlarmInspectionDetail | null>(null)

//   const [formData, setFormData] = useState({
//     system_type: "",
//     control_panel_test: false,
//     battery_test: false,
//     visual_inspection: false,
//     functional_test: false,
//     alarm_test: false,
//     issues_found: "",
//     corrective_actions: "",
//     notes: "",
//     client_name: "",
//     location: "",
//     inspection_date: "",
//   })

//   useEffect(() => {
//     const fetchInspection = async () => {
//       if (!tokens) return
      
//       try {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/inspections/fire-alarm/${params.id}/`,
//           {
//             headers: { Authorization: `Bearer ${tokens.access}` },
//           }
//         )
//         setInspection(res.data)
        
//         // Set form data
//         setFormData({
//           system_type: res.data.system_type || "",
//           control_panel_test: res.data.control_panel_test,
//           battery_test: res.data.battery_test,
//           visual_inspection: res.data.visual_inspection,
//           functional_test: res.data.functional_test,
//           alarm_test: res.data.alarm_test,
//           issues_found: res.data.issues_found || "",
//           corrective_actions: res.data.corrective_actions || "",
//           notes: res.data.notes || "",
//           client_name: res.data.inspection.client_name,
//           location: res.data.inspection.location,
//           inspection_date: res.data.inspection.inspection_date.split('T')[0], // Format date for input
//         })
//       } catch (err) {
//         console.error("Failed to fetch inspection details:", err)
//         toast.error("Failed to load inspection details")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInspection()
//   }, [params.id, tokens])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setFormData(prev => ({ ...prev, [name]: checked }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!tokens || !inspection) return

//     setSaving(true)
//     try {
//       // Prepare data for API
//       const updateData = {
//         system_type: formData.system_type,
//         control_panel_test: formData.control_panel_test,
//         battery_test: formData.battery_test,
//         visual_inspection: formData.visual_inspection,
//         functional_test: formData.functional_test,
//         alarm_test: formData.alarm_test,
//         issues_found: formData.issues_found,
//         corrective_actions: formData.corrective_actions,
//         notes: formData.notes,
//         client_name: formData.client_name,
//         location: formData.location,
//         inspection_date: formData.inspection_date,
//       }

//       await axios.patch(
//         `http://127.0.0.1:8000/api/inspections/fire-alarm/${params.id}/`,
//         updateData,
//         {
//           headers: { Authorization: `Bearer ${tokens.access}` },
//         }
//       )

//       toast.success("Inspection updated successfully")
//       router.push(`/inspections/fire-alarm/${params.id}`)
//     } catch (err) {
//       console.error("Failed to update inspection:", err)
//       toast.error("Failed to update inspection")
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
//           <p className="text-muted-foreground">Loading inspection details...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!inspection) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-emerald-700 mb-2">Inspection Not Found</h2>
//           <p className="text-muted-foreground mb-4">The requested inspection could not be found.</p>
//           <Button asChild>
//             <Link href="/admin/inspections/fire-alarm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Inspections
//             </Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       <div className="flex items-center gap-4">
//         <Button asChild variant="outline" size="icon">
//           <Link href={`/inspections/fire-alarm/${params.id}`}>
//             <ArrowLeft className="h-4 w-4" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Edit Fire Alarm Inspection</h1>
//           <p className="text-muted-foreground">Inspection ID: #{inspection.id}</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Basic Information */}
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle className="text-emerald-700">Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="client_name">Client Name</Label>
//                 <Input
//                   id="client_name"
//                   name="client_name"
//                   value={formData.client_name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="inspection_date">Inspection Date</Label>
//                 <Input
//                   id="inspection_date"
//                   name="inspection_date"
//                   type="date"
//                   value={formData.inspection_date}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="system_type">System Type</Label>
//                 <Input
//                   id="system_type"
//                   name="system_type"
//                   value={formData.system_type}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Conventional, Addressable"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Test Results */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-emerald-700">Test Results</CardTitle>
//               <CardDescription>Select the tests that were performed successfully</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="control_panel_test"
//                     checked={formData.control_panel_test}
//                     onCheckedChange={(checked) => 
//                       handleCheckboxChange("control_panel_test", checked as boolean)
//                     }
//                   />
//                   <Label htmlFor="control_panel_test" className="cursor-pointer">
//                     Control Panel Test
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="battery_test"
//                     checked={formData.battery_test}
//                     onCheckedChange={(checked) => 
//                       handleCheckboxChange("battery_test", checked as boolean)
//                     }
//                   />
//                   <Label htmlFor="battery_test" className="cursor-pointer">
//                     Battery Test
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="visual_inspection"
//                     checked={formData.visual_inspection}
//                     onCheckedChange={(checked) => 
//                       handleCheckboxChange("visual_inspection", checked as boolean)
//                     }
//                   />
//                   <Label htmlFor="visual_inspection" className="cursor-pointer">
//                     Visual Inspection
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="functional_test"
//                     checked={formData.functional_test}
//                     onCheckedChange={(checked) => 
//                       handleCheckboxChange("functional_test", checked as boolean)
//                     }
//                   />
//                   <Label htmlFor="functional_test" className="cursor-pointer">
//                     Functional Test
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="alarm_test"
//                     checked={formData.alarm_test}
//                     onCheckedChange={(checked) => 
//                       handleCheckboxChange("alarm_test", checked as boolean)
//                     }
//                   />
//                   <Label htmlFor="alarm_test" className="cursor-pointer">
//                     Alarm Test
//                   </Label>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="issues_found">Issues Found</Label>
//                 <Textarea
//                   id="issues_found"
//                   name="issues_found"
//                   value={formData.issues_found}
//                   onChange={handleInputChange}
//                   placeholder="Describe any issues found during inspection"
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="corrective_actions">Corrective Actions</Label>
//                 <Textarea
//                   id="corrective_actions"
//                   name="corrective_actions"
//                   value={formData.corrective_actions}
//                   onChange={handleInputChange}
//                   placeholder="Describe corrective actions taken"
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="notes">Notes</Label>
//                 <Textarea
//                   id="notes"
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleInputChange}
//                   placeholder="Additional notes or comments"
//                   rows={3}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.push(`/inspections/fire-alarm/${params.id}`)}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="mr-2 h-4 w-4" />
//                 Save Changes
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import {
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import axios from "axios"

interface FireAlarmInspectionDetail {
  id: number
  inspection: {
    id: number
    inspection_type: string
    location: string
    client_name: string
    status: string
    created_by: number
    created_by_name: string
    submitted_by_role: string
    inspection_conducted_by: number | null
    inspection_comments: string | null
    inspection_date: string | null
    approved_by: number | null
    approved_by_name: string | null
    approval_comments: string | null
    approval_date: string | null
    created_at: string
  }
  point_checked: string | null
  alarm_functional: boolean | null
  call_points_accessible: boolean | null
  emergency_lights_working: boolean | null
  faults_identified_details: string | null
  action_taken_details: string | null
  management_book_initials: string | null
  comments: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function EditFireAlarmInspectionPage() {
  const router = useRouter()
  const params = useParams()
  const { tokens, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inspection, setInspection] = useState<FireAlarmInspectionDetail | null>(null)

  const [formData, setFormData] = useState({
    location: "",
    client_name: "",
    point_checked: "",
    alarm_functional: false,
    call_points_accessible: false,
    emergency_lights_working: false,
    faults_identified_details: "",
    action_taken_details: "",
    management_book_initials: "",
    comments: "",
    inspection_date: "",
  })

  useEffect(() => {
    const fetchInspection = async () => {
      if (!tokens) return
      
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/inspections/fire-alarm/${params.id}/`,
          {
            headers: { Authorization: `Bearer ${tokens.access}` },
          }
        )
        setInspection(res.data)
        
        // Set form data
        setFormData({
          location: res.data.inspection.location || "",
          client_name: res.data.inspection.client_name || "",
          point_checked: res.data.point_checked || "",
          alarm_functional: res.data.alarm_functional || false,
          call_points_accessible: res.data.call_points_accessible || false,
          emergency_lights_working: res.data.emergency_lights_working || false,
          faults_identified_details: res.data.faults_identified_details || "",
          action_taken_details: res.data.action_taken_details || "",
          management_book_initials: res.data.management_book_initials || "",
          comments: res.data.comments || "",
          inspection_date: res.data.inspection.inspection_date 
            ? res.data.inspection.inspection_date.split('T')[0] // Format date for input
            : new Date().toISOString().split('T')[0],
        })
      } catch (err) {
        console.error("Failed to fetch inspection details:", err)
        toast.error("Failed to load inspection details")
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [params.id, tokens])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokens || !inspection) return

    setSaving(true)
    try {
      // Prepare data for API
      const updateData = {
        location: formData.location,
        client_name: formData.client_name,
        point_checked: formData.point_checked,
        alarm_functional: formData.alarm_functional,
        call_points_accessible: formData.call_points_accessible,
        emergency_lights_working: formData.emergency_lights_working,
        faults_identified_details: formData.faults_identified_details,
        action_taken_details: formData.action_taken_details,
        management_book_initials: formData.management_book_initials,
        comments: formData.comments,
        inspection_date: formData.inspection_date,
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/inspections/fire-alarm/${params.id}/`,
        updateData,
        {
          headers: { Authorization: `Bearer ${tokens.access}` },
        }
      )

      toast.success("Inspection updated successfully")
      router.push(`/admin/inspections/fire-alarm/${params.id}/details`)
    } catch (err) {
      console.error("Failed to update inspection:", err)
      toast.error("Failed to update inspection")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading inspection details...</p>
        </div>
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Inspection Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested inspection could not be found.</p>
          <Button asChild>
            <Link href="/inspections/fire-alarm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inspections
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href={`/inspections/fire-alarm/${params.id}/details`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Edit Fire Alarm Inspection</h1>
          <p className="text-muted-foreground">Inspection ID: #{inspection.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-emerald-700">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspection_date">Inspection Date *</Label>
                <Input
                  id="inspection_date"
                  name="inspection_date"
                  type="date"
                  value={formData.inspection_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="point_checked">Point Checked</Label>
                <Input
                  id="point_checked"
                  name="point_checked"
                  value={formData.point_checked}
                  onChange={handleInputChange}
                  placeholder="Enter point checked"
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-emerald-700">Test Results</CardTitle>
              <CardDescription>Select the tests that were performed successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alarm_functional"
                    checked={formData.alarm_functional}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("alarm_functional", checked as boolean)
                    }
                  />
                  <Label htmlFor="alarm_functional" className="cursor-pointer">
                    Alarm Functional
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="call_points_accessible"
                    checked={formData.call_points_accessible}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("call_points_accessible", checked as boolean)
                    }
                  />
                  <Label htmlFor="call_points_accessible" className="cursor-pointer">
                    Call Points Accessible
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergency_lights_working"
                    checked={formData.emergency_lights_working}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("emergency_lights_working", checked as boolean)
                    }
                  />
                  <Label htmlFor="emergency_lights_working" className="cursor-pointer">
                    Emergency Lights Working
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faults_identified_details">Faults Identified</Label>
                <Textarea
                  id="faults_identified_details"
                  name="faults_identified_details"
                  value={formData.faults_identified_details}
                  onChange={handleInputChange}
                  placeholder="Describe any faults identified..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action_taken_details">Action Taken</Label>
                <Textarea
                  id="action_taken_details"
                  name="action_taken_details"
                  value={formData.action_taken_details}
                  onChange={handleInputChange}
                  placeholder="Describe actions taken to address faults..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="management_book_initials">Management Book Initials</Label>
                <Input
                  id="management_book_initials"
                  name="management_book_initials"
                  value={formData.management_book_initials}
                  onChange={handleInputChange}
                  placeholder="Enter initials"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Any additional comments..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/inspections/fire-alarm/${params.id}/details`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
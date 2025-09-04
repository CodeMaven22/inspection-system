// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useParams } from "next/navigation"
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
//   Edit,
//   Calendar,
//   User,
//   Building,
//   MapPin,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   FileText,
//   AlertTriangle,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
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

// export default function FireAlarmInspectionDetailPage() {
//   const params = useParams()
//   const { tokens } = useAuth()
//   const [inspection, setInspection] = useState<FireAlarmInspectionDetail | null>(null)
//   const [loading, setLoading] = useState(true)

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
//       } catch (err) {
//         console.error("Failed to fetch inspection details:", err)
//         toast.error("Failed to load inspection details")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInspection()
//   }, [params.id, tokens])

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
//       case "approved":
//         return <Badge className="bg-emerald-600 text-white flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>
//       case "completed":
//         return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
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
//           <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-emerald-700 mb-2">Inspection Not Found</h2>
//           <p className="text-muted-foreground mb-4">The requested inspection could not be found.</p>
//           <Button asChild>
//             <Link href="/inspections/fire-alarm">
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
//           <Link href="/admin/inspections/fire-alarm">
//             <ArrowLeft className="h-4 w-4" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Fire Alarm Inspection Details</h1>
//           <p className="text-muted-foreground">Inspection ID: {inspection.id}</p>
//         </div>
//         <div className="ml-auto">
//           <Button asChild>
//             <Link href={`/inspections/fire-alarm/${params.id}/edit`}>
//               <Edit className="mr-2 h-4 w-4" />
//               Edit Inspection
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Inspection Info */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-emerald-700">Inspection Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <Calendar className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Inspection Date</p>
//                 <p className="font-medium">
//                   {new Date(inspection.inspection.inspection_date).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <User className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Created By</p>
//                 <p className="font-medium">{inspection.inspection.created_by_name}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <Building className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Client</p>
//                 <p className="font-medium">{inspection.inspection.client_name}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <MapPin className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Location</p>
//                 <p className="font-medium">{inspection.inspection.location}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <FileText className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Status</p>
//                 <div className="font-medium">{getStatusBadge(inspection.inspection.status)}</div>
//               </div>
//             </div>

//             {inspection.inspection.approved_by_name && (
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-full">
//                   <User className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Approved By</p>
//                   <p className="font-medium">{inspection.inspection.approved_by_name}</p>
//                   {inspection.inspection.approval_date && (
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(inspection.inspection.approval_date).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Inspection Details */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-emerald-700">Inspection Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <h3 className="font-medium mb-3">System Type</h3>
//               <p className="text-muted-foreground">{inspection.system_type || "Not specified"}</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex items-center gap-2">
//                 {inspection.control_panel_test ? (
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <span>Control Panel Test</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {inspection.battery_test ? (
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <span>Battery Test</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {inspection.visual_inspection ? (
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <span>Visual Inspection</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {inspection.functional_test ? (
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <span>Functional Test</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {inspection.alarm_test ? (
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <span>Alarm Test</span>
//               </div>
//             </div>

//             {inspection.issues_found && (
//               <div>
//                 <h3 className="font-medium mb-3">Issues Found</h3>
//                 <p className="text-muted-foreground">{inspection.issues_found}</p>
//               </div>
//             )}

//             {inspection.corrective_actions && (
//               <div>
//                 <h3 className="font-medium mb-3">Corrective Actions</h3>
//                 <p className="text-muted-foreground">{inspection.corrective_actions}</p>
//               </div>
//             )}

//             {inspection.notes && (
//               <div>
//                 <h3 className="font-medium mb-3">Notes</h3>
//                 <p className="text-muted-foreground">{inspection.notes}</p>
//               </div>
//             )}

//             <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
//               <div>
//                 <p>Created: {new Date(inspection.created_at).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p>Last updated: {new Date(inspection.updated_at).toLocaleString()}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Loader2,
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Building,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Check,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRoleGuard } from "@/hooks/useRoleGuard"
import { toast } from "sonner"
import api from "@/lib/api-client"

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

export default function FireAlarmInspectionDetailPage() {
  useRoleGuard(["admin", "team_leader", "inspector"])
  
  const params = useParams()
  const [inspection, setInspection] = useState<FireAlarmInspectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res = await api.get(`inspections/fire-alarm/${params.id}/`)
        setInspection(res.data)
      } catch (err: any) {
        console.error("Failed to fetch inspection details:", err)
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           "Failed to load inspection details. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
      case "approved":
        return <Badge className="bg-emerald-600 text-white flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>
      case "completed":
        return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getBooleanIcon = (value: boolean | null) => {
    if (value === null) return <span className="text-muted-foreground">Not specified</span>
    return value ? <Check className="h-5 w-5 text-emerald-600" /> : <X className="h-5 w-5 text-red-500" />
  }

  const getBooleanText = (value: boolean | null) => {
    if (value === null) return "Not specified"
    return value ? "Yes" : "No"
  }

  const retryFetch = () => {
    setError(null)
    setLoading(true)
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

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Inspection</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={retryFetch} variant="default">
              <Loader2 className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/inspections/fire-alarm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inspections
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Inspection Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested inspection could not be found.</p>
          <Button asChild>
            <Link href="/admin/inspections/fire-alarm">
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
          <Link href="/admin/inspections/fire-alarm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Fire Alarm Inspection Details</h1>
          <p className="text-muted-foreground">Inspection ID: #{inspection.id}</p>
        </div>
        <div className="ml-auto">
          <Button asChild>
            <Link href={`/admin/inspections/fire-alarm/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Inspection
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-emerald-700">Inspection Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inspection Date</p>
                <p className="font-medium">
                  {inspection.inspection.inspection_date 
                    ? new Date(inspection.inspection.inspection_date).toLocaleDateString()
                    : "Not specified"
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{inspection.inspection.created_by_name}</p>
                <p className="text-xs text-muted-foreground">({inspection.inspection.submitted_by_role})</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Building className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{inspection.inspection.client_name || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{inspection.inspection.location || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="font-medium">{getStatusBadge(inspection.inspection.status)}</div>
              </div>
            </div>

            {inspection.inspection.approved_by_name && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved By</p>
                  <p className="font-medium">{inspection.inspection.approved_by_name}</p>
                  {inspection.inspection.approval_date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(inspection.inspection.approval_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inspection Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-emerald-700">Inspection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Point Checked</h3>
              <p className="text-muted-foreground">{inspection.point_checked || "Not specified"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {getBooleanIcon(inspection.alarm_functional)}
                <span>Alarm Functional: {getBooleanText(inspection.alarm_functional)}</span>
              </div>

              <div className="flex items-center gap-2">
                {getBooleanIcon(inspection.call_points_accessible)}
                <span>Call Points Accessible: {getBooleanText(inspection.call_points_accessible)}</span>
              </div>

              <div className="flex items-center gap-2">
                {getBooleanIcon(inspection.emergency_lights_working)}
                <span>Emergency Lights Working: {getBooleanText(inspection.emergency_lights_working)}</span>
              </div>
            </div>

            {inspection.faults_identified_details && (
              <div>
                <h3 className="font-medium mb-3">Faults Identified</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{inspection.faults_identified_details}</p>
              </div>
            )}

            {inspection.action_taken_details && (
              <div>
                <h3 className="font-medium mb-3">Action Taken</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{inspection.action_taken_details}</p>
              </div>
            )}

            {inspection.management_book_initials && (
              <div>
                <h3 className="font-medium mb-3">Management Book Initials</h3>
                <p className="text-muted-foreground">{inspection.management_book_initials}</p>
              </div>
            )}

            {inspection.comments && (
              <div>
                <h3 className="font-medium mb-3">Comments</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{inspection.comments}</p>
              </div>
            )}

            {inspection.inspection.inspection_comments && (
              <div>
                <h3 className="font-medium mb-3">Inspection Comments</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{inspection.inspection.inspection_comments}</p>
              </div>
            )}

            {inspection.inspection.approval_comments && (
              <div>
                <h3 className="font-medium mb-3">Approval Comments</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{inspection.inspection.approval_comments}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
              <div>
                <p>Created: {new Date(inspection.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p>Last updated: {new Date(inspection.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useParams } from "next/navigation"
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
//   Edit,
//   Calendar,
//   User,
//   Building,
//   MapPin,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   FileText,
//   AlertTriangle,
//   Check,
//   X,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "sonner"
// import axios from "axios"

// interface FireAlarmInspectionDetail {
//   id: number
//   inspection: {
//     id: number
//     inspection_type: string
//     location: string
//     client_name: string
//     status: string
//     created_by: number
//     created_by_name: string
//     submitted_by_role: string
//     inspection_conducted_by: number | null
//     inspection_comments: string | null
//     inspection_date: string | null
//     approved_by: number | null
//     approved_by_name: string | null
//     approval_comments: string | null
//     approval_date: string | null
//     created_at: string
//   }
//   point_checked: string | null
//   alarm_functional: boolean | null
//   call_points_accessible: boolean | null
//   emergency_lights_working: boolean | null
//   faults_identified_details: string | null
//   action_taken_details: string | null
//   management_book_initials: string | null
//   comments: string | null
//   is_active: boolean
//   created_at: string
//   updated_at: string
// }

// export default function FireAlarmInspectionDetailPage() {
//   const params = useParams()
//   const { tokens } = useAuth()
//   const [inspection, setInspection] = useState<FireAlarmInspectionDetail | null>(null)
//   const [loading, setLoading] = useState(true)

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
//       } catch (err) {
//         console.error("Failed to fetch inspection details:", err)
//         toast.error("Failed to load inspection details")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInspection()
//   }, [params.id, tokens])

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
//       case "approved":
//         return <Badge className="bg-emerald-600 text-white flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>
//       case "completed":
//         return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const getBooleanIcon = (value: boolean | null) => {
//     if (value === null) return <span className="text-muted-foreground">Not specified</span>
//     return value ? <Check className="h-5 w-5 text-emerald-600" /> : <X className="h-5 w-5 text-red-500" />
//   }

//   const getBooleanText = (value: boolean | null) => {
//     if (value === null) return "Not specified"
//     return value ? "Yes" : "No"
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
//           <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
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
//           <Link href="/admin/inspections/fire-alarm">
//             <ArrowLeft className="h-4 w-4" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Fire Alarm Inspection Details</h1>
//           <p className="text-muted-foreground">Inspection ID: #{inspection.id}</p>
//         </div>
//         <div className="ml-auto">
//           <Button asChild>
//             <Link href={`/admin/inspections/fire-alarm/${params.id}/edit`}>
//               <Edit className="mr-2 h-4 w-4" />
//               Edit Inspection
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Inspection Info */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-emerald-700">Inspection Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <Calendar className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Inspection Date</p>
//                 <p className="font-medium">
//                   {inspection.inspection.inspection_date 
//                     ? new Date(inspection.inspection.inspection_date).toLocaleDateString()
//                     : "Not specified"
//                   }
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <User className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Created By</p>
//                 <p className="font-medium">{inspection.inspection.created_by_name}</p>
//                 <p className="text-xs text-muted-foreground">({inspection.inspection.submitted_by_role})</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <Building className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Client</p>
//                 <p className="font-medium">{inspection.inspection.client_name || "Not specified"}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <MapPin className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Location</p>
//                 <p className="font-medium">{inspection.inspection.location || "Not specified"}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-full">
//                 <FileText className="h-5 w-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Status</p>
//                 <div className="font-medium">{getStatusBadge(inspection.inspection.status)}</div>
//               </div>
//             </div>

//             {inspection.inspection.approved_by_name && (
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-full">
//                   <User className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Approved By</p>
//                   <p className="font-medium">{inspection.inspection.approved_by_name}</p>
//                   {inspection.inspection.approval_date && (
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(inspection.inspection.approval_date).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Inspection Details */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-emerald-700">Inspection Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <h3 className="font-medium mb-3">Point Checked</h3>
//               <p className="text-muted-foreground">{inspection.point_checked || "Not specified"}</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex items-center gap-2">
//                 {getBooleanIcon(inspection.alarm_functional)}
//                 <span>Alarm Functional: {getBooleanText(inspection.alarm_functional)}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {getBooleanIcon(inspection.call_points_accessible)}
//                 <span>Call Points Accessible: {getBooleanText(inspection.call_points_accessible)}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {getBooleanIcon(inspection.emergency_lights_working)}
//                 <span>Emergency Lights Working: {getBooleanText(inspection.emergency_lights_working)}</span>
//               </div>
//             </div>

//             {inspection.faults_identified_details && (
//               <div>
//                 <h3 className="font-medium mb-3">Faults Identified</h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{inspection.faults_identified_details}</p>
//               </div>
//             )}

//             {inspection.action_taken_details && (
//               <div>
//                 <h3 className="font-medium mb-3">Action Taken</h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{inspection.action_taken_details}</p>
//               </div>
//             )}

//             {inspection.management_book_initials && (
//               <div>
//                 <h3 className="font-medium mb-3">Management Book Initials</h3>
//                 <p className="text-muted-foreground">{inspection.management_book_initials}</p>
//               </div>
//             )}

//             {inspection.comments && (
//               <div>
//                 <h3 className="font-medium mb-3">Comments</h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{inspection.comments}</p>
//               </div>
//             )}

//             {inspection.inspection.inspection_comments && (
//               <div>
//                 <h3 className="font-medium mb-3">Inspection Comments</h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{inspection.inspection.inspection_comments}</p>
//               </div>
//             )}

//             {inspection.inspection.approval_comments && (
//               <div>
//                 <h3 className="font-medium mb-3">Approval Comments</h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{inspection.inspection.approval_comments}</p>
//               </div>
//             )}

//             <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
//               <div>
//                 <p>Created: {new Date(inspection.created_at).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p>Last updated: {new Date(inspection.updated_at).toLocaleString()}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
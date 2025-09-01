// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   MoreHorizontal,
//   PlusCircle,
//   Loader2,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { Inspection, InspectionStatus, InspectionType } from "@/types/inspection"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"

// export default function AdminInspectionsPage() {
//   const [inspections, setInspections] = useState<Inspection[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterType, setFilterType] = useState<InspectionType | "all">("all")
//   const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
//   const { user } = useAuth()

//   useEffect(() => {
//     const fetchInspections = async () => {
//       setLoading(true)
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       const mockInspections: Inspection[] = [/* your existing mock data */]
//       setInspections(mockInspections)
//       setLoading(false)
//     }
//     fetchInspections()
//   }, [])

//   const filteredInspections = inspections.filter((inspection) => {
//     const matchesSearch =
//       inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inspection.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inspection.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (inspection.data as any).client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (inspection.data as any).location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (inspection.data as any).worker_name?.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesType = filterType === "all" || inspection.type === filterType
//     const matchesStatus = filterStatus === "all" || inspection.status === filterStatus

//     return matchesSearch && matchesType && matchesStatus
//   })

//   const handleApprove = (id: string) => {
//     setInspections((prev) =>
//       prev.map((insp) =>
//         insp.id === id
//           ? {
//               ...insp,
//               status: "approved",
//               approval_status: "approved",
//               approved_by: user?.first_name + " " + user?.last_name || "Admin",
//               approval_date: new Date().toISOString(),
//               approval_comments: "Approved by admin.",
//             }
//           : insp
//       )
//     )
//     toast.success(`Inspection ${id} approved`)
//   }

//   const handleReject = (id: string) => {
//     setInspections((prev) =>
//       prev.map((insp) =>
//         insp.id === id
//           ? {
//               ...insp,
//               status: "rejected",
//               approval_status: "rejected",
//               approved_by: user?.first_name + " " + user?.last_name || "Admin",
//               approval_date: new Date().toISOString(),
//               approval_comments: "Rejected by admin.",
//             }
//           : insp
//       )
//     )
//     toast.error(`Inspection ${id} rejected`)
//   }

//   const getStatusBadge = (status: InspectionStatus) => {
//     switch (status) {
//       case "pending":
//         return <Badge className="bg-yellow-400 text-white">Pending</Badge>
//       case "approved":
//         return <Badge className="bg-emerald-600 text-white">Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500 text-white">Rejected</Badge>
//       case "completed":
//         return <Badge variant="outline">Completed</Badge>
//       case "draft":
//         return <Badge variant="outline">Draft</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Inspections</h1>
//         <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
//           <Link href="/admin/inspections/new">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             New Inspection
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-emerald-700">All Inspections</CardTitle>
//           <CardDescription>View and manage inspections with filters and actions.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
//             <Input
//               placeholder="Search inspections..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full md:max-w-sm"
//             />
//             <Select value={filterType} onValueChange={(value) => setFilterType(value as InspectionType | "all")}>
//               <SelectTrigger className="w-full md:w-[200px]">
//                 <SelectValue placeholder="Filter by type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="medication_audit_comprehensive">Medication Audit (Comprehensive)</SelectItem>
//                 <SelectItem value="weekly_medication_audit">Weekly Medication Audit</SelectItem>
//                 <SelectItem value="fire_alarm_weekly">Fire Alarm (Weekly)</SelectItem>
//                 <SelectItem value="smoke_alarm_weekly">Smoke Alarm (Weekly)</SelectItem>
//                 <SelectItem value="worker_inspection">Worker Inspection</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InspectionStatus | "all")}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="approved">Approved</SelectItem>
//                 <SelectItem value="rejected">Rejected</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//                 <SelectItem value="draft">Draft</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader className="bg-muted text-emerald-800">
//                 <TableRow>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Created By</TableHead>
//                   <TableHead>Created At</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredInspections.length > 0 ? (
//                   filteredInspections.map((inspection) => (
//                     <TableRow key={inspection.id}>
//                       <TableCell className="font-medium">{inspection.id}</TableCell>
//                       <TableCell className="capitalize">{inspection.type.replace(/_/g, " ")}</TableCell>
//                       <TableCell>{getStatusBadge(inspection.status)}</TableCell>
//                       <TableCell>{inspection.created_by}</TableCell>
//                       <TableCell>{new Date(inspection.created_at).toLocaleDateString()}</TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button size="icon" variant="ghost">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem>View Details</DropdownMenuItem>
//                             {inspection.status === "pending" &&
//                               (user?.role === "admin" || user?.role === "team_leader") && (
//                                 <>
//                                   <DropdownMenuItem onClick={() => handleApprove(inspection.id)}>
//                                     <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
//                                     Approve
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem onClick={() => handleReject(inspection.id)}>
//                                     <XCircle className="mr-2 h-4 w-4 text-red-500" />
//                                     Reject
//                                   </DropdownMenuItem>
//                                 </>
//                               )}
//                             <DropdownMenuItem>Edit</DropdownMenuItem>
//                             <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
//                       No inspections found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  PlusCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Inspection, InspectionStatus, InspectionType } from "@/types/inspection"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function AdminInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<InspectionType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
  const { user, tokens } = useAuth()   // ✅ get tokens for auth

  useEffect(() => {
    const fetchInspections = async () => {
      if (!tokens) return
      setLoading(true)
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/inspections/fire-alarm/", {
          headers: { Authorization: `Bearer ${tokens.access}` },
        })

        // API returns an array of FireAlarmWeeklyInspection with embedded inspection object
        const mapped = res.data.map((item: any) => ({
          id: item.id.toString(),
          type: item.inspection.inspection_type,
          status: item.inspection.status,
          created_by: item.inspection.created_by.toString(), // could map to name if backend includes it
          created_at: item.inspection.inspection_date || item.inspection.created_at,
          data: {
            client_name: item.inspection.client_name,
            location: item.inspection.location,
          }
        }))
        setInspections(mapped)
      } catch (err) {
        console.error("Failed to fetch inspections:", err)
        toast.error("Failed to load inspections")
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [tokens])

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.data as any).client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.data as any).location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || inspection.type === filterType
    const matchesStatus = filterStatus === "all" || inspection.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleApprove = (id: string) => {
    setInspections((prev) =>
      prev.map((insp) =>
        insp.id === id
          ? {
              ...insp,
              status: "approved",
              approved_by: user?.first_name + " " + user?.last_name || "Admin",
              approval_date: new Date().toISOString(),
            }
          : insp
      )
    )
    toast.success(`Inspection ${id} approved`)
  }

  const handleReject = (id: string) => {
    setInspections((prev) =>
      prev.map((insp) =>
        insp.id === id
          ? {
              ...insp,
              status: "rejected",
              approved_by: user?.first_name + " " + user?.last_name || "Admin",
              approval_date: new Date().toISOString(),
            }
          : insp
      )
    )
    toast.error(`Inspection ${id} rejected`)
  }

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-white">Pending</Badge>
      case "approved":
        return <Badge className="bg-emerald-600 text-white">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Inspections</h1>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/admin/inspections/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Inspection
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">All Inspections</CardTitle>
          <CardDescription>View and manage inspections with filters and actions.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <Input
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-sm"
            />
            <Select value={filterType} onValueChange={(value) => setFilterType(value as InspectionType | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medication_audit_comprehensive">Medication Audit (Comprehensive)</SelectItem>
                <SelectItem value="weekly_medication_audit">Weekly Medication Audit</SelectItem>
                <SelectItem value="fire_alarm_weekly">Fire Alarm (Weekly)</SelectItem>
                <SelectItem value="smoke_alarm_weekly">Smoke Alarm (Weekly)</SelectItem>
                <SelectItem value="worker_inspection">Worker Inspection</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InspectionStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted text-emerald-800">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.length > 0 ? (
                  filteredInspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">{inspection.id}</TableCell>
                      <TableCell className="capitalize">{inspection.type.replace(/_/g, " ")}</TableCell>
                      <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                      <TableCell>{(inspection.data as any).client_name}</TableCell>
                      <TableCell>{(inspection.data as any).location}</TableCell>
                      <TableCell>{inspection.created_by}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {inspection.status === "pending" &&
                              (user?.role === "admin" || user?.role === "team_leader") && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(inspection.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(inspection.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No inspections found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

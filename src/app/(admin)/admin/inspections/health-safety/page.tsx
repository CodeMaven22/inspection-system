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
//   Filter,
//   BarChart3,
//   PieChart,
//   Download,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Calendar,
//   User,
//   Building,
//   BadgeCheck,
//   X,
//   RefreshCw,
//   Eye,
//   Edit,
//   Trash2,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import axios from "axios"
// import { Pie, Bar } from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// )

// interface HealthSafetyInspection {
//   id: string
//   type: string
//   status: string
//   created_by: string
//   created_at: string
//   data: {
//     client_name: string
//     location: string
//   }
// }

// type InspectionStatus = "pending" | "approved" | "rejected" | "completed"

// export default function HealthSafetyInspectionsPage() {
//   const [inspections, setInspections] = useState<HealthSafetyInspection[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
//   const [filterClient, setFilterClient] = useState("")
//   const [filterLocation, setFilterLocation] = useState("")
//   const [filterCreatedBy, setFilterCreatedBy] = useState("")
//   const { user, tokens } = useAuth()
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)

//   useEffect(() => {
//     const fetchInspections = async () => {
//       if (!tokens) return
//       setLoading(true)
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/inspections/health-safety/", {
//           headers: { Authorization: `Bearer ${tokens.access}` },
//         })

//         // API returns an array of HealthSafetyChecklist with embedded inspection object
//         const mapped = res.data.map((item: any) => ({
//           id: item.id.toString(),
//           type: "health_safety",
//           status: item.inspection.status,
//           created_by: item.inspection.created_by_name || item.inspection.created_by.toString(),
//           created_at: item.inspection.inspection_date || item.inspection.created_at,
//           data: {
//             client_name: item.inspection.client_name,
//             location: item.inspection.location,
//           }
//         }))
//         setInspections(mapped)
//       } catch (err) {
//         console.error("Failed to fetch health & safety inspections:", err)
//         toast.error("Failed to load health & safety inspections")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInspections()
//   }, [tokens])

//   const filteredInspections = inspections.filter((inspection) => {
//     const matchesStatus = filterStatus === "all" || inspection.status === filterStatus
//     const matchesClient = !filterClient || inspection.data.client_name?.toLowerCase().includes(filterClient.toLowerCase())
//     const matchesLocation = !filterLocation || inspection.data.location?.toLowerCase().includes(filterLocation.toLowerCase())
//     const matchesCreatedBy = !filterCreatedBy || inspection.created_by.toLowerCase().includes(filterCreatedBy.toLowerCase())

//     return matchesStatus && matchesClient && matchesLocation && matchesCreatedBy
//   })

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredInspections.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   // Prepare data for charts
//   const statusData = {
//     labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
//     datasets: [
//       {
//         data: [
//           inspections.filter(i => i.status === 'pending').length,
//           inspections.filter(i => i.status === 'approved').length,
//           inspections.filter(i => i.status === 'rejected').length,
//           inspections.filter(i => i.status === 'completed').length,
//         ],
//         backgroundColor: ['#fbbf24', '#059669', '#ef4444', '#6b7280'],
//         borderWidth: 0,
//       },
//     ],
//   }

//   // Group inspections by creator
//   const inspectionsByCreator = inspections.reduce((acc, inspection) => {
//     const creator = inspection.created_by;
//     acc[creator] = (acc[creator] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const creatorData = {
//     labels: Object.keys(inspectionsByCreator),
//     datasets: [
//       {
//         label: 'Inspections Conducted',
//         data: Object.values(inspectionsByCreator),
//         backgroundColor: '#3b82f6',
//         borderRadius: 4,
//       },
//     ],
//   }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom' as const,
//       },
//     },
//   }

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1,
//         },
//       },
//     },
//   }

//   const handleApprove = async (id: string) => {
//     try {
//       if (!tokens) return
      
//       await axios.patch(`http://127.0.0.1:8000/api/inspections/health-safety/${id}/`, {
//         status: "approved",
//         approved_by: user?.id
//       }, {
//         headers: { Authorization: `Bearer ${tokens.access}` },
//       })

//       setInspections((prev) =>
//         prev.map((insp) =>
//           insp.id === id
//             ? {
//                 ...insp,
//                 status: "approved",
//                 approved_by: user?.first_name + " " + user?.last_name || "Admin",
//                 approval_date: new Date().toISOString(),
//               }
//             : insp
//         )
//       )
//       toast.success(`Health & safety inspection ${id} approved`)
//     } catch (err) {
//       console.error("Failed to approve inspection:", err)
//       toast.error("Failed to approve inspection")
//     }
//   }

//   const handleReject = async (id: string) => {
//     try {
//       if (!tokens) return
      
//       await axios.patch(`http://127.0.0.1:8000/api/inspections/health-safety/${id}/`, {
//         status: "rejected",
//         approved_by: user?.id
//       }, {
//         headers: { Authorization: `Bearer ${tokens.access}` },
//       })

//       setInspections((prev) =>
//         prev.map((insp) =>
//           insp.id === id
//             ? {
//                 ...insp,
//                 status: "rejected",
//                 approved_by: user?.first_name + " " + user?.last_name || "Admin",
//                 approval_date: new Date().toISOString(),
//               }
//             : insp
//         )
//       )
//       toast.error(`Health & safety inspection ${id} rejected`)
//     } catch (err) {
//       console.error("Failed to reject inspection:", err)
//       toast.error("Failed to reject inspection")
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       if (!tokens) return
      
//       await axios.delete(`http://127.0.0.1:8000/api/inspections/health-safety/${id}/`, {
//         headers: { Authorization: `Bearer ${tokens.access}` },
//       })

//       setInspections((prev) => prev.filter((insp) => insp.id !== id))
//       toast.success(`Health & safety inspection ${id} deleted`)
//     } catch (err) {
//       console.error("Failed to delete inspection:", err)
//       toast.error("Failed to delete inspection")
//     }
//   }

//   const getStatusBadge = (status: InspectionStatus) => {
//     switch (status) {
//       case "pending":
//         return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Pending</Badge>
//       case "approved":
//         return <Badge className="bg-emerald-600 text-white flex items-center w-min gap-1"><BadgeCheck className="h-3 w-3" /> Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><X className="h-3 w-3" /> Rejected</Badge>
//       case "completed":
//         return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const clearFilters = () => {
//     setFilterStatus("all")
//     setFilterClient("")
//     setFilterLocation("")
//     setFilterCreatedBy("")
//     setCurrentPage(1) // Reset to first page when clearing filters
//     toast.success("Filters cleared")
//   }

//   const handleExport = () => {
//     // Simple export functionality - you can enhance this with CSV or Excel export
//     const dataStr = JSON.stringify(filteredInspections, null, 2)
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
//     const exportFileDefaultName = 'health-safety-inspections.json'
    
//     const linkElement = document.createElement('a')
//     linkElement.setAttribute('href', dataUri)
//     linkElement.setAttribute('download', exportFileDefaultName)
//     linkElement.click()
    
//     toast.success("Export started successfully")
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//           <p className="text-muted-foreground">Loading health & safety inspections...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Health & Safety Inspections</h1>
//           <p className="text-muted-foreground">Manage and review all health & safety inspections</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Export
//           </Button>
//           <Button asChild className="bg-blue-600 hover:bg-blue-700">
//             <Link href="health-safety/new">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               New Health & Safety Inspection
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="border-blue-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
//               <PieChart className="h-5 w-5" />
//               Inspection Status Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Pie data={statusData} options={chartOptions} />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-blue-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
//               <BarChart3 className="h-5 w-5" />
//               Inspections by Creator
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Bar data={creatorData} options={barChartOptions} />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-blue-100">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <CardTitle className="text-blue-700">Health & Safety Inspection List</CardTitle>
//               <CardDescription>View and manage health & safety inspections with advanced filters</CardDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} found
//               </span>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={() => {
//                   setShowAdvancedFilters(!showAdvancedFilters)
//                 }}
//                 className="h-8 w-8"
//               >
//                 <Filter className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <div className="flex flex-col gap-4 mb-6">
//             <div className="flex flex-col md:flex-row md:items-center gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search inspections..."
//                   className="pl-9"
//                   value={filterClient}
//                   onChange={(e) => setFilterClient(e.target.value)}
//                 />
//               </div>
              
//               <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InspectionStatus | "all")}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <div className="flex items-center gap-2">
//                     <BadgeCheck className="h-4 w-4 text-muted-foreground" />
//                     <SelectValue placeholder="Filter by status" />
//                   </div>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
              
//               <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
//                 <RefreshCw className="h-4 w-4" />
//                 Clear
//               </Button>
//             </div>

//             {/* Advanced Filters - Collapsible */}
//             {showAdvancedFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Building className="h-4 w-4" />
//                     Client
//                   </label>
//                   <Input
//                     placeholder="Filter by client"
//                     value={filterClient}
//                     onChange={(e) => setFilterClient(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Location
//                   </label>
//                   <Input
//                     placeholder="Filter by location"
//                     value={filterLocation}
//                     onChange={(e) => setFilterLocation(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Created By
//                   </label>
//                   <Input
//                     placeholder="Filter by creator"
//                     value={filterCreatedBy}
//                     onChange={(e) => setFilterCreatedBy(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           <div className="rounded-md border border-blue-100 overflow-hidden">
//             <Table>
//               <TableHeader className="bg-blue-50 text-blue-800">
//                 <TableRow>
//                   <TableHead className="font-semibold">ID</TableHead>
//                   <TableHead className="font-semibold">Client Name</TableHead>
//                   <TableHead className="font-semibold">Location</TableHead>
//                   <TableHead className="font-semibold">Status</TableHead>
//                   <TableHead className="font-semibold">Created By</TableHead>
//                   <TableHead className="font-semibold">Date</TableHead>
//                   <TableHead className="text-right font-semibold">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((inspection) => (
//                     <TableRow key={inspection.id} className="hover:bg-blue-50/30 transition-colors">
//                       <TableCell className="font-medium">#{inspection.id}</TableCell>
//                       <TableCell>{inspection.data.client_name || "N/A"}</TableCell>
//                       <TableCell>{inspection.data.location || "N/A"}</TableCell>
//                       <TableCell>{getStatusBadge(inspection.status as InspectionStatus)}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 text-muted-foreground" />
//                           {inspection.created_by}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           {new Date(inspection.created_at).toLocaleDateString()}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button size="icon" variant="ghost" className="h-8 w-8">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="w-48">
//                             <DropdownMenuItem asChild>
//                               <Link href={`/inspections/health-safety/${inspection.id}/details`} className="flex items-center gap-2 cursor-pointer">
//                                 <Eye className="h-4 w-4" />
//                                 View Details
//                               </Link>
//                             </DropdownMenuItem>
//                             {inspection.status === "pending" &&
//                               (user?.role === "admin" || user?.role === "team_leader") && (
//                                 <>
//                                   <DropdownMenuItem 
//                                     onClick={() => handleApprove(inspection.id)}
//                                     className="flex items-center gap-2 text-emerald-600"
//                                   >
//                                     <CheckCircle2 className="h-4 w-4" />
//                                     Approve
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem 
//                                     onClick={() => handleReject(inspection.id)}
//                                     className="flex items-center gap-2 text-red-600"
//                                   >
//                                     <XCircle className="h-4 w-4" />
//                                     Reject
//                                   </DropdownMenuItem>
//                                 </>
//                               )}
//                             <DropdownMenuItem asChild>
//                               <Link href={`/inspections/health-safety/${inspection.id}/edit`} className="flex items-center gap-2 cursor-pointer">
//                                 <Edit className="h-4 w-4" />
//                                 Edit
//                               </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem 
//                               onClick={() => handleDelete(inspection.id)}
//                               className="flex items-center gap-2 text-red-600"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2">
//                         <Filter className="h-8 w-8" />
//                         <p>No health & safety inspections found.</p>
//                         <Button variant="outline" onClick={clearFilters} className="mt-2">
//                           Clear filters
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>





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
// import { useRoleGuard } from "@/hooks/useRoleGuard"
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
//   Filter,
//   BarChart3,
//   PieChart,
//   Download,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Calendar,
//   User,
//   Building,
//   BadgeCheck,
//   X,
//   RefreshCw,
//   Eye,
//   Edit,
//   Trash2,
//   AlertCircle,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import api from "@/lib/api-client"
// import { Pie, Bar } from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// )

// interface HealthSafetyInspection {
//   id: string
//   type: string
//   status: string
//   created_by: string
//   created_at: string
//   data: {
//     client_name: string
//     location: string
//   }
// }

// type InspectionStatus = "pending" | "approved" | "rejected" | "completed"

// export default function HealthSafetyInspectionsPage() {
//   useRoleGuard(["admin", "team_leader", "inspector"])

//   const [inspections, setInspections] = useState<HealthSafetyInspection[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
//   const [filterClient, setFilterClient] = useState("")
//   const [filterLocation, setFilterLocation] = useState("")
//   const [filterCreatedBy, setFilterCreatedBy] = useState("")
//   const { user } = useAuth()
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)

//   useEffect(() => {
//     const fetchInspections = async () => {
//       try {
//         setLoading(true)
//         setError(null)
        
//         const response = await api.get("inspections/health-safety/")
        
//         const mapped = response.data.map((item: any) => ({
//           id: item.id.toString(),
//           type: "health_safety",
//           status: item.inspection.status,
//           created_by: item.inspection.created_by_name || item.inspection.created_by.toString(),
//           created_at: item.inspection.inspection_date || item.inspection.created_at,
//           data: {
//             client_name: item.inspection.client_name,
//             location: item.inspection.location,
//           }
//         }))
        
//         setInspections(mapped)
//       } catch (err: any) {
//         console.error("Failed to fetch health & safety inspections:", err)
//         const errorMessage = err.response?.data?.detail || 
//                            err.response?.data?.message || 
//                            "Failed to load health & safety inspections. Please try again."
//         setError(errorMessage)
//         toast.error(errorMessage)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInspections()
//   }, [])

//   const filteredInspections = inspections.filter((inspection) => {
//     const matchesStatus = filterStatus === "all" || inspection.status === filterStatus
//     const matchesClient = !filterClient || inspection.data.client_name?.toLowerCase().includes(filterClient.toLowerCase())
//     const matchesLocation = !filterLocation || inspection.data.location?.toLowerCase().includes(filterLocation.toLowerCase())
//     const matchesCreatedBy = !filterCreatedBy || inspection.created_by.toLowerCase().includes(filterCreatedBy.toLowerCase())

//     return matchesStatus && matchesClient && matchesLocation && matchesCreatedBy
//   })

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredInspections.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   // Prepare data for charts
//   const statusData = {
//     labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
//     datasets: [
//       {
//         data: [
//           inspections.filter(i => i.status === 'pending').length,
//           inspections.filter(i => i.status === 'approved').length,
//           inspections.filter(i => i.status === 'rejected').length,
//           inspections.filter(i => i.status === 'completed').length,
//         ],
//         backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444', '#6b7280'],
//         borderWidth: 0,
//       },
//     ],
//   }

//   // Group inspections by creator
//   const inspectionsByCreator = inspections.reduce((acc, inspection) => {
//     const creator = inspection.created_by;
//     acc[creator] = (acc[creator] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const creatorData = {
//     labels: Object.keys(inspectionsByCreator),
//     datasets: [
//       {
//         label: 'Inspections Conducted',
//         data: Object.values(inspectionsByCreator),
//         backgroundColor: '#3b82f6',
//         borderRadius: 4,
//       },
//     ],
//   }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom' as const,
//       },
//     },
//   }

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1,
//         },
//       },
//     },
//   }

//   const handleApprove = async (id: string) => {
//     try {
//       await api.patch(`inspections/health-safety/${id}/`, {
//         status: "approved",
//         approved_by: user?.id
//       })

//       setInspections((prev) =>
//         prev.map((insp) =>
//           insp.id === id
//             ? {
//                 ...insp,
//                 status: "approved",
//                 approved_by: `${user?.first_name} ${user?.last_name}` || "Admin",
//                 approval_date: new Date().toISOString(),
//               }
//             : insp
//         )
//       )
//       toast.success(`Health & safety inspection ${id} approved`)
//     } catch (err: any) {
//       console.error("Failed to approve inspection:", err)
//       toast.error("Failed to approve inspection")
//     }
//   }

//   const handleReject = async (id: string) => {
//     try {
//       await api.patch(`inspections/health-safety/${id}/`, {
//         status: "rejected",
//         approved_by: user?.id
//       })

//       setInspections((prev) =>
//         prev.map((insp) =>
//           insp.id === id
//             ? {
//                 ...insp,
//                 status: "rejected",
//                 approved_by: `${user?.first_name} ${user?.last_name}` || "Admin",
//                 approval_date: new Date().toISOString(),
//               }
//             : insp
//         )
//       )
//       toast.error(`Health & safety inspection ${id} rejected`)
//     } catch (err: any) {
//       console.error("Failed to reject inspection:", err)
//       toast.error("Failed to reject inspection")
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await api.delete(`inspections/health-safety/${id}/`)

//       setInspections((prev) => prev.filter((insp) => insp.id !== id))
//       toast.success(`Health & safety inspection ${id} deleted`)
//     } catch (err: any) {
//       console.error("Failed to delete inspection:", err)
//       toast.error("Failed to delete inspection")
//     }
//   }

//   const getStatusBadge = (status: InspectionStatus) => {
//     switch (status) {
//       case "pending":
//         return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Pending</Badge>
//       case "approved":
//         return <Badge className="bg-blue-600 text-white flex items-center w-min gap-1"><BadgeCheck className="h-3 w-3" /> Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><X className="h-3 w-3" /> Rejected</Badge>
//       case "completed":
//         return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const clearFilters = () => {
//     setFilterStatus("all")
//     setFilterClient("")
//     setFilterLocation("")
//     setFilterCreatedBy("")
//     setCurrentPage(1)
//     toast.success("Filters cleared")
//   }

//   const handleExport = () => {
//     const dataStr = JSON.stringify(filteredInspections, null, 2)
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
//     const exportFileDefaultName = 'health-safety-inspections.json'
    
//     const linkElement = document.createElement('a')
//     linkElement.setAttribute('href', dataUri)
//     linkElement.setAttribute('download', exportFileDefaultName)
//     linkElement.click()
    
//     toast.success("Export started successfully")
//   }

//   const retryFetch = () => {
//     setError(null)
//     setLoading(true)
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//           <p className="text-muted-foreground">Loading health & safety inspections...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Inspections</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button onClick={retryFetch} variant="default">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Try Again
//             </Button>
//             <Button asChild variant="outline">
//               <Link href="/login">Log In Again</Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Health & Safety Inspections</h1>
//           <p className="text-muted-foreground">Manage and review all health & safety inspections</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Export
//           </Button>
//           <Button asChild className="bg-blue-600 hover:bg-blue-700">
//             <Link href="/admin/inspections/health-safety/new">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               New Health & Safety Inspection
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="border-blue-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
//               <PieChart className="h-5 w-5" />
//               Inspection Status Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Pie data={statusData} options={chartOptions} />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-blue-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
//               <BarChart3 className="h-5 w-5" />
//               Inspections by Creator
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Bar data={creatorData} options={barChartOptions} />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-blue-100">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <CardTitle className="text-blue-700">Health & Safety Inspection List</CardTitle>
//               <CardDescription>View and manage health & safety inspections with advanced filters</CardDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} found
//               </span>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={() => {
//                   setShowAdvancedFilters(!showAdvancedFilters)
//                 }}
//                 className="h-8 w-8"
//               >
//                 <Filter className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <div className="flex flex-col gap-4 mb-6">
//             <div className="flex flex-col md:flex-row md:items-center gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search inspections..."
//                   className="pl-9"
//                   value={filterClient}
//                   onChange={(e) => setFilterClient(e.target.value)}
//                 />
//               </div>
              
//               <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InspectionStatus | "all")}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <div className="flex items-center gap-2">
//                     <BadgeCheck className="h-4 w-4 text-muted-foreground" />
//                     <SelectValue placeholder="Filter by status" />
//                   </div>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
              
//               <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
//                 <RefreshCw className="h-4 w-4" />
//                 Clear
//               </Button>
//             </div>

//             {/* Advanced Filters - Collapsible */}
//             {showAdvancedFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Building className="h-4 w-4" />
//                     Client
//                   </label>
//                   <Input
//                     placeholder="Filter by client"
//                     value={filterClient}
//                     onChange={(e) => setFilterClient(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Location
//                   </label>
//                   <Input
//                     placeholder="Filter by location"
//                     value={filterLocation}
//                     onChange={(e) => setFilterLocation(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Created By
//                   </label>
//                   <Input
//                     placeholder="Filter by creator"
//                     value={filterCreatedBy}
//                     onChange={(e) => setFilterCreatedBy(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           <div className="rounded-md border border-blue-100 overflow-hidden">
//             <Table>
//               <TableHeader className="bg-blue-50 text-blue-800">
//                 <TableRow>
//                   <TableHead className="font-semibold">ID</TableHead>
//                   <TableHead className="font-semibold">Client Name</TableHead>
//                   <TableHead className="font-semibold">Location</TableHead>
//                   <TableHead className="font-semibold">Status</TableHead>
//                   <TableHead className="font-semibold">Created By</TableHead>
//                   <TableHead className="font-semibold">Date</TableHead>
//                   <TableHead className="text-right font-semibold">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((inspection) => (
//                     <TableRow key={inspection.id} className="hover:bg-blue-50/30 transition-colors">
//                       <TableCell className="font-medium">#{inspection.id}</TableCell>
//                       <TableCell>{inspection.data.client_name || "N/A"}</TableCell>
//                       <TableCell>{inspection.data.location || "N/A"}</TableCell>
//                       <TableCell>{getStatusBadge(inspection.status as InspectionStatus)}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 text-muted-foreground" />
//                           {inspection.created_by}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           {new Date(inspection.created_at).toLocaleDateString()}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button size="icon" variant="ghost" className="h-8 w-8">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="w-48">
//                             <DropdownMenuItem asChild>
//                               <Link href={`/admin/inspections/health-safety/${inspection.id}/details`} className="flex items-center gap-2 cursor-pointer">
//                                 <Eye className="h-4 w-4" />
//                                 View Details
//                               </Link>
//                             </DropdownMenuItem>
//                             {inspection.status === "pending" &&
//                               (user?.role === "admin" || user?.role === "team_leader") && (
//                                 <>
//                                   <DropdownMenuItem 
//                                     onClick={() => handleApprove(inspection.id)}
//                                     className="flex items-center gap-2 text-emerald-600"
//                                   >
//                                     <CheckCircle2 className="h-4 w-4" />
//                                     Approve
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem 
//                                     onClick={() => handleReject(inspection.id)}
//                                     className="flex items-center gap-2 text-red-600"
//                                   >
//                                     <XCircle className="h-4 w-4" />
//                                     Reject
//                                   </DropdownMenuItem>
//                                 </>
//                               )}
//                             <DropdownMenuItem asChild>
//                               <Link href={`/admin/inspections/health-safety/${inspection.id}/edit`} className="flex items-center gap-2 cursor-pointer">
//                                 <Edit className="h-4 w-4" />
//                                 Edit
//                               </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem 
//                               onClick={() => handleDelete(inspection.id)}
//                               className="flex items-center gap-2 text-red-600"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2">
//                         <Filter className="h-8 w-8" />
//                         <p>No health & safety inspections found.</p>
//                         <Button variant="outline" onClick={clearFilters} className="mt-2">
//                           Clear filters
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//                        {/* Pagination Controls */}
//             {filteredInspections.length > itemsPerPage && (
//               <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
//                 <div className="text-sm text-muted-foreground flex items-center gap-2">
//                   <span>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInspections.length)} of {filteredInspections.length} inspections</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="flex items-center gap-1 h-8"
//                   >
//                     <ChevronLeft size={16} />
//                   </Button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                       <Button
//                         key={page}
//                         variant={currentPage === page ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => paginate(page)}
//                         className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-blue-600' : ''}`}
//                       >
//                         {page}
//                       </Button>
//                     ))}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="flex items-center gap-1 h-8"
//                   >
//                     <ChevronRight size={16} />
//                   </Button>
//                 </div>
//               </div>
//             )}
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
import { useRoleGuard } from "@/hooks/useRoleGuard"
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
  Filter,
  BarChart3,
  PieChart,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  User,
  Building,
  BadgeCheck,
  X,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import api from "@/lib/api-client"
import { Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface HealthSafetyInspection {
  id: string
  type: string
  status: string
  created_by: string
  created_at: string
  data: {
    client_name: string
    location: string
  }
}

type InspectionStatus = "pending" | "approved" | "rejected" | "completed"

export default function HealthSafetyInspectionsPage() {
  useRoleGuard(["admin", "team_leader", "inspector"])

  const [inspections, setInspections] = useState<HealthSafetyInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
  const [filterClient, setFilterClient] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterCreatedBy, setFilterCreatedBy] = useState("")
  const { user } = useAuth()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get("inspections/health-safety/")
        
        const mapped = response.data.map((item: any) => ({
          id: item.id.toString(),
          type: "health_safety",
          status: item.inspection.status,
          created_by: item.inspection.created_by_name || item.inspection.created_by.toString(),
          created_at: item.inspection.inspection_date || item.inspection.created_at,
          data: {
            client_name: item.inspection.client_name,
            location: item.inspection.location,
          }
        }))
        
        setInspections(mapped)
      } catch (err: any) {
        console.error("Failed to fetch health & safety inspections:", err)
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           "Failed to load health & safety inspections. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  const filteredInspections = inspections.filter((inspection) => {
    const matchesStatus = filterStatus === "all" || inspection.status === filterStatus
    const matchesClient = !filterClient || inspection.data.client_name?.toLowerCase().includes(filterClient.toLowerCase())
    const matchesLocation = !filterLocation || inspection.data.location?.toLowerCase().includes(filterLocation.toLowerCase())
    const matchesCreatedBy = !filterCreatedBy || inspection.created_by.toLowerCase().includes(filterCreatedBy.toLowerCase())

    return matchesStatus && matchesClient && matchesLocation && matchesCreatedBy
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredInspections.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Prepare data for charts
  const statusData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
    datasets: [
      {
        data: [
          inspections.filter(i => i.status === 'pending').length,
          inspections.filter(i => i.status === 'approved').length,
          inspections.filter(i => i.status === 'rejected').length,
          inspections.filter(i => i.status === 'completed').length,
        ],
        backgroundColor: ['#fbbf24', '#16a34a', '#ef4444', '#6b7280'],
        borderWidth: 0,
      },
    ],
  }

  // Group inspections by creator
  const inspectionsByCreator = inspections.reduce((acc, inspection) => {
    const creator = inspection.created_by;
    acc[creator] = (acc[creator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const creatorData = {
    labels: Object.keys(inspectionsByCreator),
    datasets: [
      {
        label: 'Inspections Conducted',
        data: Object.values(inspectionsByCreator),
        backgroundColor: '#16a34a',
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`inspections/health-safety/${id}/`, {
        status: "approved",
        approved_by: user?.id
      })

      setInspections((prev) =>
        prev.map((insp) =>
          insp.id === id
            ? {
                ...insp,
                status: "approved",
                approved_by: `${user?.first_name} ${user?.last_name}` || "Admin",
                approval_date: new Date().toISOString(),
              }
            : insp
        )
      )
      toast.success(`Health & safety inspection ${id} approved`)
    } catch (err: any) {
      console.error("Failed to approve inspection:", err)
      toast.error("Failed to approve inspection")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.patch(`inspections/health-safety/${id}/`, {
        status: "rejected",
        approved_by: user?.id
      })

      setInspections((prev) =>
        prev.map((insp) =>
          insp.id === id
            ? {
                ...insp,
                status: "rejected",
                approved_by: `${user?.first_name} ${user?.last_name}` || "Admin",
                approval_date: new Date().toISOString(),
              }
            : insp
        )
      )
      toast.error(`Health & safety inspection ${id} rejected`)
    } catch (err: any) {
      console.error("Failed to reject inspection:", err)
      toast.error("Failed to reject inspection")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`inspections/health-safety/${id}/`)

      setInspections((prev) => prev.filter((insp) => insp.id !== id))
      toast.success(`Health & safety inspection ${id} deleted`)
    } catch (err: any) {
      console.error("Failed to delete inspection:", err)
      toast.error("Failed to delete inspection")
    }
  }

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-white flex items-center w-min gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Pending</Badge>
      case "approved":
        return <Badge className="bg-emerald-600 text-white flex items-center w-min gap-1"><BadgeCheck className="h-3 w-3" /> Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 text-white flex items-center w-min gap-1"><X className="h-3 w-3" /> Rejected</Badge>
      case "completed":
        return <Badge variant="outline" className="flex items-center w-min gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const clearFilters = () => {
    setFilterStatus("all")
    setFilterClient("")
    setFilterLocation("")
    setFilterCreatedBy("")
    setCurrentPage(1)
    toast.success("Filters cleared")
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredInspections, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'health-safety-inspections.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success("Export started successfully")
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
          <p className="text-muted-foreground">Loading health & safety inspections...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Inspections</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={retryFetch} variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log In Again</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Health & Safety Inspections</h1>
          <p className="text-muted-foreground">Manage and review all health & safety inspections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/inspections/health-safety/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Health & Safety Inspection
            </Link>
          </Button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              <PieChart className="h-5 w-5" />
              Inspection Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={statusData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              <BarChart3 className="h-5 w-5" />
              Inspections by Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={creatorData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-emerald-800">Health & Safety Inspection List</CardTitle>
              <CardDescription>View and manage health & safety inspections with advanced filters</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} found
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowAdvancedFilters(!showAdvancedFilters)
                }}
                className="h-8 w-8"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inspections..."
                  className="pl-9"
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InspectionStatus | "all")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* Advanced Filters - Collapsible */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Client
                  </label>
                  <Input
                    placeholder="Filter by client"
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Location
                  </label>
                  <Input
                    placeholder="Filter by location"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created By
                  </label>
                  <Input
                    placeholder="Filter by creator"
                    value={filterCreatedBy}
                    onChange={(e) => setFilterCreatedBy(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border border-emerald-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-emerald-50 text-emerald-800">
                <TableRow>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Client Name</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created By</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((inspection) => (
                    <TableRow key={inspection.id} className="hover:bg-emerald-50/30 transition-colors">
                      <TableCell className="font-medium">#{inspection.id}</TableCell>
                      <TableCell>{inspection.data.client_name || "N/A"}</TableCell>
                      <TableCell>{inspection.data.location || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(inspection.status as InspectionStatus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {inspection.created_by}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(inspection.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/inspections/health-safety/${inspection.id}/details`} className="flex items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {inspection.status === "pending" &&
                              (user?.role === "admin" || user?.role === "team_leader") && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleApprove(inspection.id)}
                                    className="flex items-center gap-2 text-emerald-600"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleReject(inspection.id)}
                                    className="flex items-center gap-2 text-red-600"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/inspections/health-safety/${inspection.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(inspection.id)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="h-8 w-8" />
                        <p>No health & safety inspections found.</p>
                        <Button variant="outline" onClick={clearFilters} className="mt-2">
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {filteredInspections.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInspections.length)} of {filteredInspections.length} inspections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 h-8"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(page)}
                        className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-emerald-600' : ''}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 h-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
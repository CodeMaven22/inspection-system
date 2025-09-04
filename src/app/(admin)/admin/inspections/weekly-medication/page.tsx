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
  Pill,
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

interface WeeklyMedicationInspection {
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

export default function WeeklyMedicationInspectionsPage() {
  useRoleGuard(["admin", "team_leader", "inspector"])

  const [inspections, setInspections] = useState<WeeklyMedicationInspection[]>([])
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
        
        const response = await api.get("inspections/weekly-medication-audit/")
        
        // Check if response.data is an array or if it contains a results property
        let inspectionsData = response.data;
        
        // Handle different API response structures
        if (Array.isArray(response.data)) {
          inspectionsData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          inspectionsData = response.data.results;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          inspectionsData = response.data.data;
        } else {
          console.error("Unexpected API response structure:", response.data);
          throw new Error("Unexpected API response format");
        }
        
        const mapped = inspectionsData.map((item: any) => {
          // Handle different response structures
          const inspectionData = item.inspection || item;
          
          return {
            id: item.id?.toString() || inspectionData.id?.toString(),
            type: "weekly_medication",
            status: inspectionData.status,
            created_by: inspectionData.created_by_name || inspectionData.created_by?.toString() || "Unknown",
            created_at: inspectionData.inspection_date || inspectionData.created_at,
            data: {
              client_name: inspectionData.client_name,
              location: inspectionData.location,
            }
          }
        })
        
        setInspections(mapped)
      } catch (err: any) {
        console.error("Failed to fetch weekly medication inspections:", err)
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           err.message ||
                           "Failed to load weekly medication inspections. Please try again."
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
      await api.patch(`inspections/weekly-medication/${id}/`, {
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
      toast.success(`Weekly medication inspection ${id} approved`)
    } catch (err: any) {
      console.error("Failed to approve inspection:", err)
      toast.error("Failed to approve inspection")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.patch(`inspections/weekly-medication-audit/${id}/`, {
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
      toast.error(`Weekly medication inspection ${id} rejected`)
    } catch (err: any) {
      console.error("Failed to reject inspection:", err)
      toast.error("Failed to reject inspection")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`inspections/weekly-medication-audit/${id}/`)

      setInspections((prev) => prev.filter((insp) => insp.id !== id))
      toast.success(`Weekly medication inspection ${id} deleted`)
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
    const exportFileDefaultName = 'weekly-medication-inspections.json'
    
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
          <p className="text-muted-foreground">Loading weekly medication inspections...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Weekly Medication Audits</h1>
          <p className="text-muted-foreground">Manage and review all weekly medication inspections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/inspections/weekly-medication/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Weekly Audit
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
              <CardTitle className="text-emerald-800">Weekly Medication Audit List</CardTitle>
              <CardDescription>View and manage weekly medication audits with advanced filters</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredInspections.length} audit{filteredInspections.length !== 1 ? 's' : ''} found
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
                  placeholder="Search audits..."
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
                              <Link href={`/admin/inspections/weekly-medication/${inspection.id}/details`} className="flex items-center gap-2 cursor-pointer">
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
                              <Link href={`/admin/inspections/weekly-medication/${inspection.id}/edit`} className="flex items-center gap-2 cursor-pointer">
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
                        <Pill className="h-8 w-8" />
                        <p>No weekly medication audits found.</p>
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
                  <span>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInspections.length)} of {filteredInspections.length} audits</span>
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
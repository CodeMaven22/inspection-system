"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PlusCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Inspection, InspectionStatus, InspectionType } from "@/types/inspection"
import { useAuth } from "@/context/auth-context"

export default function ClientInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<InspectionType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<InspectionStatus | "all">("all")
  const { user } = useAuth()

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

      const mockInspections: Inspection[] = [
        {
          id: "insp_1",
          type: "medication_audit_comprehensive",
          status: "pending",
          created_at: "2023-10-26T10:00:00Z",
          created_by: user?.id || "worker_john",
          submitted_by_role: "worker",
          data: {
            client_name: "Client A",
            client_id: "CA001",
            date_of_audit: "2023-10-25",
            auditor_name: "John Doe",
            medication_list_accurate: true,
            medication_storage_secure: true,
            medication_administration_records_accurate: false,
            discrepancies_found: "Missing signature on one record.",
            action_taken: "Noted for follow-up.",
            staff_signature: "John Doe",
            comments: "Audit completed as per schedule.",
          },
        },
        {
          id: "insp_2",
          type: "fire_alarm_weekly",
          status: "approved",
          created_at: "2023-10-25T09:30:00Z",
          created_by: user?.id || "worker_jane",
          submitted_by_role: "worker",
          approval_status: "approved",
          approved_by: "admin_user",
          approval_date: "2023-10-25T11:00:00Z",
          approval_comments: "All clear.",
          data: {
            location: "Main Building",
            date_of_check: "2023-10-24",
            checked_by: "Jane Smith",
            alarm_functional: true,
            call_points_accessible: true,
            emergency_lights_working: true,
            faults_identified: "None",
            action_taken: "N/A",
            management_book_initials: "JS",
            comments: "Routine weekly check.",
          },
        },
        {
          id: "insp_3",
          type: "worker_inspection",
          status: "rejected",
          created_at: "2023-10-24T14:00:00Z",
          created_by: user?.id || "worker_bob",
          submitted_by_role: "worker",
          approval_status: "rejected",
          approved_by: "admin_user",
          approval_date: "2023-10-24T16:00:00Z",
          approval_comments: "Insufficient detail provided.",
          data: {
            worker_name: "Worker C",
            worker_id: "WC003",
            date_of_inspection: "2023-10-23",
            inspector_name: "Bob Johnson",
            concern_description: "Worker reported feeling overwhelmed.",
            recommendations: "Suggest stress management training.",
            worker_signature: "Worker C",
            inspector_signature: "Bob Johnson",
            follow_up_required: true,
            follow_up_date: "2023-11-01",
            comments: "Initial assessment.",
          },
        },
        {
          id: "insp_4",
          type: "smoke_alarm_weekly",
          status: "draft",
          created_at: "2023-10-23T11:00:00Z",
          created_by: user?.id || "worker_alice",
          submitted_by_role: "worker",
          data: {
            location: "Annex Building",
            date_of_check: "2023-10-22",
            checked_by: "Alice Green",
            alarm_functional: true,
            battery_replaced: false,
            faults_identified: "None",
            action_taken: "N/A",
            management_book_initials: "AG",
            comments: "All smoke alarms checked.",
          },
        },
        {
          id: "insp_5",
          type: "weekly_medication_audit",
          status: "completed",
          created_at: "2023-10-22T08:00:00Z",
          created_by: user?.id || "worker_david",
          submitted_by_role: "worker",
          data: {
            client_name: "Client B",
            client_id: "CB002",
            date_of_audit: "2023-10-21",
            auditor_name: "David Lee",
            medication_count_accurate: true,
            medication_expiry_checked: true,
            any_issues: "None",
            staff_signature: "David Lee",
            comments: "Weekly audit completed.",
          },
        },
      ].filter((inspection) => inspection.created_by === user?.id) // Filter by current user
      setInspections(mockInspections)
      setLoading(false)
    }
    if (user?.id) {
      fetchInspections()
    }
  }, [user?.id])

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.data as any).client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.data as any).location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.data as any).worker_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || inspection.type === filterType
    const matchesStatus = filterStatus === "all" || inspection.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Inspections</h1>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/client/inspections/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request New Inspection
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Submitted Inspections</CardTitle>
          <CardDescription>View and track the status of your inspection requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search my inspections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as InspectionType | "all")}>
              <SelectTrigger className="w-[200px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
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
                      <TableCell>{new Date(inspection.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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

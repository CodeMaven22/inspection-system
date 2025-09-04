"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Building,
  FileText,
  AlertCircle,
  Pill,
  Shield,
  Check,
  X,
  Edit,
  BadgeCheck,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useRoleGuard } from "@/hooks/useRoleGuard"
import { toast } from "sonner"
import api from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"

interface WeeklyMedicationInspection {
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
  // Medication Storage Section
  medications_cabinet_securely_locked: boolean
  medication_cabinet_clean_no_spillages: boolean
  medications_have_opening_dates_original_labels: boolean
  medication_label_has_client_details: boolean
  medication_stored_correctly: boolean
  // Documentation Section
  current_marr_sheet_match_client_records: boolean
  marr_sheet_list_all_medications_prescribed: boolean
  gap_on_marr_sheet: boolean
  boxed_bottled_medications_stock_count_entered: boolean
  all_documentation_black_ink: boolean
  // Controlled Drugs Section
  control_drug_for_client: boolean
  controlled_drugs_stored_recorded_correctly_count_correct: boolean
  // PRN Medications Section
  prn_medications: boolean
  directives_for_prn_clear_comprehensive: boolean
  // Medication Administration Section
  medication_count_accurate: boolean
  medication_expiry_checked: boolean
  // Free Text Fields
  missing_administration_why: string
  any_issues: string
  comments: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function WeeklyMedicationAuditDetailsPage() {
  useRoleGuard(["admin", "team_leader", "inspector"])
  
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inspection, setInspection] = useState<WeeklyMedicationInspection | null>(null)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get(`/inspections/weekly-medication-audit/${params.id}/`)
        setInspection(response.data)
      } catch (err: any) {
        console.error("Failed to fetch inspection:", err)
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           "Failed to load weekly medication audit. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInspection()
    }
  }, [params.id])

  const getStatusBadge = (status: string) => {
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

  const BooleanIndicator = ({ value }: { value: boolean }) => (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">{value ? "Yes" : "No"}</span>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading weekly medication audit details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Audit</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/admin/inspections/weekly-medication-audit">Back to Audits</Link>
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
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Audit Not Found</h2>
          <p className="text-gray-600 mb-4">The requested weekly medication audit could not be found.</p>
          <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/inspections/weekly-medication-audit">Back to Audits</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/inspections/weekly-medication-audit">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Weekly Medication Audit Details</h1>
          <p className="text-muted-foreground">View details of audit #{inspection.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-1 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Audit overview and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Location
              </Label>
              <div className="text-sm p-2 bg-muted rounded-md">
                {inspection.inspection?.location || "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Name
              </Label>
              <div className="text-sm p-2 bg-muted rounded-md">
                {inspection.inspection?.client_name || "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="p-2">
                {getStatusBadge(inspection.inspection?.status)}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Created By
              </Label>
              <div className="text-sm p-2 bg-muted rounded-md">
                {inspection.inspection?.created_by_name || "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created Date
              </Label>
              <div className="text-sm p-2 bg-muted rounded-md">
                {inspection.inspection?.created_at ? new Date(inspection.inspection.created_at).toLocaleDateString() : "N/A"}
              </div>
            </div>

            {inspection.inspection?.inspection_date && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Inspection Date
                </Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {new Date(inspection.inspection.inspection_date).toLocaleDateString()}
                </div>
              </div>
            )}

            {inspection.inspection?.approved_by_name && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Approved By
                </Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {inspection.inspection.approved_by_name}
                </div>
              </div>
            )}

            {inspection.inspection?.approval_date && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Approval Date
                </Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {new Date(inspection.inspection.approval_date).toLocaleDateString()}
                </div>
              </div>
            )}

            {inspection.inspection?.approval_comments && (
              <div className="space-y-2">
                <Label>Approval Comments</Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {inspection.inspection.approval_comments}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medication Storage Section */}
        <Card className="lg:col-span-2 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medication Storage
            </CardTitle>
            <CardDescription>Medication cabinet and storage conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">Cabinet securely locked</Label>
                <BooleanIndicator value={inspection.medications_cabinet_securely_locked} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">Cabinet clean, no spillages</Label>
                <BooleanIndicator value={inspection.medication_cabinet_clean_no_spillages} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">Opening dates & original labels</Label>
                <BooleanIndicator value={inspection.medications_have_opening_dates_original_labels} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">Labels have client details</Label>
                <BooleanIndicator value={inspection.medication_label_has_client_details} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">Medications stored correctly</Label>
                <BooleanIndicator value={inspection.medication_stored_correctly} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Section */}
      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentation
          </CardTitle>
          <CardDescription>MARR sheet and documentation review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">MARR sheet matches records</Label>
              <BooleanIndicator value={inspection.current_marr_sheet_match_client_records} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">All medications listed</Label>
              <BooleanIndicator value={inspection.marr_sheet_list_all_medications_prescribed} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Gaps in MARR sheet</Label>
              <BooleanIndicator value={inspection.gap_on_marr_sheet} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Stock count entered</Label>
              <BooleanIndicator value={inspection.boxed_bottled_medications_stock_count_entered} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Documentation in black ink</Label>
              <BooleanIndicator value={inspection.all_documentation_black_ink} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controlled Drugs & PRN Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Controlled Drugs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Controlled drugs present</Label>
              <BooleanIndicator value={inspection.control_drug_for_client} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Controlled drugs properly managed</Label>
              <BooleanIndicator value={inspection.controlled_drugs_stored_recorded_correctly_count_correct} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">PRN Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">PRN medications present</Label>
              <BooleanIndicator value={inspection.prn_medications} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Clear PRN directives</Label>
              <BooleanIndicator value={inspection.directives_for_prn_clear_comprehensive} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Administration Section */}
      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800">Medication Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Medication count accurate</Label>
              <BooleanIndicator value={inspection.medication_count_accurate} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm">Medication expiry checked</Label>
              <BooleanIndicator value={inspection.medication_expiry_checked} />
            </div>
          </div>

          {inspection.missing_administration_why && (
            <div className="space-y-2">
              <Label>Missing Administration Reason</Label>
              <div className="text-sm p-3 bg-muted/30 rounded-lg">
                {inspection.missing_administration_why}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Findings */}
      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800">Audit Findings</CardTitle>
          <CardDescription>Additional comments and issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inspection.any_issues && (
            <div className="space-y-2">
              <Label>Issues Identified</Label>
              <div className="text-sm p-3 bg-muted/30 rounded-lg">
                {inspection.any_issues}
              </div>
            </div>
          )}

          {inspection.comments && (
            <div className="space-y-2">
              <Label>General Comments</Label>
              <div className="text-sm p-3 bg-muted/30 rounded-lg">
                {inspection.comments}
              </div>
            </div>
          )}

          {inspection.inspection?.inspection_comments && (
            <div className="space-y-2">
              <Label>Inspection Comments</Label>
              <div className="text-sm p-3 bg-muted/30 rounded-lg">
                {inspection.inspection.inspection_comments}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button asChild variant="outline">
          <Link href="/admin/inspections/weekly-medication-audit">
            Back to Audits
          </Link>
        </Button>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href={`/admin/inspections/weekly-medication-audit/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Audit
          </Link>
        </Button>
      </div>
    </div>
  )
}
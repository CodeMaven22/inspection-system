"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Save,
  Loader2,
  Pill,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { useRoleGuard } from "@/hooks/useRoleGuard"
import { toast } from "sonner"
import api from "@/lib/api-client"

export default function NewMedicationComprehensivePage() {
  useRoleGuard(["admin", "team_leader", "inspector"])
  
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Basic Information
    location: "",
    client_name: "",
    
    // Medication Storage Section
    medications_cabinet_securely_locked: false,
    medication_cabinet_clean_no_spillages: false,
    medications_have_opening_dates_original_labels: false,
    medication_label_has_client_details: false,
    medication_stored_correctly: false,
    
    // Documentation Section
    current_marr_sheet_match_client_records: false,
    marr_sheet_list_all_medications_prescribed: false,
    gap_on_marr_sheet: false,
    all_documentation_black_ink: false,
    
    // Controlled Drugs Section
    control_drug_for_client: false,
    controlled_drugs_stored_recorded_correctly_count_correct: false,
    
    // PRN Medications Section
    prn_medications: false,
    directives_for_prn_clear_comprehensive: false,
    
    // Administration Section
    medications_administration_coded_on_marr_sheet: false,
    records_of_refusal_gp_informed: false,
    
    // Special Medication Types
    transdermal_patch_protocol_for_use: false,
    client_take_any_blood_thinners_up_to_date_risk_assessment: false,
    
    // Medication Ordering Section
    order_of_medication_done_monthly_basis: false,
    returns_medication_recorded_correctly_returns_book: false,
    
    // Free Text Fields
    missing_administration_why: "",
    why_returns_medication_for_client: "",
    any_additional_comments: "",
    any_follow_up_requires_by_whom: "",
    comments: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.location || !formData.client_name) {
      toast.error("Location and Client Name are required")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/inspections/medication-comprehensive/", formData)
      
      toast.success("Medication comprehensive audit created successfully")
      router.push("/admin/inspections/medication-comprehensive")
    } catch (err: any) {
      console.error("Failed to create audit:", err)
      
      if (err.response) {
        console.error("Response data:", err.response.data)
        
        // Display field-specific errors if available
        if (err.response.data && typeof err.response.data === 'object') {
          Object.entries(err.response.data).forEach(([field, error]) => {
            if (Array.isArray(error)) {
              error.forEach(errMsg => toast.error(`${field}: ${errMsg}`))
            } else {
              toast.error(`${field}: ${error}`)
            }
          })
        } else {
          toast.error(err.response.data?.detail || "Failed to create audit")
        }
      } else {
        toast.error("Network error. Please check your connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/inspections/medication-comprehensive">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">New Medication Comprehensive Audit</h1>
          <p className="text-muted-foreground">Create a new medication comprehensive audit checklist</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Required information for the audit</CardDescription>
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
            </CardContent>
          </Card>

          {/* Medication Storage Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-blue-800">Medication Storage</CardTitle>
              <CardDescription>Medication cabinet and storage conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medications_cabinet_securely_locked"
                    checked={formData.medications_cabinet_securely_locked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("medications_cabinet_securely_locked", checked as boolean)
                    }
                  />
                  <Label htmlFor="medications_cabinet_securely_locked" className="cursor-pointer text-sm">
                    Cabinet securely locked
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medication_cabinet_clean_no_spillages"
                    checked={formData.medication_cabinet_clean_no_spillages}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("medication_cabinet_clean_no_spillages", checked as boolean)
                    }
                  />
                  <Label htmlFor="medication_cabinet_clean_no_spillages" className="cursor-pointer text-sm">
                    Cabinet clean, no spillages
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medications_have_opening_dates_original_labels"
                    checked={formData.medications_have_opening_dates_original_labels}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("medications_have_opening_dates_original_labels", checked as boolean)
                    }
                  />
                  <Label htmlFor="medications_have_opening_dates_original_labels" className="cursor-pointer text-sm">
                    Opening dates & original labels
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medication_label_has_client_details"
                    checked={formData.medication_label_has_client_details}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("medication_label_has_client_details", checked as boolean)
                    }
                  />
                  <Label htmlFor="medication_label_has_client_details" className="cursor-pointer text-sm">
                    Labels have client details
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medication_stored_correctly"
                    checked={formData.medication_stored_correctly}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("medication_stored_correctly", checked as boolean)
                    }
                  />
                  <Label htmlFor="medication_stored_correctly" className="cursor-pointer text-sm">
                    Medications stored correctly
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Documentation</CardTitle>
            <CardDescription>MARR sheet and documentation review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current_marr_sheet_match_client_records"
                  checked={formData.current_marr_sheet_match_client_records}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("current_marr_sheet_match_client_records", checked as boolean)
                  }
                />
                <Label htmlFor="current_marr_sheet_match_client_records" className="cursor-pointer text-sm">
                  MARR sheet matches records
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marr_sheet_list_all_medications_prescribed"
                  checked={formData.marr_sheet_list_all_medications_prescribed}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("marr_sheet_list_all_medications_prescribed", checked as boolean)
                  }
                />
                <Label htmlFor="marr_sheet_list_all_medications_prescribed" className="cursor-pointer text-sm">
                  All medications listed
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gap_on_marr_sheet"
                  checked={formData.gap_on_marr_sheet}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("gap_on_marr_sheet", checked as boolean)
                  }
                />
                <Label htmlFor="gap_on_marr_sheet" className="cursor-pointer text-sm">
                  Gaps in MARR sheet
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_documentation_black_ink"
                  checked={formData.all_documentation_black_ink}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("all_documentation_black_ink", checked as boolean)
                  }
                />
                <Label htmlFor="all_documentation_black_ink" className="cursor-pointer text-sm">
                  Documentation in black ink
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controlled Drugs & PRN Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Controlled Drugs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="control_drug_for_client"
                  checked={formData.control_drug_for_client}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("control_drug_for_client", checked as boolean)
                  }
                />
                <Label htmlFor="control_drug_for_client" className="cursor-pointer">
                  Controlled drugs present
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlled_drugs_stored_recorded_correctly_count_correct"
                  checked={formData.controlled_drugs_stored_recorded_correctly_count_correct}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("controlled_drugs_stored_recorded_correctly_count_correct", checked as boolean)
                  }
                />
                <Label htmlFor="controlled_drugs_stored_recorded_correctly_count_correct" className="cursor-pointer text-sm">
                  Controlled drugs properly managed
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">PRN Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prn_medications"
                  checked={formData.prn_medications}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("prn_medications", checked as boolean)
                  }
                />
                <Label htmlFor="prn_medications" className="cursor-pointer">
                  PRN medications present
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="directives_for_prn_clear_comprehensive"
                  checked={formData.directives_for_prn_clear_comprehensive}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("directives_for_prn_clear_comprehensive", checked as boolean)
                  }
                />
                <Label htmlFor="directives_for_prn_clear_comprehensive" className="cursor-pointer text-sm">
                  Clear PRN directives
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administration & Special Medication Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_administration_coded_on_marr_sheet"
                  checked={formData.medications_administration_coded_on_marr_sheet}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("medications_administration_coded_on_marr_sheet", checked as boolean)
                  }
                />
                <Label htmlFor="medications_administration_coded_on_marr_sheet" className="cursor-pointer text-sm">
                  Proper administration coding
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="records_of_refusal_gp_informed"
                  checked={formData.records_of_refusal_gp_informed}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("records_of_refusal_gp_informed", checked as boolean)
                  }
                />
                <Label htmlFor="records_of_refusal_gp_informed" className="cursor-pointer text-sm">
                  Records of refusal & GP notification
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Special Medication Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transdermal_patch_protocol_for_use"
                  checked={formData.transdermal_patch_protocol_for_use}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("transdermal_patch_protocol_for_use", checked as boolean)
                  }
                />
                <Label htmlFor="transdermal_patch_protocol_for_use" className="cursor-pointer text-sm">
                  Transdermal patch protocol
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="client_take_any_blood_thinners_up_to_date_risk_assessment"
                  checked={formData.client_take_any_blood_thinners_up_to_date_risk_assessment}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("client_take_any_blood_thinners_up_to_date_risk_assessment", checked as boolean)
                  }
                />
                <Label htmlFor="client_take_any_blood_thinners_up_to_date_risk_assessment" className="cursor-pointer text-sm">
                  Blood thinner risk assessment
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medication Ordering Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Medication Ordering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="order_of_medication_done_monthly_basis"
                  checked={formData.order_of_medication_done_monthly_basis}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("order_of_medication_done_monthly_basis", checked as boolean)
                  }
                />
                <Label htmlFor="order_of_medication_done_monthly_basis" className="cursor-pointer text-sm">
                  Monthly medication orders
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="returns_medication_recorded_correctly_returns_book"
                  checked={formData.returns_medication_recorded_correctly_returns_book}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("returns_medication_recorded_correctly_returns_book", checked as boolean)
                  }
                />
                <Label htmlFor="returns_medication_recorded_correctly_returns_book" className="cursor-pointer text-sm">
                  Proper medication returns
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Free Text Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missing_administration_why">Missing Administration Reason</Label>
              <Textarea
                id="missing_administration_why"
                name="missing_administration_why"
                value={formData.missing_administration_why}
                onChange={handleInputChange}
                placeholder="Explain any missing administrations..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="why_returns_medication_for_client">Medication Returns Reason</Label>
              <Textarea
                id="why_returns_medication_for_client"
                name="why_returns_medication_for_client"
                value={formData.why_returns_medication_for_client}
                onChange={handleInputChange}
                placeholder="Explain medication returns for this client..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="any_additional_comments">Additional Comments</Label>
              <Textarea
                id="any_additional_comments"
                name="any_additional_comments"
                value={formData.any_additional_comments}
                onChange={handleInputChange}
                placeholder="Any additional comments about the audit..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="any_follow_up_requires_by_whom">Follow-up Requirements</Label>
              <Textarea
                id="any_follow_up_requires_by_whom"
                name="any_follow_up_requires_by_whom"
                value={formData.any_follow_up_requires_by_whom}
                onChange={handleInputChange}
                placeholder="Details of any required follow-up and responsible parties..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">General Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="General comments about the audit..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/inspections/medication-comprehensive")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Audit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
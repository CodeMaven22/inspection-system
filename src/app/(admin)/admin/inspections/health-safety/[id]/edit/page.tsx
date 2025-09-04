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
  Save,
  Loader2,
  AlertCircle,
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

interface HealthSafetyInspection {
  id: number
  inspection:{
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
  previous_concerns_addressed: boolean
  policy_up_to_date_local_health_safety: boolean
  staff_issued_personal_copy_policy_told_text: boolean
  health_safety_standing_item_agenda_previous_staff_meeting: boolean
  all_staff_received_training_health_safety_procedures: boolean
  new_staff_receive_training_beginning_employment: boolean
  temporary_staff_receive_necessary_training: boolean
  staff_carry_out_manual_handling_risk_assessment: boolean
  equipment_used_mobility_risk_assessment: boolean
  computer_workstation_assessments_carried_out_recorded: boolean
  working_conditions_suitable_noise_lighting_ventilation_temperature: boolean
  furniture_furnishings_good_condition_suitable_stable: boolean
  equipment_suitable_maintained_good_condition: boolean
  floor_surfaces_acceptable_condition: boolean
  fire_doors_kept_closed: boolean
  notices_informing_staff_what_to_do_fire: boolean
  staff_know_what_to_do_event_fire: boolean
  adequate_first_aiders_available: boolean
  easy_to_find_first_aiders: boolean
  electricity_obvious_defects_electrical_equipment: boolean
  sockets_overloaded: boolean
  all_electrical_equipment_inspected: boolean
  circulation_routes_kept_clear_obstructions_wires_cables_boxes: boolean
  harmful_substances_in_use_precautions_agreed: string
  comments: string
}

export default function EditHealthSafetyInspectionPage() {
  useRoleGuard(["admin", "team_leader", "inspector"])
  
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inspection, setInspection] = useState<HealthSafetyInspection | null >(null)
  
  const [formData, setFormData] = useState({
    location: "",
    client_name: "",
    previous_concerns_addressed: false,
    policy_up_to_date_local_health_safety: false,
    staff_issued_personal_copy_policy_told_text: false,
    health_safety_standing_item_agenda_previous_staff_meeting: false,
    all_staff_received_training_health_safety_procedures: false,
    new_staff_receive_training_beginning_employment: false,
    temporary_staff_receive_necessary_training: false,
    staff_carry_out_manual_handling_risk_assessment: false,
    equipment_used_mobility_risk_assessment: false,
    computer_workstation_assessments_carried_out_recorded: false,
    working_conditions_suitable_noise_lighting_ventilation_temperature: false,
    furniture_furnishings_good_condition_suitable_stable: false,
    equipment_suitable_maintained_good_condition: false,
    floor_surfaces_acceptable_condition: false,
    fire_doors_kept_closed: false,
    notices_informing_staff_what_to_do_fire: false,
    staff_know_what_to_do_event_fire: false,
    adequate_first_aiders_available: false,
    easy_to_find_first_aiders: false,
    electricity_obvious_defects_electrical_equipment: false,
    sockets_overloaded: false,
    all_electrical_equipment_inspected: false,
    circulation_routes_kept_clear_obstructions_wires_cables_boxes: false,
    harmful_substances_in_use_precautions_agreed: "",
    comments: "",
  })

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setFetching(true)
        setError(null)
        
        const response = await api.get(`/inspections/health-safety/${params.id}/`)
        setInspection(response.data)

        // Extract the nested inspection data
        const inspectionData = response.data.inspection;
        
        setFormData({
          // Get location and client_name from the nested inspection object
          location: inspectionData?.location || "",
          client_name: inspectionData?.client_name || "",
          previous_concerns_addressed: response.data.previous_concerns_addressed || false,
          policy_up_to_date_local_health_safety: response.data.policy_up_to_date_local_health_safety || false,
          staff_issued_personal_copy_policy_told_text: response.data.staff_issued_personal_copy_policy_told_text || false,
          health_safety_standing_item_agenda_previous_staff_meeting: response.data.health_safety_standing_item_agenda_previous_staff_meeting || false,
          all_staff_received_training_health_safety_procedures: response.data.all_staff_received_training_health_safety_procedures || false,
          new_staff_receive_training_beginning_employment: response.data.new_staff_receive_training_beginning_employment || false,
          temporary_staff_receive_necessary_training: response.data.temporary_staff_receive_necessary_training || false,
          staff_carry_out_manual_handling_risk_assessment: response.data.staff_carry_out_manual_handling_risk_assessment || false,
          equipment_used_mobility_risk_assessment: response.data.equipment_used_mobility_risk_assessment || false,
          computer_workstation_assessments_carried_out_recorded: response.data.computer_workstation_assessments_carried_out_recorded || false,
          working_conditions_suitable_noise_lighting_ventilation_temperature: response.data.working_conditions_suitable_noise_lighting_ventilation_temperature || false,
          furniture_furnishings_good_condition_suitable_stable: response.data.furniture_furnishings_good_condition_suitable_stable || false,
          equipment_suitable_maintained_good_condition: response.data.equipment_suitable_maintained_good_condition || false,
          floor_surfaces_acceptable_condition: response.data.floor_surfaces_acceptable_condition || false,
          fire_doors_kept_closed: response.data.fire_doors_kept_closed || false,
          notices_informing_staff_what_to_do_fire: response.data.notices_informing_staff_what_to_do_fire || false,
          staff_know_what_to_do_event_fire: response.data.staff_know_what_to_do_event_fire || false,
          adequate_first_aiders_available: response.data.adequate_first_aiders_available || false,
          easy_to_find_first_aiders: response.data.easy_to_find_first_aiders || false,
          electricity_obvious_defects_electrical_equipment: response.data.electricity_obvious_defects_electrical_equipment || false,
          sockets_overloaded: response.data.sockets_overloaded || false,
          all_electrical_equipment_inspected: response.data.all_electrical_equipment_inspected || false,
          circulation_routes_kept_clear_obstructions_wires_cables_boxes: response.data.circulation_routes_kept_clear_obstructions_wires_cables_boxes || false,
          harmful_substances_in_use_precautions_agreed: response.data.harmful_substances_in_use_precautions_agreed || "",
          comments: response.data.comments || "",
        })
      } catch (err: any) {
        console.error("Failed to fetch inspection:", err)
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           "Failed to load health & safety inspection. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setFetching(false)
      }
    }

    if (params.id) {
      fetchInspection()
    }
  }, [params.id])

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
      await api.put(`/inspections/health-safety/${params.id}/`, formData)
      
      toast.success("Health & Safety inspection updated successfully")
      router.push("/admin/inspections/health-safety")
    } catch (err: any) {
      console.error("Failed to update inspection:", err)
      
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
          toast.error(err.response.data?.detail || "Failed to update inspection")
        }
      } else {
        toast.error("Network error. Please check your connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading health & safety inspection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Inspection</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/admin/inspections/health-safety">Back to Inspections</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/inspections/health-safety">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Edit Health & Safety Inspection</h1>
          <p className="text-muted-foreground">Update health and safety inspection #{inspection?.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-emerald-800">Basic Information</CardTitle>
              <CardDescription>Required information for the inspection</CardDescription>
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
                <Label>Status</Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {inspection?.inspection?.status ? inspection.inspection.status.charAt(0).toUpperCase() + inspection.inspection.status.slice(1) : 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Created By</Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {inspection?.inspection?.created_by_name || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Created Date</Label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {inspection?.inspection?.created_at ? new Date(inspection.inspection.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy and Training Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-emerald-800">Policy and Training</CardTitle>
              <CardDescription>Policy documentation and staff training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="previous_concerns_addressed"
                    checked={formData.previous_concerns_addressed}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("previous_concerns_addressed", checked as boolean)
                    }
                  />
                  <Label htmlFor="previous_concerns_addressed" className="cursor-pointer text-sm">
                    Previous concerns addressed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="policy_up_to_date_local_health_safety"
                    checked={formData.policy_up_to_date_local_health_safety}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("policy_up_to_date_local_health_safety", checked as boolean)
                    }
                  />
                  <Label htmlFor="policy_up_to_date_local_health_safety" className="cursor-pointer text-sm">
                    Policy up to date
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="staff_issued_personal_copy_policy_told_text"
                    checked={formData.staff_issued_personal_copy_policy_told_text}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("staff_issued_personal_copy_policy_told_text", checked as boolean)
                    }
                  />
                  <Label htmlFor="staff_issued_personal_copy_policy_told_text" className="cursor-pointer text-sm">
                    Staff issued policy copies
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="health_safety_standing_item_agenda_previous_staff_meeting"
                    checked={formData.health_safety_standing_item_agenda_previous_staff_meeting}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("health_safety_standing_item_agenda_previous_staff_meeting", checked as boolean)
                    }
                  />
                  <Label htmlFor="health_safety_standing_item_agenda_previous_staff_meeting" className="cursor-pointer text-sm">
                    H&S on meeting agenda
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all_staff_received_training_health_safety_procedures"
                    checked={formData.all_staff_received_training_health_safety_procedures}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("all_staff_received_training_health_safety_procedures", checked as boolean)
                    }
                  />
                  <Label htmlFor="all_staff_received_training_health_safety_procedures" className="cursor-pointer text-sm">
                    All staff trained
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new_staff_receive_training_beginning_employment"
                    checked={formData.new_staff_receive_training_beginning_employment}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("new_staff_receive_training_beginning_employment", checked as boolean)
                    }
                  />
                  <Label htmlFor="new_staff_receive_training_beginning_employment" className="cursor-pointer text-sm">
                    New staff trained
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="temporary_staff_receive_necessary_training"
                    checked={formData.temporary_staff_receive_necessary_training}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("temporary_staff_receive_necessary_training", checked as boolean)
                    }
                  />
                  <Label htmlFor="temporary_staff_receive_necessary_training" className="cursor-pointer text-sm">
                    Temporary staff trained
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessments Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">Risk Assessments</CardTitle>
            <CardDescription>Risk assessment procedures and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff_carry_out_manual_handling_risk_assessment"
                  checked={formData.staff_carry_out_manual_handling_risk_assessment}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("staff_carry_out_manual_handling_risk_assessment", checked as boolean)
                  }
                />
                <Label htmlFor="staff_carry_out_manual_handling_risk_assessment" className="cursor-pointer text-sm">
                  Manual handling assessments
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment_used_mobility_risk_assessment"
                  checked={formData.equipment_used_mobility_risk_assessment}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("equipment_used_mobility_risk_assessment", checked as boolean)
                  }
                />
                <Label htmlFor="equipment_used_mobility_risk_assessment" className="cursor-pointer text-sm">
                  Mobility equipment assessments
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="computer_workstation_assessments_carried_out_recorded"
                  checked={formData.computer_workstation_assessments_carried_out_recorded}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("computer_workstation_assessments_carried_out_recorded", checked as boolean)
                  }
                />
                <Label htmlFor="computer_workstation_assessments_carried_out_recorded" className="cursor-pointer text-sm">
                  Workstation assessments
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Environment Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">Physical Environment</CardTitle>
            <CardDescription>Workplace conditions and equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="working_conditions_suitable_noise_lighting_ventilation_temperature"
                  checked={formData.working_conditions_suitable_noise_lighting_ventilation_temperature}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("working_conditions_suitable_noise_lighting_ventilation_temperature", checked as boolean)
                  }
                />
                <Label htmlFor="working_conditions_suitable_noise_lighting_ventilation_temperature" className="cursor-pointer text-sm">
                  Suitable working conditions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furniture_furnishings_good_condition_suitable_stable"
                  checked={formData.furniture_furnishings_good_condition_suitable_stable}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("furniture_furnishings_good_condition_suitable_stable", checked as boolean)
                  }
                />
                <Label htmlFor="furniture_furnishings_good_condition_suitable_stable" className="cursor-pointer text-sm">
                  Furniture in good condition
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment_suitable_maintained_good_condition"
                  checked={formData.equipment_suitable_maintained_good_condition}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("equipment_suitable_maintained_good_condition", checked as boolean)
                  }
                />
                <Label htmlFor="equipment_suitable_maintained_good_condition" className="cursor-pointer text-sm">
                  Equipment maintained
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="floor_surfaces_acceptable_condition"
                  checked={formData.floor_surfaces_acceptable_condition}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("floor_surfaces_acceptable_condition", checked as boolean)
                  }
                />
                <Label htmlFor="floor_surfaces_acceptable_condition" className="cursor-pointer text-sm">
                  Floor surfaces acceptable
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fire Safety Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">Fire Safety</CardTitle>
            <CardDescription>Fire safety procedures and equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fire_doors_kept_closed"
                  checked={formData.fire_doors_kept_closed}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("fire_doors_kept_closed", checked as boolean)
                  }
                />
                <Label htmlFor="fire_doors_kept_closed" className="cursor-pointer text-sm">
                  Fire doors closed
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notices_informing_staff_what_to_do_fire"
                  checked={formData.notices_informing_staff_what_to_do_fire}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("notices_informing_staff_what_to_do_fire", checked as boolean)
                  }
                />
                <Label htmlFor="notices_informing_staff_what_to_do_fire" className="cursor-pointer text-sm">
                  Fire procedure notices
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff_know_what_to_do_event_fire"
                  checked={formData.staff_know_what_to_do_event_fire}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("staff_know_what_to_do_event_fire", checked as boolean)
                  }
                />
                <Label htmlFor="staff_know_what_to_do_event_fire" className="cursor-pointer text-sm">
                  Staff know fire procedures
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Aid Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">First Aid</CardTitle>
            <CardDescription>First aid provisions and personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adequate_first_aiders_available"
                  checked={formData.adequate_first_aiders_available}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("adequate_first_aiders_available", checked as boolean)
                  }
                />
                <Label htmlFor="adequate_first_aiders_available" className="cursor-pointer text-sm">
                  Adequate first aiders
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="easy_to_find_first_aiders"
                  checked={formData.easy_to_find_first_aiders}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("easy_to_find_first_aiders", checked as boolean)
                  }
                />
                <Label htmlFor="easy_to_find_first_aiders" className="cursor-pointer text-sm">
                  First aiders easy to find
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Electrical Safety Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">Electrical Safety</CardTitle>
            <CardDescription>Electrical equipment and safety</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electricity_obvious_defects_electrical_equipment"
                  checked={formData.electricity_obvious_defects_electrical_equipment}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("electricity_obvious_defects_electrical_equipment", checked as boolean)
                  }
                />
                <Label htmlFor="electricity_obvious_defects_electrical_equipment" className="cursor-pointer text-sm">
                  No electrical defects
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sockets_overloaded"
                  checked={formData.sockets_overloaded}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("sockets_overloaded", checked as boolean)
                  }
                />
                <Label htmlFor="sockets_overloaded" className="cursor-pointer text-sm">
                  Sockets not overloaded
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_electrical_equipment_inspected"
                  checked={formData.all_electrical_equipment_inspected}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("all_electrical_equipment_inspected", checked as boolean)
                  }
                />
                <Label htmlFor="all_electrical_equipment_inspected" className="cursor-pointer text-sm">
                  All equipment inspected
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Safety Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-800">General Safety</CardTitle>
            <CardDescription>Additional safety information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="circulation_routes_kept_clear_obstructions_wires_cables_boxes"
                checked={formData.circulation_routes_kept_clear_obstructions_wires_cables_boxes}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("circulation_routes_kept_clear_obstructions_wires_cables_boxes", checked as boolean)
                }
              />
              <Label htmlFor="circulation_routes_kept_clear_obstructions_wires_cables_boxes" className="cursor-pointer">
                Circulation routes clear
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harmful_substances_in_use_precautions_agreed">Harmful Substances & Precautions</Label>
              <Textarea
                id="harmful_substances_in_use_precautions_agreed"
                name="harmful_substances_in_use_precautions_agreed"
                value={formData.harmful_substances_in_use_precautions_agreed}
                onChange={handleInputChange}
                placeholder="Describe any harmful substances in use and precautions taken..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Any additional comments about the inspection..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/inspections/health-safety")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Inspection
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
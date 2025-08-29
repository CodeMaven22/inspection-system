"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type {
  Inspection,
  InspectionType,
  MedicationAuditComprehensiveData,
  WeeklyMedicationAuditData,
  FireAlarmWeeklyData,
  SmokeAlarmWeeklyData,
  WorkerInspectionData,
  HealthSafetyChecklistData,
  FirstAidChecklistData,
  FirstAidChecklistItem,
} from "@/types/inspection"
import { useAuth } from "@/context/auth-context"

export default function NewInspectionPage() {
  const router = useRouter()
//   const { toast } = useToast()
  const { user } = useAuth()

  const [inspectionType, setInspectionType] = useState<InspectionType | "">("")
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTypeChange = (value: InspectionType) => {
    setInspectionType(value)
    // Initialize form data based on selected type
    const commonFields = {
      comments: "",
    }

    switch (value) {
      case "medication_audit_comprehensive":
        setFormData({
          client_name: "",
          client_id: "",
          date_of_audit: new Date().toISOString().split("T")[0],
          auditor_name: user?.first_name + " " + user?.last_name || "",
          medications_cabinet_securely_locked: false,
          medication_cabinet_clean_no_spillages: false,
          medications_have_opening_dates_original_labels: false,
          medication_label_has_client_details: false,
          medication_stored_correctly: false,
          current_marr_sheet_match_client_records: false,
          marr_sheet_list_all_medications_prescribed: false,
          gap_on_marr_sheet: false,
          boxed_bottled_medications_stock_count_entered: false,
          all_documentation_black_ink: false,
          control_drug_for_client: false,
          controlled_drugs_stored_recorded_correctly_count_correct: false,
          prn_medications: false,
          directives_for_prn_clear_comprehensive: false,
          missing_administration_why: "",
          medications_administration_coded_on_marr_sheet: false,
          records_of_refusal_gp_informed: false,
          transdermal_patch_protocol_for_use: false,
          client_take_any_blood_thinners_up_to_date_risk_assessment: false,
          short_course_medications: false,
          all_medications_prescribed_enough_for_28_day_cycle: false,
          order_of_medication_done_monthly_basis: false,
          returns_medication_recorded_correctly_returns_book: false,
          why_returns_medication_for_client: "",
          any_additional_comments: "",
          any_follow_up_requires_by_whom: "",
          staff_name: "",
          staff_signature: user?.first_name + " " + user?.last_name || "",
          ...commonFields,
        })
        break
      case "weekly_medication_audit":
        setFormData({
          client_name: "",
          client_id: "",
          date_of_audit: new Date().toISOString().split("T")[0],
          auditor_name: user?.first_name + " " + user?.last_name || "",
          medications_cabinet_securely_locked: false,
          medication_cabinet_clean_no_spillages: false,
          medications_have_opening_dates_original_labels: false,
          medication_label_has_client_details: false,
          medication_stored_correctly: false,
          current_marr_sheet_match_client_records: false,
          marr_sheet_list_all_medications_prescribed: false,
          gap_on_marr_sheet: false,
          boxed_bottled_medications_stock_count_entered: false,
          all_documentation_black_ink: false,
          control_drug_for_client: false,
          controlled_drugs_stored_recorded_correctly_count_correct: false,
          prn_medications: false,
          directives_for_prn_clear_comprehensive: false,
          missing_administration_why: "",
          medication_count_accurate: false,
          medication_expiry_checked: false,
          any_issues: "",
          staff_signature: user?.first_name + " " + user?.last_name || "",
          ...commonFields,
        })
        break
      case "fire_alarm_weekly":
        setFormData({
          location: "",
          date_of_check: new Date().toISOString().split("T")[0],
          checked_by: user?.first_name + " " + user?.last_name || "",
          time_of_check: new Date().toTimeString().split(" ")[0].substring(0, 5),
          point_checked: "",
          alarm_functional: false,
          call_points_accessible: false,
          emergency_lights_working: false,
          faults_identified_details: "",
          action_taken_details: "",
          management_book_initials: "",
          staff_signature_check: user?.first_name + " " + user?.last_name || "",
          ...commonFields,
        })
        break
      case "smoke_alarm_weekly":
        setFormData({
          location: "",
          date_of_check: new Date().toISOString().split("T")[0],
          checked_by: user?.first_name + " " + user?.last_name || "",
          installed_condition_ok: false,
          alarm_functional: false,
          battery_replaced: false,
          faults_identified: "",
          action_taken: "",
          management_book_initials: "",
          reported_to_management_by: "",
          date_reported: "",
          ...commonFields,
        })
        break
      case "worker_inspection":
        setFormData({
          worker_name: "",
          worker_id: "",
          date_of_inspection: new Date().toISOString().split("T")[0],
          inspector_name: user?.first_name + " " + user?.last_name || "",
          concern_description: "",
          recommendations: "",
          worker_signature: "",
          inspector_signature: user?.first_name + " " + user?.last_name || "",
          follow_up_required: false,
          follow_up_date: "",
          ...commonFields,
        })
        break
      case "health_safety_checklist":
        setFormData({
          inspection_conducted_by: user?.first_name + " " + user?.last_name || "",
          date_of_inspection: new Date().toISOString().split("T")[0],
          location: "",
          signature: "",
          previous_concerns_addressed: false,
          policy_up_to_date_local_health_safety: false,
          staff_issued_personal_copy_policy_told_text: false,
          health_safety_standing_item_agenda_previous_staff_meeting: false,
          all_staff_received_training_health_safety_procedures: false,
          new_staff_receive_training_beginning_employment: false,
          temporary_staff_receive_necessary_training: false,
          staff_carry_out_manual_handling_risk_assessment: false,
          equipment_used_mobility_risk_assessment: false,
          adequate_storage_medication: false,
          fire_doors_kept_closed: false,
          notices_informing_staff_what_to_do_fire: false,
          staff_know_what_to_do_event_fire: false,
          computer_workstation_assessments_carried_out_recorded: false,
          workstations_being_used_correctly_problems: false,
          working_conditions_suitable_noise_lighting_ventilation_temperature: false,
          furniture_furnishings_good_condition_suitable_stable: false,
          equipment_suitable_maintained_good_condition: false,
          harmful_substances_in_use_precautions_agreed: "",
          area_clean_tidy_especially_drink_food_preparation: false,
          adequate_first_aiders_available: false,
          easy_to_find_first_aiders: false,
          slips_trips_high_low_storage: false,
          suitable_means_accessing_storage_above_head_height_ladders_available: false,
          floor_surfaces_acceptable_condition: false,
          circulation_routes_kept_clear_obstructions_wires_cables_boxes: false,
          electricity_obvious_defects_electrical_equipment: false,
          sockets_overloaded: false,
          all_electrical_equipment_inspected: false,
          electrical_equipment_brought_into_bungalow_checked_before_use: false,
          accumulations_material_offices_fire_source: false,
          obstruction_ventilation_electrical_equipment: false,
          overloading_electrical_sockets: false,
          corridors_stairwells_clear_obstructions_storage_combustible: false,
          electrical_equipment_stairwells_corridors: false,
          ...commonFields,
        })
        break
      case "first_aid_checklist":
        setFormData({
          first_aid_kit_location: "",
          conducted_by: user?.first_name + " " + user?.last_name || "",
          date_of_inspection: new Date().toISOString().split("T")[0],
          items: [
            { item_name: "Absorbent compress", quantity: "", available: false },
            { item_name: "Adhesive bandages", quantity: "", available: false },
            { item_name: "Adhesive tape", quantity: "", available: false },
            { item_name: "Antiseptic, applications", quantity: "", available: false },
            { item_name: "Burn treatment applications", quantity: "", available: false },
            { item_name: "Pairs of medical exam gloves", quantity: "", available: false },
            { item_name: "Sterile pads", quantity: "", available: false },
            { item_name: "Triangular bandage", quantity: "", available: false },
            { item_name: "Gauze pads", quantity: "", available: false },
            { item_name: "Two large gauze pads", quantity: "", available: false },
            { item_name: "Box adhesive bandages (band-aids)", quantity: "", available: false },
            { item_name: "One package gauze roller bandage at least 2 inches wide", quantity: "", available: false },
            { item_name: "Two triangular bandages", quantity: "", available: false },
            { item_name: "Wound cleaning agent such as sealed moistened towelettes", quantity: "", available: false },
            { item_name: "Scissors", quantity: "", available: false },
            { item_name: "At least one blanket", quantity: "", available: false },
            { item_name: "Tweezers", quantity: "", available: false },
            { item_name: "Latex gloves", quantity: "", available: false },
            {
              item_name: "Resuscitation equipment such as resuscitation bag, airway, or pocket mask",
              quantity: "",
              available: false,
            },
            { item_name: "Two elastic wraps", quantity: "", available: false },
            { item_name: "Splint", quantity: "", available: false },
            { item_name: "Directions for requesting emergency assistance", quantity: "", available: false },
          ],
          ...commonFields,
        })
        break
      default:
        setFormData({})
        break
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev: any) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleItemChange = (index: number, field: keyof FirstAidChecklistItem, value: any) => {
    setFormData((prev: FirstAidChecklistData) => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      return { ...prev, items: newItems }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!inspectionType) {
      toast({
        title: "Error",
        description: "Please select an inspection type.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newInspection: Inspection = {
        id: `insp_${Date.now()}`,
        type: inspectionType,
        status: "pending", // Default status for new inspections
        created_at: new Date().toISOString(),
        created_by: user?.id || "unknown",
        submitted_by_role: user?.role || "admin",
        data: formData,
      }

      console.log("Submitting new inspection:", newInspection)

      toast({
        title: "Inspection Submitted",
        description: `A new ${inspectionType.replace(/_/g, " ")} inspection has been created.`,
        variant: "default",
      })
      router.push("/admin/inspections") // Redirect to inspections list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inspection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTypeSpecificFields = () => {
    switch (inspectionType) {
      case "medication_audit_comprehensive":
        const medCompData = formData as MedicationAuditComprehensiveData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input id="client_name" value={medCompData.client_name || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client ID</Label>
                <Input id="client_id" value={medCompData.client_id || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_audit">Date of Audit</Label>
                <Input
                  id="date_of_audit"
                  type="date"
                  value={medCompData.date_of_audit || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auditor_name">Auditor Name</Label>
                <Input id="auditor_name" value={medCompData.auditor_name || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_cabinet_securely_locked"
                  checked={medCompData.medications_cabinet_securely_locked || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medications_cabinet_securely_locked", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medications_cabinet_securely_locked">Medications cabinet securely locked?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_cabinet_clean_no_spillages"
                  checked={medCompData.medication_cabinet_clean_no_spillages || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medication_cabinet_clean_no_spillages", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medication_cabinet_clean_no_spillages">
                  Is medication cabinet clean and tidy, no spillages?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_have_opening_dates_original_labels"
                  checked={medCompData.medications_have_opening_dates_original_labels || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medications_have_opening_dates_original_labels", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medications_have_opening_dates_original_labels">
                  Do all medications have opening dates and have original labels on?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_label_has_client_details"
                  checked={medCompData.medication_label_has_client_details || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medication_label_has_client_details", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medication_label_has_client_details">
                  Does the medication label has the clients details on, e.g. Name/DOB/NHS number/GP details, Allergy,
                  etc?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_stored_correctly"
                  checked={medCompData.medication_stored_correctly || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "medication_stored_correctly", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="medication_stored_correctly">
                  Medication is stored correctly (Storage temperature is as per label, eg, room temperature, fridge,
                  etc)?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current_marr_sheet_match_client_records"
                  checked={medCompData.current_marr_sheet_match_client_records || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "current_marr_sheet_match_client_records", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="current_marr_sheet_match_client_records">
                  Does the current MARR sheet match the client's personal medical records?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marr_sheet_list_all_medications_prescribed"
                  checked={medCompData.marr_sheet_list_all_medications_prescribed || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "marr_sheet_list_all_medications_prescribed", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="marr_sheet_list_all_medications_prescribed">
                  Does the MARR sheet list all the medications that the GP and/or other care professional has prescribe
                  the client with?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gap_on_marr_sheet"
                  checked={medCompData.gap_on_marr_sheet || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "gap_on_marr_sheet", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="gap_on_marr_sheet">Is there any gap on the MARR sheet?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boxed_bottled_medications_stock_count_entered"
                  checked={medCompData.boxed_bottled_medications_stock_count_entered || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "boxed_bottled_medications_stock_count_entered", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="boxed_bottled_medications_stock_count_entered">
                  Boxed or bottled medications have got the stock count entered?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_documentation_black_ink"
                  checked={medCompData.all_documentation_black_ink || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "all_documentation_black_ink", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="all_documentation_black_ink">
                  All documentation, i.e. MARR sheet is completed in black ink?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="control_drug_for_client"
                  checked={medCompData.control_drug_for_client || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "control_drug_for_client", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="control_drug_for_client">Are there any control drug for this client?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlled_drugs_stored_recorded_correctly_count_correct"
                  checked={medCompData.controlled_drugs_stored_recorded_correctly_count_correct || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "controlled_drugs_stored_recorded_correctly_count_correct",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="controlled_drugs_stored_recorded_correctly_count_correct">
                  Controlled drug/s is/are stored and recorded correctly, is the count correct?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prn_medications"
                  checked={medCompData.prn_medications || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "prn_medications", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="prn_medications">Is there any PRN medications?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="directives_for_prn_clear_comprehensive"
                  checked={medCompData.directives_for_prn_clear_comprehensive || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "directives_for_prn_clear_comprehensive", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="directives_for_prn_clear_comprehensive">
                  Are directives for PRN clear and comprehensive?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_administration_coded_on_marr_sheet"
                  checked={medCompData.medications_administration_coded_on_marr_sheet || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medications_administration_coded_on_marr_sheet", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medications_administration_coded_on_marr_sheet">
                  Is there any medications administration coded on the MARR sheet?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="records_of_refusal_gp_informed"
                  checked={medCompData.records_of_refusal_gp_informed || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "records_of_refusal_gp_informed", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="records_of_refusal_gp_informed">
                  Is there records of refusal? If YES, is it more than 3 consecutive days and has the GP been informed?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transdermal_patch_protocol_for_use"
                  checked={medCompData.transdermal_patch_protocol_for_use || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "transdermal_patch_protocol_for_use", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="transdermal_patch_protocol_for_use">
                  Is there any transdermal patch? If YES, is there a protocol for the use of inhalers received from the
                  GP?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="client_take_any_blood_thinners_up_to_date_risk_assessment"
                  checked={medCompData.client_take_any_blood_thinners_up_to_date_risk_assessment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "client_take_any_blood_thinners_up_to_date_risk_assessment",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="client_take_any_blood_thinners_up_to_date_risk_assessment">
                  Does the client take any blood thinners? If Yes, is there an up to date Risk assessment for the blood
                  thinners?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="short_course_medications"
                  checked={medCompData.short_course_medications || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "short_course_medications", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="short_course_medications">
                  Are there any short course medications? Such as antibiotics, short term eye drops, etc?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_medications_prescribed_enough_for_28_day_cycle"
                  checked={medCompData.all_medications_prescribed_enough_for_28_day_cycle || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "all_medications_prescribed_enough_for_28_day_cycle", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="all_medications_prescribed_enough_for_28_day_cycle">
                  All the medications the client has been prescribed with, is enough for the current 28 day cycle of
                  medication?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="order_of_medication_done_monthly_basis"
                  checked={medCompData.order_of_medication_done_monthly_basis || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "order_of_medication_done_monthly_basis", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="order_of_medication_done_monthly_basis">
                  Is the order of medication done on the monthly basis by the service for the client? is NO, why?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="returns_medication_recorded_correctly_returns_book"
                  checked={medCompData.returns_medication_recorded_correctly_returns_book || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "returns_medication_recorded_correctly_returns_book", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="returns_medication_recorded_correctly_returns_book">
                  Is there any returns medication? If Yes, has it been recorded correctly in the returns book to go back
                  to the pharmacy?
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="missing_administration_why">Are there any missing administration? Is Yes, Why?</Label>
              <Textarea
                id="missing_administration_why"
                value={medCompData.missing_administration_why || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discrepancies_found">Discrepancies Found</Label>
              <Textarea
                id="discrepancies_found"
                value={medCompData.discrepancies_found || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_taken">Action Taken</Label>
              <Textarea id="action_taken" value={medCompData.action_taken || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="why_returns_medication_for_client">
                Why was there any returns of medication for this client?
              </Label>
              <Textarea
                id="why_returns_medication_for_client"
                value={medCompData.why_returns_medication_for_client || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="any_additional_comments">Any additional comments?</Label>
              <Textarea
                id="any_additional_comments"
                value={medCompData.any_additional_comments || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="any_follow_up_requires_by_whom">Any follow up requires? If YES, by whom?</Label>
              <Textarea
                id="any_follow_up_requires_by_whom"
                value={medCompData.any_follow_up_requires_by_whom || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff_name">Staff Name</Label>
              <Input id="staff_name" value={medCompData.staff_name || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff_signature">Staff Signature</Label>
              <Input id="staff_signature" value={medCompData.staff_signature || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={medCompData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "weekly_medication_audit":
        const weeklyMedData = formData as WeeklyMedicationAuditData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input id="client_name" value={weeklyMedData.client_name || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client ID</Label>
                <Input id="client_id" value={weeklyMedData.client_id || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_audit">Date of Audit</Label>
                <Input
                  id="date_of_audit"
                  type="date"
                  value={weeklyMedData.date_of_audit || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auditor_name">Auditor Name</Label>
                <Input id="auditor_name" value={weeklyMedData.auditor_name || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_cabinet_securely_locked"
                  checked={weeklyMedData.medications_cabinet_securely_locked || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medications_cabinet_securely_locked", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medications_cabinet_securely_locked">Medications cabinet securely locked?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_cabinet_clean_no_spillages"
                  checked={weeklyMedData.medication_cabinet_clean_no_spillages || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medication_cabinet_clean_no_spillages", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medication_cabinet_clean_no_spillages">
                  Is medication cabinet clean and tidy, no spillages?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications_have_opening_dates_original_labels"
                  checked={weeklyMedData.medications_have_opening_dates_original_labels || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medications_have_opening_dates_original_labels", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medications_have_opening_dates_original_labels">
                  Do all medications have opening dates and have original labels on?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_label_has_client_details"
                  checked={weeklyMedData.medication_label_has_client_details || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "medication_label_has_client_details", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="medication_label_has_client_details">
                  Does the medication label has the clients details on, e.g. Name/DOB/NHS number/GP details, Allergy,
                  etc?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_stored_correctly"
                  checked={weeklyMedData.medication_stored_correctly || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "medication_stored_correctly", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="medication_stored_correctly">
                  Medication is stored correctly (Storage temperature is as per label, eg, room temperature, fridge,
                  etc)?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current_marr_sheet_match_client_records"
                  checked={weeklyMedData.current_marr_sheet_match_client_records || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "current_marr_sheet_match_client_records", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="current_marr_sheet_match_client_records">
                  Does the current MARR sheet match the client's personal medical records?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marr_sheet_list_all_medications_prescribed"
                  checked={weeklyMedData.marr_sheet_list_all_medications_prescribed || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "marr_sheet_list_all_medications_prescribed", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="marr_sheet_list_all_medications_prescribed">
                  Does the MARR sheet list all the medications that the GP and/or other care professional has prescribe
                  the client with?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gap_on_marr_sheet"
                  checked={weeklyMedData.gap_on_marr_sheet || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "gap_on_marr_sheet", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="gap_on_marr_sheet">Is there any gap on the MARR sheet?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boxed_bottled_medications_stock_count_entered"
                  checked={weeklyMedData.boxed_bottled_medications_stock_count_entered || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "boxed_bottled_medications_stock_count_entered", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="boxed_bottled_medications_stock_count_entered">
                  Boxed or bottled medications have got the stock count entered?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_documentation_black_ink"
                  checked={weeklyMedData.all_documentation_black_ink || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "all_documentation_black_ink", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="all_documentation_black_ink">
                  All documentation, i.e. MARR sheet is completed in black ink?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="control_drug_for_client"
                  checked={weeklyMedData.control_drug_for_client || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "control_drug_for_client", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="control_drug_for_client">Are there any control drug for this client?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlled_drugs_stored_recorded_correctly_count_correct"
                  checked={weeklyMedData.controlled_drugs_stored_recorded_correctly_count_correct || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "controlled_drugs_stored_recorded_correctly_count_correct",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="controlled_drugs_stored_recorded_correctly_count_correct">
                  Controlled drug/s is/are stored and recorded correctly, is the count correct?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prn_medications"
                  checked={weeklyMedData.prn_medications || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "prn_medications", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="prn_medications">Is there any PRN medications?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="directives_for_prn_clear_comprehensive"
                  checked={weeklyMedData.directives_for_prn_clear_comprehensive || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "directives_for_prn_clear_comprehensive", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="directives_for_prn_clear_comprehensive">
                  Are directives for PRN clear and comprehensive?
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="missing_administration_why">Are there any missing administration? Is Yes, Why?</Label>
              <Textarea
                id="missing_administration_why"
                value={weeklyMedData.missing_administration_why || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_count_accurate"
                  checked={weeklyMedData.medication_count_accurate || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "medication_count_accurate", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="medication_count_accurate">Medication count accurate?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_expiry_checked"
                  checked={weeklyMedData.medication_expiry_checked || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "medication_expiry_checked", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="medication_expiry_checked">Medication expiry checked?</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="any_issues">Any Issues Identified</Label>
              <Textarea id="any_issues" value={weeklyMedData.any_issues || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff_signature">Staff Signature</Label>
              <Input
                id="staff_signature"
                value={weeklyMedData.staff_signature || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={weeklyMedData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "fire_alarm_weekly":
        const fireAlarmData = formData as FireAlarmWeeklyData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={fireAlarmData.location || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_check">Date of Check</Label>
                <Input
                  id="date_of_check"
                  type="date"
                  value={fireAlarmData.date_of_check || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checked_by">Checked By</Label>
                <Input id="checked_by" value={fireAlarmData.checked_by || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_of_check">Time of Check</Label>
                <Input
                  id="time_of_check"
                  type="time"
                  value={fireAlarmData.time_of_check || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="point_checked">Point Checked</Label>
              <Input id="point_checked" value={fireAlarmData.point_checked || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alarm_functional"
                  checked={fireAlarmData.alarm_functional || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "alarm_functional", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="alarm_functional">Alarm functional?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="call_points_accessible"
                  checked={fireAlarmData.call_points_accessible || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "call_points_accessible", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="call_points_accessible">Call points accessible?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency_lights_working"
                  checked={fireAlarmData.emergency_lights_working || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "emergency_lights_working", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="emergency_lights_working">Emergency lights working?</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faults_identified_details">Faults Identified</Label>
              <Textarea
                id="faults_identified_details"
                value={fireAlarmData.faults_identified_details || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_taken_details">Action Taken</Label>
              <Textarea
                id="action_taken_details"
                value={fireAlarmData.action_taken_details || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="management_book_initials">Management Book Initials</Label>
              <Input
                id="management_book_initials"
                value={fireAlarmData.management_book_initials || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff_signature_check">Signed by Staff Completing the Test</Label>
              <Input
                id="staff_signature_check"
                value={fireAlarmData.staff_signature_check || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={fireAlarmData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "smoke_alarm_weekly":
        const smokeAlarmData = formData as SmokeAlarmWeeklyData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={smokeAlarmData.location || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_check">Date of Check</Label>
                <Input
                  id="date_of_check"
                  type="date"
                  value={smokeAlarmData.date_of_check || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checked_by">Checked By</Label>
              <Input id="checked_by" value={smokeAlarmData.checked_by || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="installed_condition_ok"
                  checked={smokeAlarmData.installed_condition_ok || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "installed_condition_ok", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="installed_condition_ok">Installed condition (YES/NO)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alarm_functional"
                  checked={smokeAlarmData.alarm_functional || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "alarm_functional", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="alarm_functional">Alarm functional?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="battery_replaced"
                  checked={smokeAlarmData.battery_replaced || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "battery_replaced", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="battery_replaced">Battery replaced?</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faults_identified">Faults Identified</Label>
              <Textarea id="faults_identified" value={smokeAlarmData.faults_identified || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_taken">Action Taken</Label>
              <Textarea id="action_taken" value={smokeAlarmData.action_taken || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="management_book_initials">Management Book Initials</Label>
              <Input
                id="management_book_initials"
                value={smokeAlarmData.management_book_initials || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reported_to_management_by">Reported to management by</Label>
              <Input
                id="reported_to_management_by"
                value={smokeAlarmData.reported_to_management_by || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_reported">Date reported</Label>
              <Input
                id="date_reported"
                type="date"
                value={smokeAlarmData.date_reported || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={smokeAlarmData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "worker_inspection":
        const workerInspData = formData as WorkerInspectionData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="worker_name">Worker Name</Label>
                <Input id="worker_name" value={workerInspData.worker_name || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worker_id">Worker ID</Label>
                <Input id="worker_id" value={workerInspData.worker_id || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_inspection">Date of Inspection</Label>
                <Input
                  id="date_of_inspection"
                  type="date"
                  value={workerInspData.date_of_inspection || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector_name">Inspector Name</Label>
                <Input
                  id="inspector_name"
                  value={workerInspData.inspector_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="concern_description">Concern Description</Label>
              <Textarea
                id="concern_description"
                value={workerInspData.concern_description || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea id="recommendations" value={workerInspData.recommendations || ""} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="worker_signature">Worker Signature</Label>
                <Input
                  id="worker_signature"
                  value={workerInspData.worker_signature || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector_signature">Inspector Signature</Label>
                <Input
                  id="inspector_signature"
                  value={workerInspData.inspector_signature || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="follow_up_required"
                  checked={workerInspData.follow_up_required || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "follow_up_required", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="follow_up_required">Follow-up Required?</Label>
              </div>
              {workerInspData.follow_up_required && (
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-up Date</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={workerInspData.follow_up_date || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={workerInspData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "health_safety_checklist":
        const healthSafetyData = formData as HealthSafetyChecklistData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inspection_conducted_by">Inspection Conducted By</Label>
                <Input
                  id="inspection_conducted_by"
                  value={healthSafetyData.inspection_conducted_by || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_inspection">Date of Inspection</Label>
                <Input
                  id="date_of_inspection"
                  type="date"
                  value={healthSafetyData.date_of_inspection || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={healthSafetyData.location || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <Input id="signature" value={healthSafetyData.signature || ""} onChange={handleChange} required />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Previous Inspections</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previous_concerns_addressed"
                  checked={healthSafetyData.previous_concerns_addressed || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "previous_concerns_addressed", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="previous_concerns_addressed">
                  Have the concerns identified during the last inspection(s) been addressed?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Policy</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="policy_up_to_date_local_health_safety"
                  checked={healthSafetyData.policy_up_to_date_local_health_safety || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "policy_up_to_date_local_health_safety", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="policy_up_to_date_local_health_safety">
                  Is there an up to date Local Health and Safety Policy?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Discussion of health and safety matters</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff_issued_personal_copy_policy_told_text"
                  checked={healthSafetyData.staff_issued_personal_copy_policy_told_text || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "staff_issued_personal_copy_policy_told_text", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="staff_issued_personal_copy_policy_told_text">
                  Has each member of staff either been issued with a personal copy of the policy or had it drawn to
                  his/her attention and been told how to access the text of the policy?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="health_safety_standing_item_agenda_previous_staff_meeting"
                  checked={healthSafetyData.health_safety_standing_item_agenda_previous_staff_meeting || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "health_safety_standing_item_agenda_previous_staff_meeting",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="health_safety_standing_item_agenda_previous_staff_meeting">
                  Is health and safety been a standing item on the agenda of a previous staff meeting?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Training</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_staff_received_training_health_safety_procedures"
                  checked={healthSafetyData.all_staff_received_training_health_safety_procedures || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "all_staff_received_training_health_safety_procedures", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="all_staff_received_training_health_safety_procedures">
                  Have all staff received training in health and safety procedures?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new_staff_receive_training_beginning_employment"
                  checked={healthSafetyData.new_staff_receive_training_beginning_employment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "new_staff_receive_training_beginning_employment", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="new_staff_receive_training_beginning_employment">
                  Do new staff receive training at the beginning of their employment?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temporary_staff_receive_necessary_training"
                  checked={healthSafetyData.temporary_staff_receive_necessary_training || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "temporary_staff_receive_necessary_training", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="temporary_staff_receive_necessary_training">
                  Do temporary staff receive necessary training?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Manual handling</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff_carry_out_manual_handling_risk_assessment"
                  checked={healthSafetyData.staff_carry_out_manual_handling_risk_assessment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "staff_carry_out_manual_handling_risk_assessment", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="staff_carry_out_manual_handling_risk_assessment">
                  Do staff have to carry out any manual handling which might result in injuries? If so, is enough done
                  to reduce the risk of injuries to acceptable levels? (i.e. a manual handling assessment)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment_used_mobility_risk_assessment"
                  checked={healthSafetyData.equipment_used_mobility_risk_assessment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "equipment_used_mobility_risk_assessment", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="equipment_used_mobility_risk_assessment">
                  Is any equipment used for mobility (e.g. wheelchair, hoist etc) in good condition?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Storage</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adequate_storage_medication"
                  checked={healthSafetyData.adequate_storage_medication || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "adequate_storage_medication", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="adequate_storage_medication">Is there adequate storage for medication?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slips_trips_high_low_storage"
                  checked={healthSafetyData.slips_trips_high_low_storage || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "slips_trips_high_low_storage", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="slips_trips_high_low_storage">Is there and high/low storage?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suitable_means_accessing_storage_above_head_height_ladders_available"
                  checked={
                    healthSafetyData.suitable_means_accessing_storage_above_head_height_ladders_available || false
                  }
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "suitable_means_accessing_storage_above_head_height_ladders_available",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="suitable_means_accessing_storage_above_head_height_ladders_available">
                  Is there a suitable means of accessing all storage above head height? Are steps and ladders available?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="floor_surfaces_acceptable_condition"
                  checked={healthSafetyData.floor_surfaces_acceptable_condition || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "floor_surfaces_acceptable_condition", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="floor_surfaces_acceptable_condition">
                  Are floor surfaces in an acceptable condition?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="circulation_routes_kept_clear_obstructions_wires_cables_boxes"
                  checked={healthSafetyData.circulation_routes_kept_clear_obstructions_wires_cables_boxes || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "circulation_routes_kept_clear_obstructions_wires_cables_boxes",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="circulation_routes_kept_clear_obstructions_wires_cables_boxes">
                  Are circulation routes kept clear of obstructions including wires and cables, boxes, bags etc?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Electricity</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electricity_obvious_defects_electrical_equipment"
                  checked={healthSafetyData.electricity_obvious_defects_electrical_equipment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "electricity_obvious_defects_electrical_equipment", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="electricity_obvious_defects_electrical_equipment">
                  Are there any obvious defects in electrical equipment?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sockets_overloaded"
                  checked={healthSafetyData.sockets_overloaded || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "sockets_overloaded", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="sockets_overloaded">Are sockets overloaded?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all_electrical_equipment_inspected"
                  checked={healthSafetyData.all_electrical_equipment_inspected || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "all_electrical_equipment_inspected", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="all_electrical_equipment_inspected">Has all electrical equipment been inspected?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electrical_equipment_brought_into_bungalow_checked_before_use"
                  checked={healthSafetyData.electrical_equipment_brought_into_bungalow_checked_before_use || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "electrical_equipment_brought_into_bungalow_checked_before_use",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="electrical_equipment_brought_into_bungalow_checked_before_use">
                  Is there any electrical equipment which has been brought into the Bungalow by staff? If YES, is there
                  an equipment been checked before being put into use? Particularly heaters.
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Fire</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fire_doors_kept_closed"
                  checked={healthSafetyData.fire_doors_kept_closed || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "fire_doors_kept_closed", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="fire_doors_kept_closed">
                  Are fire doors kept closed at all times (rather than being wedged open)?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notices_informing_staff_what_to_do_fire"
                  checked={healthSafetyData.notices_informing_staff_what_to_do_fire || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "notices_informing_staff_what_to_do_fire", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="notices_informing_staff_what_to_do_fire">
                  Are there notices informing staff of what to do in event of fire?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff_know_what_to_do_event_fire"
                  checked={healthSafetyData.staff_know_what_to_do_event_fire || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "staff_know_what_to_do_event_fire", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="staff_know_what_to_do_event_fire">Do staff know what to do in event of fire?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accumulations_material_offices_fire_source"
                  checked={healthSafetyData.accumulations_material_offices_fire_source || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "accumulations_material_offices_fire_source", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="accumulations_material_offices_fire_source">
                  Are there any accumulations of material in offices which might be a source of fire?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="obstruction_ventilation_electrical_equipment"
                  checked={healthSafetyData.obstruction_ventilation_electrical_equipment || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "obstruction_ventilation_electrical_equipment", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="obstruction_ventilation_electrical_equipment">
                  Is there any obstruction of ventilation of electrical equipment?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overloading_electrical_sockets"
                  checked={healthSafetyData.overloading_electrical_sockets || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "overloading_electrical_sockets", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="overloading_electrical_sockets">Is there any overloading of electrical sockets?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="corridors_stairwells_clear_obstructions_storage_combustible"
                  checked={healthSafetyData.corridors_stairwells_clear_obstructions_storage_combustible || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "corridors_stairwells_clear_obstructions_storage_combustible",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="corridors_stairwells_clear_obstructions_storage_combustible">
                  Are corridors and stairwells clear of obstructions and storage of combustible material?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electrical_equipment_stairwells_corridors"
                  checked={healthSafetyData.electrical_equipment_stairwells_corridors || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "electrical_equipment_stairwells_corridors", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="electrical_equipment_stairwells_corridors">
                  Is there any electrical equipment in stairwells or corridors?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Workstations</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="computer_workstation_assessments_carried_out_recorded"
                  checked={healthSafetyData.computer_workstation_assessments_carried_out_recorded || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "computer_workstation_assessments_carried_out_recorded",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="computer_workstation_assessments_carried_out_recorded">
                  Have computer workstation assessments been carried out and recorded?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="workstations_being_used_correctly_problems"
                  checked={healthSafetyData.workstations_being_used_correctly_problems || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "workstations_being_used_correctly_problems", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="workstations_being_used_correctly_problems">
                  Are workstations being used correctly? Do any staff have problems using their workstations?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="working_conditions_suitable_noise_lighting_ventilation_temperature"
                  checked={healthSafetyData.working_conditions_suitable_noise_lighting_ventilation_temperature || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: {
                        id: "working_conditions_suitable_noise_lighting_ventilation_temperature",
                        type: "checkbox",
                        checked,
                      },
                    } as any)
                  }
                />
                <Label htmlFor="working_conditions_suitable_noise_lighting_ventilation_temperature">
                  Are the working conditions suitable? Noise? Lighting? Ventilation? Temperature?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Furniture and Furnishings</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furniture_furnishings_good_condition_suitable_stable"
                  checked={healthSafetyData.furniture_furnishings_good_condition_suitable_stable || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "furniture_furnishings_good_condition_suitable_stable", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="furniture_furnishings_good_condition_suitable_stable">
                  Is furniture and furnishings in good condition, suitable and stable?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Equipment</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment_suitable_maintained_good_condition"
                  checked={healthSafetyData.equipment_suitable_maintained_good_condition || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "equipment_suitable_maintained_good_condition", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="equipment_suitable_maintained_good_condition">
                  Is equipment suitable and maintained in good condition?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Harmful Substances</h3>
            <div className="space-y-2">
              <Label htmlFor="harmful_substances_in_use_precautions_agreed">
                Are there any harmful substances in use? Have the precautions necessary for their use been agreed?
              </Label>
              <Textarea
                id="harmful_substances_in_use_precautions_agreed"
                value={healthSafetyData.harmful_substances_in_use_precautions_agreed || ""}
                onChange={handleChange}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Hygiene</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="area_clean_tidy_especially_drink_food_preparation"
                  checked={healthSafetyData.area_clean_tidy_especially_drink_food_preparation || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "area_clean_tidy_especially_drink_food_preparation", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="area_clean_tidy_especially_drink_food_preparation">
                  Is the area clean and tidy, especially drink and food preparation area?
                </Label>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">First aid</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adequate_first_aiders_available"
                  checked={healthSafetyData.adequate_first_aiders_available || false}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { id: "adequate_first_aiders_available", type: "checkbox", checked },
                    } as any)
                  }
                />
                <Label htmlFor="adequate_first_aiders_available">
                  Are there adequate first aiders available in event of an emergency? Is it easy for staff to find out
                  who the first aiders are?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="easy_to_find_first_aiders"
                  checked={healthSafetyData.easy_to_find_first_aiders || false}
                  onCheckedChange={(checked) =>
                    handleChange({ target: { id: "easy_to_find_first_aiders", type: "checkbox", checked } } as any)
                  }
                />
                <Label htmlFor="easy_to_find_first_aiders">
                  Is it easy for staff to find out who the first aiders are?
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={healthSafetyData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      case "first_aid_checklist":
        const firstAidData = formData as FirstAidChecklistData
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_aid_kit_location">First Aid Kit Location</Label>
                <Input
                  id="first_aid_kit_location"
                  value={firstAidData.first_aid_kit_location || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conducted_by">Conducted By</Label>
                <Input id="conducted_by" value={firstAidData.conducted_by || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_inspection">Date of Inspection</Label>
              <Input
                id="date_of_inspection"
                type="date"
                value={firstAidData.date_of_inspection || ""}
                onChange={handleChange}
                required
              />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Minimum Requirements for Workplace First-aid Kits and Supplies
            </h3>
            <div className="space-y-4">
              {firstAidData.items?.map((item, index) => (
                <div key={index} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={`item-${index}`}>{item.item_name}</Label>
                  <Input
                    id={`item-${index}-quantity`}
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="col-span-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${index}-available`}
                      checked={item.available}
                      onCheckedChange={(checked) => handleItemChange(index, "available", checked)}
                    />
                    <Label htmlFor={`item-${index}-available`}>Available</Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={firstAidData.comments || ""} onChange={handleChange} />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Inspection</h1>
      <p className="text-muted-foreground">Fill out the form to record a new inspection.</p>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Select the type of inspection and provide the necessary information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="inspectionType">Inspection Type</Label>
              <Select value={inspectionType} onValueChange={handleTypeChange} required>
                <SelectTrigger id="inspectionType">
                  <SelectValue placeholder="Select an inspection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication_audit_comprehensive">Comprehensive Medication Audit</SelectItem>
                  <SelectItem value="weekly_medication_audit">Weekly Medication Audit</SelectItem>
                  <SelectItem value="fire_alarm_weekly">Weekly Fire Alarm Check</SelectItem>
                  <SelectItem value="smoke_alarm_weekly">Weekly Smoke Alarm Check</SelectItem>
                  <SelectItem value="worker_inspection">Worker Inspection</SelectItem>
                  <SelectItem value="health_safety_checklist">Health and Safety Checklist</SelectItem>
                  <SelectItem value="first_aid_checklist">First Aid Checklist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inspectionType && renderTypeSpecificFields()}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Inspection"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

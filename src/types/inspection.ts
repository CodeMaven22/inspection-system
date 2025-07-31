export type InspectionType =
  | "medication_audit_comprehensive"
  | "weekly_medication_audit"
  | "fire_alarm_weekly"
  | "smoke_alarm_weekly"
  | "worker_inspection"
  | "health_safety_checklist"
  | "first_aid_checklist"

export type InspectionStatus = "pending" | "approved" | "rejected" | "completed" | "draft"

export interface MedicationAuditComprehensiveData {
  client_name: string
  client_id: string
  date_of_audit: string
  auditor_name: string
  medications_cabinet_securely_locked: boolean
  medication_cabinet_clean_no_spillages: boolean
  medications_have_opening_dates_original_labels: boolean
  medication_label_has_client_details: boolean
  medication_stored_correctly: boolean
  current_marr_sheet_match_client_records: boolean
  marr_sheet_list_all_medications_prescribed: boolean
  gap_on_marr_sheet: boolean
  boxed_bottled_medications_stock_count_entered: boolean
  all_documentation_black_ink: boolean
  control_drug_for_client: boolean
  controlled_drugs_stored_recorded_correctly_count_correct: boolean
  prn_medications: boolean
  directives_for_prn_clear_comprehensive: boolean
  missing_administration_why: string
  medications_administration_coded_on_marr_sheet: boolean
  records_of_refusal_gp_informed: boolean
  transdermal_patch_protocol_for_use: boolean
  client_take_any_blood_thinners_up_to_date_risk_assessment: boolean
  short_course_medications: boolean
  all_medications_prescribed_enough_for_28_day_cycle: boolean
  order_of_medication_done_monthly_basis: boolean
  returns_medication_recorded_correctly_returns_book: boolean
  why_returns_medication_for_client: string
  any_additional_comments: string
  any_follow_up_requires_by_whom: string
  staff_name: string
  staff_signature: string
  comments: string
}

export interface WeeklyMedicationAuditData {
  client_name: string
  client_id: string
  date_of_audit: string
  auditor_name: string
  medications_cabinet_securely_locked: boolean
  medication_cabinet_clean_no_spillages: boolean
  medications_have_opening_dates_original_labels: boolean
  medication_label_has_client_details: boolean
  medication_stored_correctly: boolean
  current_marr_sheet_match_client_records: boolean
  marr_sheet_list_all_medications_prescribed: boolean
  gap_on_marr_sheet: boolean
  boxed_bottled_medications_stock_count_entered: boolean
  all_documentation_black_ink: boolean
  control_drug_for_client: boolean
  controlled_drugs_stored_recorded_correctly_count_correct: boolean
  prn_medications: boolean
  directives_for_prn_clear_comprehensive: boolean
  missing_administration_why: string
  medication_count_accurate: boolean // Existing field
  medication_expiry_checked: boolean // Existing field
  any_issues: string // Existing field
  staff_signature: string // Existing field
  comments: string // Existing field
}

export interface FireAlarmWeeklyData {
  location: string
  date_of_check: string
  checked_by: string
  time_of_check: string // New
  point_checked: string // New (e.g., Kitchen, Office, TV Room)
  alarm_functional: boolean
  call_points_accessible: boolean
  emergency_lights_working: boolean
  faults_identified_details: string // Renamed from faults_identified
  action_taken_details: string // Renamed from action_taken
  management_book_initials: string
  staff_signature_check: string // New
  comments: string
}

export interface SmokeAlarmWeeklyData {
  location: string
  date_of_check: string
  checked_by: string
  installed_condition_ok: boolean // New
  alarm_functional: boolean
  battery_replaced: boolean
  faults_identified: string
  action_taken: string
  management_book_initials: string
  reported_to_management_by: string // New
  date_reported: string // New
  comments: string
}

export interface WorkerInspectionData {
  worker_name: string
  worker_id: string
  date_of_inspection: string
  inspector_name: string
  concern_description: string
  recommendations: string
  worker_signature: string
  inspector_signature: string
  follow_up_required: boolean
  follow_up_date?: string
  comments: string
}

export interface HealthSafetyChecklistData {
  inspection_conducted_by: string
  date_of_inspection: string
  location: string
  signature: string
  previous_concerns_addressed: boolean
  policy_up_to_date_local_health_safety: boolean
  staff_issued_personal_copy_policy_told_text: boolean
  health_safety_standing_item_agenda_previous_staff_meeting: boolean
  all_staff_received_training_health_safety_procedures: boolean
  new_staff_receive_training_beginning_employment: boolean
  temporary_staff_receive_necessary_training: boolean
  staff_carry_out_manual_handling_risk_assessment: boolean
  equipment_used_mobility_risk_assessment: boolean
  adequate_storage_medication: boolean
  fire_doors_kept_closed: boolean
  notices_informing_staff_what_to_do_fire: boolean
  staff_know_what_to_do_event_fire: boolean
  computer_workstation_assessments_carried_out_recorded: boolean
  workstations_being_used_correctly_problems: boolean
  working_conditions_suitable_noise_lighting_ventilation_temperature: boolean
  furniture_furnishings_good_condition_suitable_stable: boolean
  equipment_suitable_maintained_good_condition: boolean
  harmful_substances_in_use_precautions_agreed: string
  area_clean_tidy_especially_drink_food_preparation: boolean
  adequate_first_aiders_available: boolean
  easy_to_find_first_aiders: boolean
  slips_trips_high_low_storage: boolean
  suitable_means_accessing_storage_above_head_height_ladders_available: boolean
  floor_surfaces_acceptable_condition: boolean
  circulation_routes_kept_clear_obstructions_wires_cables_boxes: boolean
  electricity_obvious_defects_electrical_equipment: boolean
  sockets_overloaded: boolean
  all_electrical_equipment_inspected: boolean
  electrical_equipment_brought_into_bungalow_checked_before_use: boolean
  accumulations_material_offices_fire_source: boolean
  obstruction_ventilation_electrical_equipment: boolean
  overloading_electrical_sockets: boolean
  corridors_stairwells_clear_obstructions_storage_combustible: boolean
  electrical_equipment_stairwells_corridors: boolean
  comments: string
}

export interface FirstAidChecklistItem {
  item_name: string
  quantity: string
  available: boolean
}

export interface FirstAidChecklistData {
  first_aid_kit_location: string
  conducted_by: string
  date_of_inspection: string
  items: FirstAidChecklistItem[]
  comments: string
}

export interface Inspection {
  id: string
  type: InspectionType
  status: InspectionStatus
  created_at: string
  created_by: string // User ID or Name
  submitted_by_role: "worker" | "inspector" | "admin" | "team_leader"
  approval_status?: "pending" | "approved" | "rejected"
  approved_by?: string // User ID or Name of approver
  approval_date?: string
  approval_comments?: string
  data:
    | MedicationAuditComprehensiveData
    | WeeklyMedicationAuditData
    | FireAlarmWeeklyData
    | SmokeAlarmWeeklyData
    | WorkerInspectionData
    | HealthSafetyChecklistData
    | FirstAidChecklistData
}

interface FireAlarmInspection {
  id: string
  location: string
  client_name: string
  point_checked: string
  alarm_functional: boolean
  call_points_accessible: boolean
  emergency_lights_working: boolean
  faults_identified_details: string
  action_taken_details: string
  management_book_initials: string
  comments: string
  created_at: string
}

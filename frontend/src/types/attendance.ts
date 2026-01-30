export interface Attendance {
  id: number
  employee_id: number
  date: string
  status: 'present' | 'absent'
}

export interface AttendanceCreate {
  employee_id: number
  date: string
  status: 'present' | 'absent'
}

export interface AttendanceSummaryEmployee {
  id: number
  employee_id: string
  full_name: string
  department: string
  present_days: number
  absent_days: number
}

export interface AttendanceSummaryResponse {
  total_attendance_records: number
  employees: AttendanceSummaryEmployee[]
}

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

import { apiFetch, apiDelete } from './api'
import type { Attendance, AttendanceCreate } from '../types/attendance'

export function fetchAttendance(employeeId?: number): Promise<Attendance[]> {
  const q = employeeId != null ? `?employee_id=${employeeId}` : ''
  return apiFetch<Attendance[]>(`/attendance${q}`)
}

export function markAttendance(data: AttendanceCreate): Promise<Attendance> {
  return apiFetch<Attendance>('/attendance', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteAttendance(id: number): Promise<void> {
  return apiDelete(`/attendance/${id}`)
}

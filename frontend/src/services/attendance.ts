import { apiFetch, apiDelete } from './api'
import type {
  Attendance,
  AttendanceCreate,
  AttendanceSummaryResponse,
} from '../types/attendance'

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v))
  })
  const q = search.toString()
  return q ? `?${q}` : ''
}

export function fetchAttendance(params?: {
  employee_id?: number
  date_from?: string
  date_to?: string
}): Promise<Attendance[]> {
  const q = buildQuery(params ?? {})
  return apiFetch<Attendance[]>(`/attendance${q}`)
}

export function fetchAttendanceSummary(params?: {
  date_from?: string
  date_to?: string
}): Promise<AttendanceSummaryResponse> {
  const q = buildQuery(params ?? {})
  return apiFetch<AttendanceSummaryResponse>(`/attendance/summary${q}`)
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

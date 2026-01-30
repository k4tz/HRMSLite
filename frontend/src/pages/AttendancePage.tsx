import { useState, useEffect } from 'react'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Table, TableHead, TableBody, Th, Td } from '../components/Table'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { fetchEmployees } from '../services/employees'
import { fetchAttendance, markAttendance } from '../services/attendance'
import type { Employee } from '../types/employee'
import type { Attendance } from '../types/attendance'

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
]

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('')
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ employee_id: 0, date: '', status: 'present' as 'present' | 'absent' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadEmployees = async () => {
    setLoadingEmployees(true)
    setError(null)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
      if (data.length > 0 && !form.employee_id) setForm((f) => ({ ...f, employee_id: data[0].id }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load employees')
    } finally {
      setLoadingEmployees(false)
    }
  }

  const loadAttendance = async (employeeId?: number) => {
    setLoadingAttendance(true)
    setError(null)
    try {
      const data = await fetchAttendance(employeeId)
      setAttendance(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attendance')
    } finally {
      setLoadingAttendance(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployeeId === '') {
      loadAttendance()
    } else {
      loadAttendance(Number(selectedEmployeeId))
    }
  }, [selectedEmployeeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.date) {
      setFormError('Date is required.')
      return
    }
    if (!form.employee_id) {
      setFormError('Select an employee.')
      return
    }
    setSubmitting(true)
    try {
      await markAttendance({
        employee_id: form.employee_id,
        date: form.date,
        status: form.status,
      })
      setForm((f) => ({ ...f, date: '' }))
      if (selectedEmployeeId === '' || selectedEmployeeId === form.employee_id) {
        loadAttendance(selectedEmployeeId === '' ? undefined : form.employee_id)
      }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to mark attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const employeeOptions = employees.map((e) => ({ value: String(e.id), label: `${e.employee_id} – ${e.full_name}` }))
  const today = new Date().toISOString().slice(0, 10)

  return (
    <PageSection title="Attendance">
      {loadingEmployees ? (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner />
          </div>
        </Card>
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => (selectedEmployeeId === '' ? loadEmployees() : loadAttendance(Number(selectedEmployeeId)))} />
      ) : employees.length === 0 ? (
        <Card>
          <EmptyState
            title="No employees yet"
            description="Add employees first, then you can mark attendance."
          />
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600 }}>Mark attendance</h2>
            <form onSubmit={handleSubmit}>
              {formError && <ErrorMessage message={formError} />}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ minWidth: 200 }}>
                  <Select
                    label="Employee"
                    options={[{ value: '', label: 'Select employee' }, ...employeeOptions]}
                    value={form.employee_id ? String(form.employee_id) : ''}
                    onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value ? Number(e.target.value) : 0 }))}
                  />
                </div>
                <div style={{ minWidth: 140 }}>
                  <Input
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    max={today}
                    required
                  />
                </div>
                <div style={{ minWidth: 120 }}>
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'present' | 'absent' }))}
                  />
                </div>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Mark'}
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600 }}>Attendance records</h2>
            <Select
              label="Filter by employee"
              options={[{ value: '', label: 'All employees' }, ...employeeOptions]}
              value={selectedEmployeeId === '' ? '' : String(selectedEmployeeId)}
              onChange={(e) => setSelectedEmployeeId(e.target.value === '' ? '' : Number(e.target.value))}
            />
            {loadingAttendance ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner />
              </div>
            ) : attendance.length === 0 ? (
              <EmptyState
                title="No attendance records"
                description={selectedEmployeeId ? 'Mark attendance for this employee to see records here.' : 'Mark attendance to see records here.'}
              />
            ) : (
              <Table>
                <TableHead>
                  <Th>Employee</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </TableHead>
                <TableBody>
                  {attendance.map((a) => {
                    const emp = employees.find((e) => e.id === a.employee_id)
                    return (
                      <tr key={a.id}>
                        <Td>{emp ? `${emp.employee_id} – ${emp.full_name}` : a.employee_id}</Td>
                        <Td>{formatDate(a.date)}</Td>
                        <Td style={{ textTransform: 'capitalize' }}>{a.status}</Td>
                      </tr>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </>
      )}
    </PageSection>
  )
}

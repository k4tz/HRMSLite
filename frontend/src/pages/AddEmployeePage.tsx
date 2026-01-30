import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { ErrorMessage } from '../components/ErrorMessage'
import { createEmployee } from '../services/employees'
import type { EmployeeCreate } from '../types/employee'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AddEmployeePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<EmployeeCreate>({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EmployeeCreate, string>>>({})

  const validate = (): boolean => {
    const err: Partial<Record<keyof EmployeeCreate, string>> = {}
    if (!form.employee_id.trim()) err.employee_id = 'Employee ID is required.'
    if (!form.full_name.trim()) err.full_name = 'Full name is required.'
    if (!form.email.trim()) err.email = 'Email is required.'
    else if (!emailRegex.test(form.email.trim())) err.email = 'Enter a valid email address.'
    if (!form.department.trim()) err.department = 'Department is required.'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await createEmployee({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department.trim(),
      })
      navigate('/employees')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageSection title="Add Employee">
      <Card>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ marginBottom: '1rem' }}>
              <ErrorMessage message={error} />
            </div>
          )}
          <Input
            label="Employee ID"
            value={form.employee_id}
            onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            error={fieldErrors.employee_id}
            placeholder="e.g. EMP001"
            required
          />
          <Input
            label="Full Name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            error={fieldErrors.full_name}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={fieldErrors.email}
            placeholder="john@company.com"
            required
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            error={fieldErrors.department}
            placeholder="e.g. Engineering"
            required
          />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Employee'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageSection>
  )
}

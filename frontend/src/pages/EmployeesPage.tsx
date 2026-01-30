import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Table, TableHead, TableBody, Th, Td } from '../components/Table'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { fetchEmployees, deleteEmployee } from '../services/employees'
import type { Employee } from '../types/employee'

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: number, employeeId: string) => {
    if (!window.confirm(`Delete employee "${employeeId}"? This will also remove their attendance records.`)) return
    setDeletingId(id)
    try {
      await deleteEmployee(id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete employee')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <PageSection title="Employees">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner />
          </div>
        </Card>
      </PageSection>
    )
  }

  if (error) {
    return (
      <PageSection title="Employees">
        <ErrorMessage message={error} onRetry={load} />
      </PageSection>
    )
  }

  return (
    <PageSection
      title="Employees"
      action={
        <Link to="/employees/add">
          <Button variant="primary">Add Employee</Button>
        </Link>
      }
    >
      <Card>
        {employees.length === 0 ? (
          <EmptyState
            title="No employees yet"
            description="Add your first employee to get started."
          />
        ) : (
          <Table>
            <TableHead>
              <Th>Employee ID</Th>
              <Th>Full Name</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th style={{ width: 100 }}></Th>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <Td>{emp.employee_id}</Td>
                  <Td>{emp.full_name}</Td>
                  <Td>{emp.email}</Td>
                  <Td>{emp.department}</Td>
                  <Td>
                    <Button
                      variant="danger"
                      disabled={deletingId === emp.id}
                      onClick={() => handleDelete(emp.id, emp.employee_id)}
                    >
                      {deletingId === emp.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageSection>
  )
}

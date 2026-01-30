import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Table, TableHead, TableBody, Th, Td } from '../components/Table'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { fetchAttendanceSummary } from '../services/attendance'
import type { AttendanceSummaryResponse } from '../types/attendance'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const [summary, setSummary] = useState<AttendanceSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAttendanceSummary({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      })
      setSummary(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [dateFrom, dateTo])

  if (loading && !summary) {
    return (
      <PageSection title="Dashboard">
        <Card>
          <div className={styles.spinner}>
            <Spinner />
          </div>
        </Card>
      </PageSection>
    )
  }

  if (error && !summary) {
    return (
      <PageSection title="Dashboard">
        <ErrorMessage message={error} onRetry={load} />
      </PageSection>
    )
  }

  const totalEmployees = summary?.employees.length ?? 0
  const totalRecords = summary?.total_attendance_records ?? 0

  return (
    <PageSection title="Dashboard">
      <p className={styles.intro}>
        Overview of employees and attendance. Use the date range to filter the summary below.
      </p>

      <div className={styles.filters}>
        <div className={styles.filterInput}>
          <Input
            label="From date"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className={styles.filterInput}>
          <Input
            label="To date"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.cards}>
        <Card className={styles.card}>
          <span className={styles.cardLabel}>Total employees</span>
          <span className={styles.cardValue}>{totalEmployees}</span>
          <Link to="/employees">
            <Button variant="secondary" className={styles.cardAction}>View employees</Button>
          </Link>
        </Card>
        <Card className={styles.card}>
          <span className={styles.cardLabel}>Total attendance records</span>
          <span className={styles.cardValue}>{totalRecords}</span>
          <Link to="/attendance">
            <Button variant="secondary" className={styles.cardAction}>View attendance</Button>
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className={styles.tableTitle}>Present & absent days per employee</h2>
        {summary?.employees.length === 0 ? (
          <EmptyState
            title="No employees"
            description="Add employees to see present/absent day counts here."
          />
        ) : (
          <Table>
            <TableHead>
              <Th>Employee ID</Th>
              <Th>Full Name</Th>
              <Th>Department</Th>
              <Th>Present days</Th>
              <Th>Absent days</Th>
            </TableHead>
            <TableBody>
              {summary?.employees.map((row) => (
                <tr key={row.id}>
                  <Td>{row.employee_id}</Td>
                  <Td>{row.full_name}</Td>
                  <Td>{row.department}</Td>
                  <Td>{row.present_days}</Td>
                  <Td>{row.absent_days}</Td>
                </tr>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageSection>
  )
}

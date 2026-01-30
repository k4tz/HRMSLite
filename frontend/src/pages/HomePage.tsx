import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import styles from './HomePage.module.css'

const linkCards = [
  { to: '/dashboard', title: 'Dashboard', description: 'Summary, counts, and present days per employee' },
  { to: '/employees', title: 'Employees', description: 'View and manage employee records' },
  { to: '/employees/add', title: 'Add Employee', description: 'Add a new employee' },
  { to: '/attendance', title: 'Attendance', description: 'Mark and view daily attendance' },
]

export function HomePage() {
  return (
    <PageSection title="Welcome to HRMS Lite">
      <p className={styles.intro}>
        Manage employee records and track daily attendance from a single place.
      </p>
      <div className={styles.cardGrid}>
        {linkCards.map((item) => (
          <Link key={item.to} to={item.to} className={styles.cardLink}>
            <Card className={styles.linkCard}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageSection>
  )
}

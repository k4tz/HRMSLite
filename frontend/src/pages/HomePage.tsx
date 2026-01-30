import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { Card } from '../components/Card'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <PageSection title="Welcome to HRMS Lite">
      <Card>
        <p className={styles.intro}>
          Manage employee records and track daily attendance from a single place.
        </p>
        <ul className={styles.links}>
          <li>
            <Link to="/employees">View employees</Link>
          </li>
          <li>
            <Link to="/employees/add">Add a new employee</Link>
          </li>
          <li>
            <Link to="/attendance">Mark & view attendance</Link>
          </li>
        </ul>
      </Card>
    </PageSection>
  )
}

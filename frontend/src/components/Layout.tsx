import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/employees', label: 'Employees' },
  { to: '/employees/add', label: 'Add Employee' },
  { to: '/attendance', label: 'Attendance' },
]

export function Layout() {
  const location = useLocation()
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          HRMS Lite
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? styles.navActive : styles.navLink}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

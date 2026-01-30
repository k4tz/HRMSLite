import { type HTMLAttributes } from 'react'
import styles from './PageSection.module.css'

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

export function PageSection({ title, children, action, ...props }: PageSectionProps) {
  return (
    <section className={styles.section} {...props}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {action && <div className={styles.action}>{action}</div>}
      </header>
      {children}
    </section>
  )
}

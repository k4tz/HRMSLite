import { type HTMLAttributes } from 'react'
import styles from './Table.module.css'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${className}`.trim()} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={styles.thead} {...props}><tr>{children}</tr></thead>
}

export function TableBody({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={styles.tbody} {...props}>{children}</tbody>
}

export function Th({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={styles.th} {...props}>{children}</th>
}

export function Td({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={styles.td} {...props}>{children}</td>
}
